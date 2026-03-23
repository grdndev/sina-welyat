const { User, Transaction, Call, Redistribution, RedistributionDetail } = require('../models');
const logger = require('../config/logger');
const { Op } = require('sequelize');
const { firstOfMonth } = require('../utils');
const { sequelize } = require('../config/database');

/**
 * CloudXPService - Manages platform margin and XP redistribution.
 * Business Rule: Platform takes 48.0% margin.
 * Excess margin can be converted to "Cloud XP" for the ecosystem.
 */
class CloudXPService {
    async calculateCurrentMargin() {
        const payouts = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.gte]: firstOfMonth()
                },
                type: 'payout',
                status: 'completed'
            }
        });

        const charged = await Transaction.findAll({
            where: {
                createdAt: {
                    [Op.gte]: firstOfMonth()
                },
                type: 'charge',
                status: 'completed'
            }
        });

        const total_payout = 0 + payouts.reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const total_charged = 0 + charged.reduce((sum, t) => sum + parseFloat(t.amount), 0);

        return {
            total_payout,
            total_charged,
            total_margin: (total_charged - total_payout) / total_charged * 100
        };
    }

    async executeRedistribution(redistribution_percentage, admin_id) {
        const transaction = await sequelize.transaction();
        logger.info(`CloudXPService: Admin ${admin_id} triggered Cloud Redistribution of ${redistribution_percentage}%.`);
        try {
            const {total_payout, total_charged, total_margin} = await this.calculateCurrentMargin();
            const eligible_users = await User.findAll({
                where: {
                    role: ['listener', 'both'],
                    total_xp: {[Op.gt]: 0},
                },
                include: [{
                    model: Call,
                    as: 'calls_as_listener',
                    required: true,
                    where: {
                        createdAt: { [Op.gte]: firstOfMonth()},
                        duration_paid_seconds: { [Op.gt]: 0 }
                    }
                }]
            });

            if (total_margin < 48) {
                throw new Error("Platform health is too low.");
            }

            if (eligible_users.length <= 0) {
                throw new Error("No eligible users");
            }

            const total_amount_redistributed = (total_charged - total_payout) * redistribution_percentage / 100;
            const total_xp_distributed = eligible_users.reduce((sum, u) => sum + u.total_xp, 0);
            const amount_per_xp = total_amount_redistributed / total_xp_distributed;
            const redistribution = await Redistribution.create({
                total_margin,
                redistribution_percentage,
                total_xp_distributed,
                amount_per_xp,
                total_amount_redistributed,
                executed_by_admin_id: admin_id,
                transaction
            });

            for(const user of eligible_users) {
                const reward = user.total_xp * amount_per_xp;

                await RedistributionDetail.create({
                    redistribution_id: redistribution.id,
                    user_id: user.id,
                    xp_converted: user.total_xp,
                    amount_credited: reward,
                    transaction
                })

                user.balance = parseFloat(user.balance) + reward;
                user.total_xp = 0;
                await user.save({transaction});
            }

            logger.info(`CloudXPService: ${total_amount_redistributed}$ successfully redistributed to ${(await redistribution.getRedistributionDetails()).length} users.`);
            await transaction.commit();
        } catch(error) {
            logger.error(`CloudXPService: Redistribution failed: ${error.message}`);
            await transaction.rollback();
            throw error;
        }
    }

    /**
     * Calculate current platform health (Margin).
     */
    async calculatePlatformStats() {
        // In a real V0, this would sum up all transactions
        // For the demo cockpit:
        return {
            totalRevenue: 2450.50,
            platformPayouts: 1240.20,
            netMarginPercent: 49.3, // Above 48% target
            availableCloudXp: 15400
        };
    }
}

module.exports = new CloudXPService();
