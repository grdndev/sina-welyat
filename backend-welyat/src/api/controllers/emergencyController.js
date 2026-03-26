const { Call, Emergency } = require('../../models');
const { Op } = require('sequelize');
const CallStateMachine = require('../../services/CallStateMachine');
const logger = require('../../config/logger');
const TwilioService = require('../../services/TwilioService');

/**
 * @route   POST /api/v1/emergency/911
 * @desc    Signal emergency, return useful resources
 * @access  Private
 */
const triggerEmergency = async (req, res, next) => {
    try {
        const { id: userId } = req.user;

        const call = await Call.findOne({
            where: {
                [Op.or]: [{ talker_id: userId }, { listener_id: userId }],
                status: ['waiting', 'active_free', 'alerted', 'active_paid']
            }
        });

        await Emergency.create({
            user_id: userId,
            call_id: call ? call.id : null,
            ip_address: req.ip
        });

        if (call) {
            if (call.twilio_call_sid) {
                await TwilioService.endCall(call.twilio_call_sid);
            }

            const fsm = new CallStateMachine(call);
            await fsm.end('Emergency Triggered');

            logger.warn(`Emergency triggered by user ${userId} for call ${call.id}`);
        }

        // 2. Return emergency resources
        return res.status(200).json({
            success: true,
            message: 'Call terminated. Emergency resources provided below.',
            resources: {
                US: {
                    emergency: "911",
                    suicide_prevention: "988"
                },
                EU: {
                    emergency: "112",
                    suicide_prevention: "988"
                }
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
