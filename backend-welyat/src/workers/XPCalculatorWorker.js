const { User, Call, BusinessMode } = require('../models');
const logger = require('../config/logger');

/**
 * XPCalculatorWorker - Handles asynchronous XP calculation and awarding.
 */
class XPCalculatorWorker {
    /**
     * Process XP for a completed call.
     * Rule: if duration_paid > 0 -> XP = 0. Else: floor(free_minutes / 5)
     */
    async processCallXP(callId) {
        try {
            const call = await Call.findByPk(callId);
            const mode = await BusinessMode.findByPk(call.business_mode_id);
            const listener = await User.findByPk(call.listener_id);

            if (!call || !call.ended_at || !call.started_at) {
                logger.warn(`XPCalculatorWorker: Call ${callId} not found or not ended yet.`);
                return;
            }

            // WELYAT V0 Strict Rule:
            // if duration_paid > 0 -> XP = 0
            if (call.duration_paid_seconds > 0) {
                logger.info(`XPCalculatorWorker: 0 XP generated (Call was paid)`);
                return;
            }

            // XP should be multiplied by 1.5 if the listener is a founding member AND in his first 3 months of being founding
            const foundingMultiplier = listener
                && listener.is_founding
                && listener.founding_start_date
                && (new Date() - new Date(listener.founding_start_date)) <= 3 * 30 * 24 * 3600 * 1000
                ? 1.5 : 1;

            const durationMs = new Date(call.ended_at) - new Date(call.started_at);
            const freeMins = Math.floor(durationMs / (1000 * 60));
            const xpToAward = Math.floor(freeMins / mode.xp_per_minutes) * foundingMultiplier;

            if (xpToAward > 0) {
                if (listener) {
                    listener.total_xp += xpToAward;
                    await listener.save();

                    call.xp_generated = xpToAward;
                    await call.save();
                }

                logger.info(`XPCalculatorWorker: Awarded ${xpToAward} XP to listener ${listener.id} for call ${callId}`);
            } else {
                logger.info(`XPCalculatorWorker: 0 XP generated (Call was too short)`);
            }
        } catch (error) {
            logger.error(`XPCalculatorWorker: Error processing XP for call ${callId}: ${error.message}`);
        }
    }
}

module.exports = new XPCalculatorWorker();
