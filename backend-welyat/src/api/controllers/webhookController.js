const { Call } = require('../../models');
const CallStateMachine = require('../../services/CallStateMachine');
const logger = require('../../config/logger');

/**
 * @route   POST /api/v1/webhooks/twilio/status
 * @desc    Handle Twilio call status changes
 * @access  Public (Twilio Webhook)
 */
const handleTwilioStatus = async (req, res, next) => {
    try {
        const { CallSid, CallStatus } = req.body;
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
                    // TODO: Déclencher les timers (Bridge Fees, Alertes) ici ou via un worker
                }
                break;

            case 'completed':
            case 'failed':
            case 'busy':
            case 'no-answer':
            case 'canceled':
                // L'appel s'est terminé
                if (call.status !== 'ended' && call.status !== 'cancelled') {
                    await fsm.end(`Twilio status: ${CallStatus}`);

                    // 1. Calcul du Payout précis (à la seconde)
                    // Payout = paid_seconds * (listener_rate_per_min / 60)
                    if (call.écoutant_id && call.duration_paid_seconds > 0) {
                        const ecoutant = await (require('../../models/User')).findByPk(call.écoutant_id);
                        const businessMode = await (require('../../models/BusinessMode')).findByPk(call.business_mode_id);

                        if (ecoutant && businessMode) {
                            const ratePerMin = parseFloat(businessMode.price_per_minute_écoutant);
                            const precisePayout = (call.duration_paid_seconds * (ratePerMin / 60)).toFixed(4);

                            ecoutant.balance = parseFloat(ecoutant.balance) + parseFloat(precisePayout);
                            await ecoutant.save();

                            // Mettre à jour le call record pour le ledger
                            call.total_payout_écoutant = precisePayout;
                            await call.save();

                            logger.info(`WELYAT: Precise payout of ${precisePayout}$ credited to listener ${ecoutant.id} for ${call.duration_paid_seconds}s`);
                        }
                    }

                    // 2. Génération des XP (V0)
                    // Rule: Paid -> XP = 0. Sinat: floor(free_minutes / 5)
                    const XPCalculatorService = require('../../services/XPCalculatorService');
                    const xpGenerated = XPCalculatorService.calculateXP(call.duration_free_seconds, call.duration_paid_seconds);

                    if (xpGenerated > 0 && call.écoutant_id) {
                        const ecoutant = await (require('../../models/User')).findByPk(call.écoutant_id);
                        if (ecoutant) {
                            ecoutant.total_xp = (ecoutant.total_xp || 0) + xpGenerated;
                            await ecoutant.save();

                            call.xp_generated = xpGenerated;
                            await call.save();

                            logger.info(`WELYAT: ${xpGenerated} XP credited to listener ${ecoutant.id}`);
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

module.exports = {
    handleTwilioStatus,
    handleTwilioDTMF
};
