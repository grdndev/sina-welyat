const { Transaction, User, Call, sequelize, Rating } = require('../models');
const { Op } = require('sequelize');
const logger = require('../config/logger');
const Reputation = require('../models/Reputation');

/**
 * ScoringService - Implements WELYAT V0 Safety & Trust rules.
 */
class ScoringService {
    /**
     * Flag "Parlant Toxique" detection logic.
     * Rule: >= 3 notes <= 2 FROM >= 3 different listeners WITHIN 14 days.
     */
    async checkTalker(talkerId) {
        try {
            const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
            const talker = await User.findByPk(talkerId);
            const lowRatings = await Rating.count({
                where: {
                    to_user_id: talkerId,
                    score: { [Op.lte]: 2 },
                    created_at: { [Op.gte]: fourteenDaysAgo }
                },
                distinct: true,
                col: 'from_user_id'
            });

            const latestRating = await Rating.findOne({
                where: {
                    to_user_id: talkerId
                },
                order: [['created_at', 'DESC']]
            });

            // If 3 or more bad ratings in the past 14 days AND the newest rating is bad
            if (lowRatings >= 3 && latestRating <= 2) {
                if (!talker.toxic_flag)
                logger.warn(`ScoringService: User ${talkerId} flagged as TOXIC.`);

                talker.toxic_flag = true;
                talker.toxic_flagged_at = new Date();
            } else if (talker.toxic_flagged_at.getTime() < fourteenDaysAgo.getTime()) {
                talker.toxic_flag = false;
            }

            await talker.save();
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
    async checkListeners() {
        try {
            const listeners = await User.findAll({
                where: {
                    role: ['listener', 'both'],
                    is_active: true
                }
            })

            for (const listener of listeners) {
                if (listener.low_reputation_flag) {
                    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    const ratings = await Rating.count({
                        where: {
                            to_user_id: listener.id,
                            score: {[Op.lte]: 2},
                            created_at: {[Op.gte]: sevenDaysAgo}
                        }
                    });
                    const calls = await Call.findAll({
                        where: {
                            status: 'ended',
                            listener_id: listener.id,
                            started_at: {[Op.gte]: sevenDaysAgo}
                        }
                    });
                    const duration = calls.reduce((sum, c) => {sum + c.duration_free_seconds + c.duration_paid_seconds}, 0);

                    if (ratings == 0 && duration > 10 * 60 * 60) {
                        listener.low_reputation_flag = false;
                    }

                    await Reputation.update({
                        duration_listened_seconds: duration,
                        status: listener.low_reputation_flag ? 'in_progress' : 'completed',
                        where: {
                            user_id: listener.id,
                            status: 'in_progress'
                        }
                    });
                } else {
                    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
                    const ratings = await Rating.findAll({
                        where: {
                            to_user_id: listener.id,
                            created_at: { [Op.gte]: thirtyDaysAgo }
                        }
                    });

                    const average = ratings.reduce((sum, r) => sum + r.score, 0) / (ratings.length || 1);

                    if (average < 2.5) {
                        listener.low_reputation_flag = true;
                        listener.low_reputation_since = new Date();
                        await Reputation.create({
                            user_id: listener.id
                        });
                    }
                }

                await listener.save();
            }
        } catch (error) {
            logger.error(`ScoringService: Error checking listener pardon: ${error.message}`);
        }
    }
}

module.exports = new ScoringService();
