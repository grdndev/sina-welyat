const { Call, User, BusinessMode, UserSubscription, Subscription } = require('../../models');
const CallStateMachine = require('../../services/CallStateMachine');
const XPCalculatorService = require('../../services/XPCalculatorService');
const logger = require('../../config/logger');
const stripeService = require('../../services/StripeService');
const { billCall } = require('../controllers/callController');

/**
 * @route   POST /api/v1/webhooks/twilio/status
 * @desc    Handle Twilio call status changes
 * @access  Public (Twilio Webhook)
 */
const handleTwilioStatus = async (req, res, next) => {
    try {
        const { CallSid, CallStatus, CallDuration } = req.body;
        logger.info(`Twilio Webhook received: ${CallStatus} for CallSid ${CallSid}`);

        const call = await Call.findOne({ where: { twilio_call_sid: CallSid } });
        if (!call) {
            logger.warn(`Call record not found for TwilioSid ${CallSid}`);
            return res.status(200).send('Webhook received, but no local record found');
        }

        const fsm = new CallStateMachine(call);

        switch (CallStatus) {
            case 'in-progress':
                // L'appel est décroché, on passe en ACTIVE_FREE
                if (call.status === 'waiting') {
                    await fsm.start();

                    // If Talker is in TRIAL MODE, increment sessions_used
                    if (call.talker_id) {
                        const talker = await User.findByPk(call.talker_id);

                        if (talker.is_trial) {
                            talker.trial_sessions_used += 1;
                            await talker.save();
                        }
                    }
                    // TODO: Déclencher les timers (Bridge Fees, Alertes) ici ou via un worker
                }
                break;

            case 'completed':
            case 'failed':
            case 'busy':
            case 'no-answer':
            case 'canceled':
                // Transition FSM (skip si déjà terminé via endCall manuel)
                if (call.status !== 'ended' && call.status !== 'cancelled') {
                    const terminate = call.status === 'waiting'
                        ? fsm.cancel(`Twilio status: ${CallStatus}`)
                        : fsm.end(`Twilio status: ${CallStatus}`);
                    await terminate;

                    if (call.talker_id) {
                        const talker = await User.findByPk(call.talker_id);
                        if (talker && talker.is_trial) {
                            talker.trial_seconds_used += Math.max(0, call.duration_free_seconds - 120);
                            await talker.save();
                        }
                    }
                }

                // Facturation — Twilio est la référence de durée et d'état
                // billCall est idempotent grâce au SELECT FOR UPDATE sur les intents
                {
                    const twilioSeconds = parseInt(CallDuration) || 0;
                    const billed = await billCall(call, twilioSeconds);

                    if (billed && call.listener_id && call.duration_paid_seconds > 0) {
                        const listener = await User.findByPk(call.listener_id);
                        const businessMode = await BusinessMode.findByPk(call.business_mode_id);

                        if (listener && businessMode) {
                            const ratePerMin = parseFloat(businessMode.earn_per_minute_listener);
                            const precisePayout = (call.duration_paid_seconds * (ratePerMin / 60)).toFixed(4);

                            listener.balance = parseFloat(listener.balance) + parseFloat(precisePayout);
                            await listener.save();

                            call.total_payout_listener = precisePayout;
                            await call.save();

                            logger.info(`WELYAT: Payout ${precisePayout}$ credited to listener ${listener.id} for ${call.duration_paid_seconds}s`);
                        }
                    }

                    const xpGenerated = XPCalculatorService.calculateXP(call.duration_free_seconds, call.duration_paid_seconds);
                    if (xpGenerated > 0 && call.listener_id) {
                        const listener = await User.findByPk(call.listener_id);
                        if (listener) {
                            listener.total_xp = (listener.total_xp || 0) + xpGenerated;
                            await listener.save();

                            call.xp_generated = xpGenerated;
                            await call.save();

                            logger.info(`WELYAT: ${xpGenerated} XP credited to listener ${listener.id}`);
                        }
                    }
                }
                break;

            default:
                logger.debug(`Unhandled Twilio status: ${CallStatus}`);
        }

        res.status(200).send('Webhook processed');
    } catch (error) {
        logger.error(`Error in handleTwilioStatus: ${error.message}`);
        // On répond 200 à Twilio même en cas d'erreur interne pour éviter les retries infinis
        // si l'erreur est logicielle, mais on logge.
        res.status(200).send('Error processed');
    }
};

