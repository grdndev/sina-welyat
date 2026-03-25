const { Op } = require("sequelize");
const logger = require("../../config/logger");
const { User, Call, RedistributionDetail, Redistribution, Rating, Reputation } = require("../../models");

/**
 * Get user reputation
 */
const getReputation = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        if (!user) {
            throw new Error("User not found");
        }

        const ratings_all_time = await Rating.findAll({
            where: {
                to_user_id: req.user.id
            }
        });
        const average_all_time = ratings_all_time.reduce((sum, r) => sum + r.score, 0) / (ratings_all_time.length || 1);

        const ratings_thirty_days = await Rating.findAll({
            where: {
                to_user_id: req.user.id,
                created_at: {[Op.gt]: thirtyDaysAgo}
            }
        });
        const average_thirty_days = ratings_thirty_days.reduce((sum, r) => sum + r.score, 0) / (ratings_thirty_days.length || 1);

        const stats = {"5": 0, "4": 0, "3": 0, "2": 0, "1": 0};
        ratings_all_time.forEach(r => stats[r.score] += 1);

        const reputation = await Reputation.findOne({
            where: {
                user_id: req.user.id,
                status: 'in_progress'
            }
        });

        return res.status(200).json({
            reputation_score: average_all_time,
            average_30d: average_thirty_days,
            flags: {
                is_toxic: user.toxic_flag,
                is_low_reputation: user.low_reputation_flag
            },
            stats,
            recovery: reputation ? {
                in_progress: true,
                hours_done: reputation.duration_listened_seconds / 3600,
                hours_target: 10,
                no_bad_ratings: reputation.no_bad_ratings
            } : undefined
        })
    } catch (error) {
        logger.error(`Users getReputation error : ${error.message}`);
        next(error);
    }
}

/**
 * Get User XP related informations
 * Current total, xp earning calls and redistributions
 */
const getXp = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            throw new Error("User not found");
        }

        const calls = (await Call.findAll({
            where: {
                listener_id: req.user.id,
                xp_generated: {[Op.gt]: 0}
            },
            attributes: ['id', 'started_at', 'duration_free_seconds', 'xp_generated'],
            order: [['started_at', 'DESC']]
        })).map(c => ({
            call_id: c.id,
            date: c.started_at,
            duration_min: Math.floor(c.duration_free_seconds / 60),
            xp: c.xp_generated
        }));

        const redistributions = (await RedistributionDetail.findAll({
            where: {user_id: req.user.id},
            include: [{ model: Redistribution }]
        })).map(r => ({
            id: r.id,
            date: r.Redistribution.executed_at,
            xp_converted: r.xp_converted,
            amount_earned: r.amount_credited
        }));

        res.status(200).json({
            total_xp: user.total_xp,
            recent_gains: calls,
            redistribution_history: redistributions
        });
    } catch (error) {
        logger.error(`Users getXp error : ${error.message}`);
        next(error);
    }
}

module.exports = {
    getReputation,
    getXp
}