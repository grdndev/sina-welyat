const { Transaction, User, sequelize } = require('../models');
const logger = require('../config/logger');

/**
 * CloudXPService - Manages platform margin and XP redistribution.
 * Business Rule: Platform takes 48.0% margin. 
 * Excess margin can be converted to "Cloud XP" for the ecosystem.
 */
class CloudXPService {
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

    /**
     * "The Cloud Button" - Redistribute XP to all listeners based on margin surplus.
     * Rule: SurplusMax = max(0, ProfitAvantXP - 0.48 * Revenue)
     */
    async triggerCloudRedistribution(adminId, envelopeUSD) {
        const t = await sequelize.transaction();
        try {
            logger.info(`CloudXPService: Admin ${adminId} triggered Cloud Redistribution of ${envelopeUSD}$.`);

            // 1. Calculate Monthly Profit (Simplification for V0 demo)
            const stats = await this.calculatePlatformStats();
            const targetMargin = 0.48;
            const surplusMax = Math.max(0, stats.totalRevenue - (stats.totalRevenue * targetMargin) - stats.platformPayouts);

            if (envelopeUSD > surplusMax) {
                throw new Error(`CloudXPService: Envelope ${envelopeUSD}$ exceeds maximum redistributable surplus of ${surplusMax.toFixed(2)}$`);
            }

            // 2. Sum up all XP in the ecosystem
            const totalXP = await User.sum('total_xp', { where: { role: ['écoutant', 'both'] }, transaction: t }) || 1;
            const valuePerXP = envelopeUSD / totalXP;

            // 3. Redistribute $ to all listeners with XP
            const listeners = await User.findAll({
                where: { role: ['écoutant', 'both'], total_xp: { [require('../models').Op.gt]: 0 } },
                transaction: t
            });

            for (const user of listeners) {
                const reward = user.total_xp * valuePerXP;
                user.balance = parseFloat(user.balance) + reward;
                user.total_xp = 0; // Consumption rule: XP are used up
                await user.save({ transaction: t });
                logger.info(`CloudXPService: Awarded ${reward.toFixed(4)}$ for his XP to user ${user.id}`);
            }

            await t.commit();
            return { success: true, rewardedCount: listeners.length, totalRedistributed: envelopeUSD };
        } catch (error) {
            await t.rollback();
            logger.error(`CloudXPService: Redistribution failed: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new CloudXPService();
