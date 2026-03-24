const { Op } = require("sequelize");
const logger = require("../../config/logger");
const { User, Call, RedistributionDetail, Redistribution } = require("../../models");

/**
 * Get User XP related informations
 * Current total, xp earning calls and redistributions
 */
const getXp = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {id: req.user.id}
        });

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
    getXp
}