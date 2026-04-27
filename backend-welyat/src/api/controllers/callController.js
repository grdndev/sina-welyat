const { Call, CallPaymentIntent, User, BusinessMode, Transaction, Rating } = require('../../models');
const CallStateMachine = require('../../services/CallStateMachine');
const ScoringService = require('../../services/ScoringService');
const MatchingService = require('../../services/MatchingService');
const TwilioService = require('../../services/TwilioService');
const StripeService = require('../../services/StripeService');
const logger = require('../../config/logger');
const { Op } = require('sequelize');
const { body } = require('express-validator');
const { sequelize } = require('../../config/database');

async function billCall(call, twilioTotalSeconds = null) {
    return sequelize.transaction(async (t) => {
        const intents = await CallPaymentIntent.findAll({
            where: { call_id: call.id, status: 'authorized' },
            order: [['created_at', 'ASC']],
            lock: t.LOCK.UPDATE,
            transaction: t,
        });
        if (!intents.length) return false;

        const talker = await User.findByPk(call.talker_id, { lock: t.LOCK.UPDATE, transaction: t });
        const freeSeconds = talker ? (talker.bonus_seconds || 0) : 0;

        const SERVICE_FEE_CENTS = 20;
        const RATE_CENTS_PER_SECOND = 0.33 / 60 * 100;
        const totalSeconds = twilioTotalSeconds ?? ((call.duration_free_seconds || 0) + (call.duration_paid_seconds || 0));
        const usedFreeSeconds = Math.min(totalSeconds, freeSeconds);
        const billableSeconds = totalSeconds - usedFreeSeconds;
        const totalCents = Math.round(SERVICE_FEE_CENTS + billableSeconds * RATE_CENTS_PER_SECOND);
        let remainingCents = totalCents;

        await call.update({
            duration_free_seconds: usedFreeSeconds,
            duration_paid_seconds: billableSeconds,
        }, { transaction: t });

        let billingSuccess = false;
        for (const intent of intents) {
            if (remainingCents <= 0) {
                try {
                    await StripeService.cancelPaymentIntent(intent.stripe_payment_intent_id);
                    await intent.update({ status: 'cancelled' }, { transaction: t });
                } catch { /* best effort */ }
                continue;
            }
            const captureCents = Math.min(remainingCents, intent.amount_cents);
            try {
                await StripeService.captureCallPayment(intent.stripe_payment_intent_id, captureCents);
                await intent.update({ status: 'captured', captured_cents: captureCents }, { transaction: t });
                remainingCents -= captureCents;
                billingSuccess = true;
            } catch (err) {
                logger.error(`Capture failed for PI ${intent.stripe_payment_intent_id}: ${err.message}`);
                break;
            }
        }

        if (billingSuccess) {
            if (talker && usedFreeSeconds > 0) {
                await talker.update({ bonus_seconds: freeSeconds - usedFreeSeconds }, { transaction: t });
            }
            await call.update({ total_cost_client: (totalCents / 100).toFixed(2) }, { transaction: t });
            await Transaction.create({
                user_id: call.talker_id,
                call_id: call.id,
                type: 'charge',
                amount: totalCents / 100,
                status: 'completed',
            }, { transaction: t });
            logger.info(`Billing captured for call ${call.id}: $${(totalCents / 100).toFixed(2)} (total: ${totalSeconds}s, free: ${usedFreeSeconds}s, paid: ${billableSeconds}s)`);
        }
        return billingSuccess;
    });
}

/**
 * @route   POST /api/v1/calls/initiate
 * @desc    Initiate a new call matching process
 * @access  Private (Parlant)
 */
