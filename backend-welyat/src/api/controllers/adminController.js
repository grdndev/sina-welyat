const { body } = require("express-validator");
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

const executeRedistribution = [
    body('percentage').isInt({ min: 1, max: 100 }).withMessage('Percentage should be between 1 and 100'),
    async (req, res, next) => {
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
]

const promoteUser = [
    body('force').optional().isBoolean().withMessage('Force should be a boolean'),
    async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);
            const force = !!req.query.force;

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: { message: "User not found" }
                });
            }

            if (user.is_founding && !force) {
                return res.status(400).json({
                    success: false,
                    error: { message: "User is already founding. Force it to reset duration."}
                });
            }

            user.is_founding = true;
            user.founding_end_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
            await user.save();

            return res.status(200).send();
        } catch (error) {
            logger.error(`Admin promote user : ${error.message}`);
        }
    }
]

module.exports = {
    cloudStatus,
    executeRedistribution,
    promoteUser
}