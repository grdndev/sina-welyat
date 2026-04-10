const { Op } = require('sequelize');
const { User, Call, Transaction, UserSubscription } = require('../models');
const logger = require('../config/logger');
const { all } = require('../server');

class MatchingService {
    /**
     * Trouve le meilleur listener disponible pour un talker
     * @param {string} talkerId - ID du talker
     * @returns {Promise<User|null>} - L'listener trouvé ou null
     */
    async findMatch(talkerId, mode, filters, retry = 0) {
        try {
            const talker = await User.findByPk(talkerId);
            if (!talker) throw new Error('Talker not found');

            const subscription = await UserSubscription.findOne({
                where: { user_id: talkerId, is_active: true },
                include: 'Subscription',
            });

            logger.info(`Matching starting for talker ${talkerId} in mode ${mode.mode_name}`);

            // Construction de la requête de base
            let whereClause = {
                role: { [Op.in]: ['listener', 'both'] },
                is_active: true,
                toxic_flag: false,
                id: { [Op.ne]: talkerId } // On ne peut pas s'écouter soi-même
            };

            if (subscription && subscription.Subscription) {
                if (subscription.Subscription.gender_filter && filters.gender) {
                    whereClause.gender = filters.gender;
                }

                if (subscription.Subscription.age_filter) {
                    if (filters.age_min) {
                        const birthdateLimit = new Date();
                        birthdateLimit.setFullYear(birthdateLimit.getFullYear() - filters.age);
                        whereClause.birthdate = { [Op.lte]: birthdateLimit };
                    }
                    if (filters.age_max) {
                        const birthdateLimit = new Date();
                        birthdateLimit.setFullYear(birthdateLimit.getFullYear() - filters.age_max);
                        whereClause.birthdate = { ...whereClause.birthdate, [Op.gte]: birthdateLimit };
                    }
                }
            }

            let filters = {
                high: {},
                low: {},
            };

            let order = [['reputation_score', 'DESC']];

            if (talker.toxic_flag) {
                if (retry == 0) return null;

                filters.high.reputation_score = { [Op.lt]: 4.5 };
                filters.low.reputation_score = { [Op.lt]: 4.5 };
            } else if (mode.mode_name === 'OPTIMIZATION') {
                filters.high.reputation_score = { [Op.gte]: 4.5 };
                filters.low.reputation_score = { [Op.lt]: 4.5 };
            }

            const highPriorityListeners = await User.findAll({ where: {...whereClause, ...filters.high}, order });
            const lowPriorityListeners = await User.findAll({ where: {...whereClause, ...filters.low}, order });

            // Filtrer les occupés
            const activeCalls = await Call.findAll({
                attributes: ['listener_id'],
                where: {
                    status: { [Op.notIn]: ['ended', 'cancelled'] },
                    listener_id: { [Op.ne]: null },
                },
            });

            const busyListenerIds = activeCalls.map(c => c.listener_id);

            const paymentHistory = await Transaction.count({
                where: {
                    talker_id: talkerId,
                    status: 'completed',
                },
            });

            // Prioriser les listeners
            let priorityListeners = [];
            if (paymentHistory > 0) {
                priorityListeners = [...highPriorityListeners, ...lowPriorityListeners];
            } else {
                priorityListeners = [...lowPriorityListeners, ...highPriorityListeners];
            }

            const availableListener = priorityListeners.find(user => !busyListenerIds.includes(user.id));

            if (availableListener) {
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
