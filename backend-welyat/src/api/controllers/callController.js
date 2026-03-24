const { Call, User, BusinessMode, Transaction } = require('../../models');
const CallStateMachine = require('../../services/CallStateMachine');
const ScoringService = require('../../services/ScoringService');
const MatchingService = require('../../services/MatchingService');
const TwilioService = require('../../services/TwilioService');
const StripeService = require('../../services/StripeService');
const logger = require('../../config/logger');
const { Op } = require('sequelize');

/**
 * @route   POST /api/v1/calls/initiate
 * @desc    Initiate a new call matching process
 * @access  Private (Parlant)
 */
const initiateCall = async (req, res, next) => {
    try {
        const { id: talkerId } = req.user;

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
        const defaultModeName = process.env.DEFAULT_BUSINESS_MODE || 'NORMAL';
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

        // 4. Autorisation Stripe (Buffer technique de 20.00$ obligatoire pour WELYAT V0)
        // Zero Debt Rule: No match without pre-auth
        if (!user.is_trial) {
            if (!user.stripe_customer_id) {
                return res.status(402).json({
                    success: false,
                    error: { message: 'Stripe account required. Please link a payment method.' },
                });
            } else {
                try {
                    const authorization = await StripeService.preAuthorizeCall(user.stripe_customer_id);
                    // On pourrait stocker le payment_intent_id dans une session temporaire ou meta
                    logger.info(`Pre-auth success for user ${talkerId}: ${authorization.id}`);
                } catch (stripeError) {
                    logger.error(`Stripe pre-auth failed for user ${talkerId}: ${stripeError.message}`);
                    return res.status(402).json({
                        success: false,
                        error: { message: "Payment authorization of 20.00$ failed. Please check your card." }
                    });
                }
            }
        }

        // 5. Trouver un listener via MatchingService (Seulement après pre-auth OK)
        const listener = await MatchingService.findMatch(talkerId, businessMode);

        // 7. Initier l'appel Twilio
        const callbackBaseUrl = process.env.BASE_URL || `http://${process.env.HOST || 'localhost'}:${process.env.PORT || 3000}`;
        const statusCallbackUrl = `${callbackBaseUrl}/api/v1/webhooks/twilio/status`;

        // Dans une implémentation réelle, on appellerait Twilio ici
        // const twilioCall = await TwilioService.initiateCall(listener.phone_number, user.phone_number, statusCallbackUrl);
        const call = await Call.create({
            talker_id: talkerId,
            listener_id: listener.id,
            business_mode_id: businessMode.id,
            twilio_call_sid: twilioCall.sid
        });
        // call.twilio_call_sid = twilioCall.sid;
        // await call.save();

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
                { model: BusinessMode }
            ]
        });

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
                { model: BusinessMode }
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
                { model: BusinessMode },
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
const endCall = async (req, res, next) => {
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

        // Note: Dans un environnement réel, on couperait aussi l'appel Twilio ici
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
};

/**
 * @route   POST /api/v1/calls/:id/feedback
 * @desc    Record feedback after a call
 * @access  Private (Parlant)
 */
const recordCallFeedback = async (req, res, next) => {
    try {
        const { id: talkerId } = req.user;
        const { id: callId } = req.params;
        const { rating, comment, motives } = req.body; // motives if rating <= 2

        const call = await Call.findByPk(callId);
        if (!call || call.talker_id !== talkerId) {
            return res.status(404).json({ success: false, error: { message: 'Call not found' } });
        }

        // 1. Store feedback as a transaction
        await Transaction.create({
            user_id: talkerId,
            call_id: callId,
            type: 'feedback',
            amount: rating, // Rating stored here
            status: 'completed',
            metadata: {
                listener_id: call.listener_id,
                comment,
                motives
            }
        });

        // 2. Check for toxic status (Async)
        ScoringService.checkToxicTalkerStatus(talkerId).catch(err => logger.error(`Error in toxic check: ${err.message}`));

        // 3. Update Listener reputation (V0 simple average)
        const listener = await User.findByPk(call.listener_id);
        if (listener) {
            // Logic to update average reputation...
            // For V0, we just log it
            logger.info(`Feedback recorded for listener ${listener.id}: ${rating} stars`);
        }

        res.status(200).json({ success: true, message: 'Feedback recorded' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    initiateCall,
    getActiveCall,
    getMyCalls,
    getCallDetails,
    endCall,
    recordCallFeedback
};
