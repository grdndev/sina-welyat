const { Call } = require('../../models');
const TwilioService = require('../../services/TwilioService');
const logger = require('../../config/logger');

/**
 * @route   POST /api/v1/emergency/trigger
 * @desc    Immediate hangup and return emergency resources
 * @access  Private
 */
const triggerEmergency = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const { call_id: callId } = req.body;

        // 1. Trouver l'appel actif s'il y en a un
        const call = await Call.findOne({
            where: {
                [require('sequelize').Op.or]: [{ parlant_id: userId }, { écoutant_id: userId }],
                status: ['waiting', 'active_free', 'alerted', 'active_paid']
            }
        });

        if (call) {
            // Cut call immediately
            if (call.twilio_call_sid) {
                await TwilioService.endCall(call.twilio_call_sid);
            }

            const CallStateMachine = require('../../services/CallStateMachine');
            const fsm = new CallStateMachine(call);
            await fsm.end('Emergency Triggered');

            logger.warn(`Emergency triggered by user ${userId} for call ${call.id}`);
        }

        // 2. Return emergency resources
        return res.status(200).json({
            success: true,
            message: 'Call terminated. Emergency resources provided below.',
            resources: {
                US: { police: '911', suicide: '988' },
                EU: { general: '112' },
                International: { suicide: '988' }
            }
        });
    } catch (error) {
        logger.error(`Error in triggerEmergency: ${error.message}`);
        next(error);
    }
};

module.exports = {
    triggerEmergency
};
