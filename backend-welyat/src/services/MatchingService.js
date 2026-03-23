const { Op } = require('sequelize');
const { User, Call } = require('../models');
const logger = require('../config/logger');

class MatchingService {
    /**
     * Trouve le meilleur listener disponible pour un talker
     * @param {string} talkerId - ID du talker
     * @returns {Promise<User|null>} - L'listener trouvé ou null
     */
    async findMatch(talkerId, mode) {
        try {
            const talker = await User.findByPk(talkerId);
            if (!talker) throw new Error('Parlant not found');

            logger.info(`Matching starting for talker ${talkerId} in mode ${mode.mode_name}`);

            // Construction de la requête de base
            let whereClause = {
                role: { [Op.in]: ['listener', 'both'] },
                is_active: true,
                toxic_flag: false,
                id: { [Op.ne]: talkerId } // On ne peut pas s'écouter soi-même
            };

            // Logique spécifique aux modes
            let order = [['reputation_score', 'DESC']];

            if (mode.mode_name === 'SMART' || mode.mode_name === 'CRITICAL') {
                // Priorité haute réputation
                whereClause.reputation_score = { [Op.gte]: 4.0 };
            }

            if (mode.mode_name === 'SHIELD' || mode.mode_name === 'CRITICAL') {
                // On pourrait ajouter des filtres sur la solvabilité ici plus tard
            }

            // Gestion des talkers toxiques
            if (talker.toxic_flag) {
                whereClause.reputation_score = { [Op.lte]: 4.2 }; // On leur donne des listeners "solides" mais moins "premium"
            }

            const potentialListeners = await User.findAll({
                where: whereClause,
                order: order,
            });

            // Filtrer les occupés
            const activeCalls = await Call.findAll({
                attributes: ['listener_id'],
                where: {
                    status: { [Op.notIn]: ['ended', 'cancelled'] },
                    listener_id: { [Op.ne]: null },
                },
            });

            const busyListenerIds = activeCalls.map(c => c.listener_id);
            const availableListener = potentialListeners.find(user => !busyListenerIds.includes(user.id));

            if (availableListener) {
                // Simulation du timeout de matching du mode
                if (mode.timeout_matching > 0) {
                    logger.info(`Simulating matching timeout of ${mode.timeout_matching}s for mode ${mode.mode_name}`);
                    // await new Promise(resolve => setTimeout(resolve, mode.timeout_matching * 1000));
                }

                logger.info(`Match found: ${availableListener.id} for talker ${talkerId}`);
                return availableListener;
            }

            return null;
        } catch (error) {
            logger.error(`Error in findMatch: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new MatchingService();