/**
 * @route   POST /api/v1/webhooks/twilio/dtmf
 * @desc    Handle DTMF digits from Twilio (e.g. # for paid phase)
 * @access  Public (Twilio Webhook)
 */
const handleTwilioDTMF = async (req, res, next) => {
    try {
        const { CallSid, Digits } = req.body;
        logger.info(`DTMF Webhook: Digits ${Digits} for CallSid ${CallSid}`);

        const call = await Call.findOne({ where: { twilio_call_sid: CallSid } });
        if (!call) return res.status(200).send();

        if (Digits === '#') {
            const fsm = new CallStateMachine(call);
            if (fsm.canTransitionTo('ACTIVE_PAID')) {
                await fsm.convertToPaid();
                logger.info(`WELYAT: Call ${call.id} converted to PAID via DTMF #`);
                return res.status(200).send('<Response><Say>Mode payant activé.</Say><Play loop="0">http://com.twilio.music.soft.s3.amazonaws.com/SoftMusic.mp3</Play></Response>');
            }
        }

        res.status(200).send('<Response><Say>Commande non reconnue.</Say></Response>');
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/v1/webhooks/stripe
 * @desc    Handle Stripe Connect account.updated events
 * @access  Public (Stripe Webhook)
 */
const handleStripeWebhook = async (req, res, next) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;
    try {
        event = stripeService.constructWebhookEvent(req.body, sig, endpointSecret);
    } catch (err) {
        logger.warn(`Stripe webhook signature verification failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        if (session.mode === 'setup') {
            const userId = session.client_reference_id;
            const setupIntentId = session.setup_intent;
            if (userId && setupIntentId) {
                try {
                    const user = await User.findByPk(userId);
                    if (user?.stripe_customer_id) {
                        await stripeService.finalizeSetupFromSession(user.stripe_customer_id);
                        logger.info(`Default PM set via webhook for user ${userId}`);
                    }
                } catch (err) {
                    logger.error(`Error setting default PM for user ${userId}: ${err.message}`);
                }
            }
        }

        if (session.mode === 'subscription' && session.payment_status === 'paid') {
            const userId = session.client_reference_id;
            const subscriptionId = session.metadata?.subscription_id;
            const stripeSubscriptionId = session.subscription;

            if (userId && subscriptionId && stripeSubscriptionId) {
                try {
                    await UserSubscription.update(
                        { is_active: false },
                        { where: { user_id: userId, is_active: true } }
                    );
                    await UserSubscription.create({
                        user_id: userId,
                        subscription_id: subscriptionId,
                        stripe_subscription_id: stripeSubscriptionId,
                        is_active: true,
                    });

                    const plan = await Subscription.findByPk(subscriptionId);
                    if (plan?.free_seconds_per_month) {
                        await User.increment(
                            { bonus_seconds: plan.free_seconds_per_month },
                            { where: { id: userId } }
                        );
                        logger.info(`Granted ${plan.free_seconds_per_month}s bonus to user ${userId} on subscription activation`);
                    }

                    logger.info(`Subscription activated for user ${userId}: plan ${subscriptionId}`);
                } catch (err) {
                    logger.error(`Error activating subscription for user ${userId}: ${err.message}`);
                }
            }
        }
    }

    if (event.type === 'account.updated') {
        const account = event.data.object;
        const userId = account.metadata?.user_id;

        if (userId && account.payouts_enabled) {
            try {
                const user = await User.findByPk(userId);
                if (user && !user.stripe_payouts_enabled) {
                    await user.update({ stripe_payouts_enabled: true });
                    logger.info(`Listener ${userId} payouts enabled via Stripe webhook`);
                }
            } catch (err) {
                logger.error(`Error updating user payouts status: ${err.message}`);
            }
        }
    }

    res.json({ received: true });
};

module.exports = {
    handleTwilioStatus,
    handleTwilioDTMF,
    handleStripeWebhook,
};
