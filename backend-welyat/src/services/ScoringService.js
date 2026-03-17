const { Transaction, User, Call, sequelize } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');

/**
 * ScoringService - Implements WELYAT V0 Safety & Trust rules.
 */
class ScoringService {
    /**
     * Flag "Parlant Toxique" detection logic.
     * Rule: >= 3 notes <= 2 FROM >= 3 different listeners WITHIN 14 days.
     */
    async checkToxicTalkerStatus(talkerId) {
        try {
            const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

            // Count unique listeners who gave low ratings
            const lowRatings = await Transaction.findAll({
                where: {
                    user_id: talkerId,
                    type: 'feedback',
                    amount: { [Op.lte]: 2 }, // Rating stored in amount for simplicity in V0
                    created_at: { [Op.gte]: fourteenDaysAgo }
                },
                attributes: [
                    [sequelize.fn('DISTINCT', sequelize.col('metadata->listener_id')), 'listener_id']
                ]
            });

            if (lowRatings.length >= 3) {
                const talker = await User.findByPk(talkerId);
                if (talker && !talker.is_toxic) {
                    talker.is_toxic = true;
                    talker.metadata = { ...talker.metadata, flagged_at: new Date() };
                    await talker.save();
                    logger.warn(`ScoringService: User ${talkerId} flagged as TOXIC.`);
                }
                return true;
            }
            return false;
        } catch (error) {
            logger.error(`ScoringService: Error checking toxic status: ${error.message}`);
            return false;
        }
    }

    /**
     * Listener "Pardon" / Priority Reset Logic.
     * Rule: 10h total listen time + 0 new bad notes in 7 days.
     */
    async checkListenerPardon(listenerId) {
        try {
            const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            // 1. Check for bad notes in last 7 days
            const badNotes = await Transaction.count({
                where: {
                    metadata: { listener_id: listenerId },
                    type: 'feedback',
                    amount: { [Op.lte]: 2 },
                    created_at: { [Op.gte]: sevenDaysAgo }
                }
            });

            if (badNotes > 0) return false;

            // 2. Check total listening time in last 7 days (10 hours = 36000 seconds)
            const totalDuration = await Call.sum('duration_total_seconds', {
                where: {
                    écoutant_id: listenerId,
                    status: 'ended',
                    ended_at: { [Op.gte]: sevenDaysAgo }
                }
            });

            if (totalDuration >= 36000) {
                const listener = await User.findByPk(listenerId);
                if (listener && listener.priority_score < 0) {
                    listener.priority_score = 0; // Reset to normal
                    await listener.save();
                    logger.info(`ScoringService: Listener ${listenerId} priority RESET via Pardon rule.`);
                    return true;
                }
            }
            return false;
        } catch (error) {
            logger.error(`ScoringService: Error checking listener pardon: ${error.message}`);
            return false;
        }
    }
}

module.exports = new ScoringService();
