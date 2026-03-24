const logger = require("../../config/logger");
const { User } = require("../../models");
const CloudXPService = require("../../services/CloudXPService");

const cloudStatus = async (req, res, next) => {
    try {
        const { total_payout, total_charged } = await CloudXPService.calculateCurrentMargin();
        const eligible_users = await CloudXPService.getEligibleUsers();
        const listeners = await User.count({where: {
            role: ['listener', 'both'],
            is_active: true
        }});
        const total_xp = eligible_users.reduce((sum, u) => sum + u.total_xp, 0);

        res.status(200).json({
            total_xp,
            estimated_pool: total_charged - total_payout,
            eligible_ratio: eligible_users.length / (listeners || 1) * 100
        });
    } catch (error) {
        logger.error(`Admin cloud status error : ${error.message}`);
        next(error);
    }
}

const execute = async (req, res, next) => {
    try {
        const percentage = req.body.percentage;

        if (!percentage || percentage < 1 || percentage > 100) {
            return res.status(400).json({
                success: false,
                error: { message: "Percentage should be between 1 and 100" }
            });
        }

        await CloudXPService.executeRedistribution(percentage, req.user.id)

        res.status(200).send();
    } catch (error) {
        logger.error(`Admin cloud execute : ${error.message}`);
        next(error);
    }
}

module.exports = {
    cloudStatus,
    execute
}