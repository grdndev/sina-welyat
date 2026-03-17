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

            if (!call || !call.ended_at || !call.started_at) {
                logger.warn(`XPCalculatorWorker: Call ${callId} not found or not ended yet.`);
                return;
            }

            // WELYAT V0 Strict Rule:
            // if duration_paid > 0 -> XP = 0
            if (call.duration_paid_seconds > 0) {
                logger.info(`XPCalculatorWorker: 0 XP generated (Call was paid)`);
                call.xp_processed = true;
                await call.save();
                return;
            }

            const durationMs = new Date(call.ended_at) - new Date(call.started_at);
            const freeMins = Math.floor(durationMs / (1000 * 60));
            const xpToAward = Math.floor(freeMins / 5);

            if (xpToAward > 0) {
                // Award XP to both Parlant and Écoutant for participating
                const parlant = await User.findByPk(call.parlant_id);
                const ecoutant = await User.findByPk(call.écoutant_id);

                if (parlant) {
                    parlant.total_xp += xpToAward;
                    await parlant.save();
                }

                if (ecoutant) {
                    ecoutant.total_xp += xpToAward;
                    await ecoutant.save();
                }

                logger.info(`XPCalculatorWorker: Awarded ${xpToAward} XP to users for call ${callId}`);
            }

            // Mark call as XP processed
            call.xp_processed = true;
            await call.save();

        } catch (error) {
            logger.error(`XPCalculatorWorker: Error processing XP for call ${callId}: ${error.message}`);
        }
    }
}

module.exports = new XPCalculatorWorker();
