const logger = require('../config/logger');

class XPCalculatorService {
    /**
     * Calcule l'XP généré pour un appel (WELYAT V0)
     * Règle: Paid -> XP = 0. Sinat: floor(free_minutes / 5)
     */
    calculateXP(durationFreeSeconds, durationPaidSeconds) {
        try {
            if (durationPaidSeconds > 0) {
                logger.info(`XP: 0 generated (Call had paid duration)`);
                return 0;
            }

            const freeMinutes = Math.floor(durationFreeSeconds / 60);
            const xpGenerated = Math.floor(freeMinutes / 5);

            logger.info(`XP: ${xpGenerated} generated for ${freeMinutes} free minutes`);
            return xpGenerated;
        } catch (error) {
            logger.error(`Error calculating XP: ${error.message}`);
            return 0;
        }
    }
}

module.exports = new XPCalculatorService();