const initiateCall = async (req, res, next) => {
    try {
        const { id: talkerId } = req.user;
        const { gender, age_min, age_max } = req.body;

        // 1. Validation de base : l'utilisateur doit être un talker
        const user = await User.findByPk(talkerId);
        if (!user || (user.role !== 'talker' && user.role !== 'both')) {
            return res.status(403).json({
                success: false,
                error: { message: 'Only users with talker role can initiate calls' },
            });
        }

        // 2. Vérifier si un appel est déjà actif
        const existingCall = await Call.findOne({
            where: {
                talker_id: talkerId,
                status: ['waiting', 'active_free', 'alerted', 'active_paid'],
            },
        });

        if (existingCall) {
            return res.status(400).json({
                success: false,
                error: { message: 'You already have an active call or match request' },
            });
        }

        // 3. Récupérer le business mode par défaut du système
        const defaultModeName = process.env.DEFAULT_BUSINESS_MODE || 'BALANCED';
        const businessMode = await BusinessMode.findOne({
            where: { mode_name: defaultModeName, is_active: true }
        });

        if (!businessMode) {
            throw new Error(`Default business mode ${defaultModeName} not found or inactive`);
        }

        // Check for trial restrictions
        if (user.is_trial && (user.trial_sessions_used >= 4 || user.trial_seconds_used >= 900)) {
            return res.status(403).json({
                success: false,
                error: { message: 'Your trial has ended.' }
            })
        }

        // 4. Autorisation Stripe — Zero Debt Rule: No match without pre-auth
        let pendingPreauth = null;
        if (!user.is_trial) {
            if (!user.stripe_customer_id) {
                return res.status(402).json({
                    success: false,
                    error: { message: 'Stripe account required. Please link a payment method.' },
                });
            }
            try {
                pendingPreauth = await StripeService.preAuthorizeCall(user.stripe_customer_id);
                logger.info(`Pre-auth success for user ${talkerId}: ${pendingPreauth.id}`);
            } catch (stripeError) {
                logger.error(`Stripe pre-auth failed for user ${talkerId}: ${stripeError.message}`);
                return res.status(402).json({
                    success: false,
                    error: { message: 'Payment authorization failed. Please check your card.' },
                });
            }
        }

        // 5. Trouver un listener via MatchingService
        var listener;
        var retry = 0;

        while (20 / businessMode.timeout_matching > retry) {
            listener = await MatchingService.findMatch(talkerId, businessMode, { gender, age_min, age_max }, retry++);
            if (listener) break;

            await new Promise(resolve => setTimeout(resolve, businessMode.timeout_matching * 1000));
        }

        if (!listener) {
            return res.status(404).json({
                success: false,
                error: { message: 'No available listeners found. Please try again later.' },
            });
        }

        // 7. Initier l'appel Twilio

        const callbackBaseUrl = process.env.BASE_URL || `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
        const statusCallbackUrl = `${callbackBaseUrl}/api/v1/webhooks/twilio/status`;
        const twilioCall = await TwilioService.initiateCall(listener.phone, user.phone, statusCallbackUrl);

        const call = await Call.create({
            talker_id: talkerId,
            listener_id: listener.id,
            business_mode_id: businessMode.id,
            twilio_call_sid: twilioCall.sid,
        });

        if (pendingPreauth) {
            await CallPaymentIntent.create({
                call_id: call.id,
                stripe_payment_intent_id: pendingPreauth.id,
                amount_cents: 1000,
            });
        }

        if (user.is_trial) {
            setTimeout(async () => {
                if (call.status !== 'ended') { await TwilioService.endCall(call.twilio_call_sid) }
            }, (900 - user.trial_seconds_used) * 1000)
        }

        logger.info(`WELYAT: Matching session initiated for call ${call.id}`);

        res.status(201).json({
            success: true,
            data: {
                call_id: call.id,
                status: call.status,
                listener: {
                    id: listener.id,
                    reputation_score: listener.reputation_score,
                },
            },
        });
    } catch (error) {
        logger.error(`Error in initiateCall: ${error.message}`);
        next(error);
    }
};

/**
 * @route   GET /api/v1/calls/active
 * @desc    Get active call for current user
 * @access  Private
 */
const getActiveCall = async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        const call = await Call.findOne({
            where: {
                [Op.or]: [
                    { talker_id: userId },
                    { listener_id: userId }
                ],
                status: {
                    [Op.notIn]: ['ended', 'cancelled']
                }
            },
            include: [
                { model: User, as: 'talker', attributes: ['id', 'email', 'reputation_score'] },
                { model: User, as: 'listener', attributes: ['id', 'email', 'reputation_score'] },
                { model: BusinessMode, as: 'business_mode' }
            ]
        });

        // Auto-cancel calls stuck in waiting for more than 60s (Twilio webhook not received)
        if (call && call.status === 'waiting') {
            const age = Date.now() - new Date(call.created_at).getTime();
            if (age > 60000) {
                const fsm = new CallStateMachine(call);
                await fsm.cancel('Timed out waiting for Twilio');
                return res.status(200).json({ success: true, data: null });
            }
        }

        res.status(200).json({
            success: true,
            data: call
        });
    } catch (error) {
        next(error);
    }
};

const getMyCalls = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { limit = 20, offset = 0 } = req.query;

        const calls = await Call.findAndCountAll({
            where: {
                [Op.or]: [
                    { talker_id: userId },
                    { listener_id: userId }
                ]
            },
            include: [
                { model: User, as: 'talker', attributes: ['id', 'email'] },
                { model: User, as: 'listener', attributes: ['id', 'email'] },
                { model: BusinessMode, as: 'business_mode' }
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });

        res.status(200).json({
            success: true,
            data: calls.rows,
            pagination: {
                total: calls.count,
                limit: parseInt(limit),
                offset: parseInt(offset)
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   GET /api/v1/calls/:id
 * @desc    Get detailed info of a specific call
 * @access  Private
 */
const getCallDetails = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { id: callId } = req.params;

        const call = await Call.findByPk(callId, {
            include: [
                { model: User, as: 'talker', attributes: ['id', 'email', 'reputation_score'] },
                { model: User, as: 'listener', attributes: ['id', 'email', 'reputation_score'] },
                { model: BusinessMode, as: 'business_mode' },
                { model: Transaction, attributes: ['id', 'type', 'amount', 'status', 'created_at'] }
            ]
        });

        if (!call) {
            return res.status(404).json({ success: false, error: { message: 'Call not found' } });
        }

        // Vérifier que l'utilisateur participe à l'appel
        if (call.talker_id !== userId && call.listener_id !== userId) {
            return res.status(403).json({ success: false, error: { message: 'Unauthorized access to this call details' } });
        }

        res.status(200).json({
            success: true,
            data: call
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/v1/calls/:id/end
 * @desc    Manually end a call (client-side trigger)
 * @access  Private
 */
const endCall = [
    body('id').isString().withMessage('Call ID must be a string'),
    async (req, res, next) => {
        try {
            const { id: userId } = req.user;
            const { id: callId } = req.params;

            const call = await Call.findByPk(callId);
            if (!call) {
                return res.status(404).json({ success: false, error: { message: 'Call not found' } });
            }

            if (call.talker_id !== userId && call.listener_id !== userId) {
                return res.status(403).json({ success: false, error: { message: 'Unauthorized' } });
            }

            if (call.status === 'ended' || call.status === 'cancelled') {
                return res.status(400).json({ success: false, error: { message: 'Call already ended' } });
            }

            const fsm = new CallStateMachine(call);
            await fsm.end('Manually ended by user');

            if (call.twilio_call_sid) {
                await TwilioService.endCall(call.twilio_call_sid);
            }

            res.status(200).json({
                success: true,
                message: 'Call ended successfully'
            });
        } catch (error) {
            next(error);
        }
    }
]

/**
 * @route   POST /api/v1/calls/:id/feedback
 * @desc    Record feedback after a call
 * @access  Private (Auth)
 */
const rateCall = [
    body('id').isString().withMessage('Call ID must be a string'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('comment').optional().isString().withMessage('Comment must be a string'),
    async (req, res, next) => {
        try {
            const { id } = req.user;
            const { id: callId } = req.params;
            const { rating, comment } = req.body;
            const call = await Call.findByPk(callId);

            if (!call || (call.talker_id !== id && call.listener_id !== id)) {
                return res.status(404).json({ success: false, error: { message: 'Call not found' } });
            }

            if (call.duration_free_seconds + call.duration_paid_seconds < 120) {
                return res.status(400).json({ success: false, error: { message: 'Call was too short to be rated' } });
            }

            const talkerId = call.talker_id;
            const listenerId = call.listener_id;

            const isRated = await Rating.count({
                where: {
                    call_id: callId,
                    from_user_id: id
                }
            });

            if (isRated > 0) {
                return res.status(400).json({ success: false, error: { message: 'Call was already rated' }});
            }

            const toUserId = talkerId === id ? listenerId : talkerId;

            await Rating.create({
                call_id: callId,
                from_user_id: id,
                to_user_id: toUserId,
                score: rating,
                comment: comment
            });

            if (listenerId === id) {
                ScoringService.checkTalker(talkerId);
            } else {
                ScoringService.checkListener(listenerId);
            }

            res.status(200).json({ success: true, message: 'Feedback recorded' });
        } catch (error) {
            next(error);
        }
    }
]

const getPaymentStatus = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user.stripe_customer_id) {
            return res.json({ success: true, data: { hasPaymentMethod: false } });
        }
        const hasPaymentMethod = await StripeService.hasDefaultPaymentMethod(user.stripe_customer_id);
        res.json({ success: true, data: { hasPaymentMethod } });
    } catch (err) {
        next(err);
    }
};

const setupPayment = async (req, res, next) => {
    try {
        let user = await User.findByPk(req.user.id);
        if (!user.stripe_customer_id) {
            const customer = await StripeService.createCustomer(user.id, user.email);
            await user.update({ stripe_customer_id: customer.id });
            user = await User.findByPk(req.user.id);
        }
        const session = await StripeService.createSetupCheckoutSession({
            customerId: user.stripe_customer_id,
            successUrl: `${process.env.FRONTEND_URL}/call?setup_complete=true`,
            cancelUrl: `${process.env.FRONTEND_URL}/call`,
            userId: user.id,
        });
        res.json({ url: session.url });
    } catch (err) {
        next(err);
    }
};

const finalizeSetup = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user.stripe_customer_id) {
            return res.json({ success: true, data: { hasPaymentMethod: false } });
        }
        const hasPaymentMethod = await StripeService.finalizeSetupFromSession(user.stripe_customer_id);
        res.json({ success: true, data: { hasPaymentMethod } });
    } catch (err) {
        next(err);
    }
};

const secondPreauth = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { id: callId } = req.params;
        const call = await Call.findByPk(callId);
        if (!call || call.talker_id !== userId) {
            return res.status(404).json({ success: false, error: { message: 'Call not found' } });
        }
        const user = await User.findByPk(userId);
        const authorization = await StripeService.preAuthorizeCall(user.stripe_customer_id);
        await CallPaymentIntent.create({
            call_id: callId,
            stripe_payment_intent_id: authorization.id,
            amount_cents: 1000,
        });
        logger.info(`Additional pre-auth for call ${callId}: ${authorization.id}`);
        res.json({ success: true });
    } catch (err) {
        logger.error(`Pre-auth failed for call ${req.params.id}: ${err.message}`);
        res.status(402).json({ success: false, error: { message: 'Pre-authorization failed' } });
    }
};

module.exports = {
    initiateCall,
    getActiveCall,
    getMyCalls,
    getCallDetails,
    endCall,
    rateCall,
    getPaymentStatus,
    setupPayment,
    finalizeSetup,
    secondPreauth,
    billCall,
};
