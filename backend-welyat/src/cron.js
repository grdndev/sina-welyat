const cron = require('node-cron');
const ScoringService = require('./services/ScoringService');
const FoundingService = require('./services/FoundingService');
const MailService = require('./services/MailService');
const logger = require('./config/logger');

if (process.env.NODE_ENV !== 'test') {
    cron.schedule('0 0 * * *', () => ScoringService.checkListeners());
    cron.schedule('0 1 * * *', () => ScoringService.checkTalkers());
    cron.schedule('0 2 * * *', () => FoundingService.checkFounding());

    cron.schedule('0 * * * *', () => MailService.sendAfterOneHour());
    cron.schedule('0 9 * * *', () => MailService.sendAfterOneDay());

    // Monthly: replenish bonus_seconds for all active subscribers
    cron.schedule('0 0 1 * *', async () => {
        try {
            const { User, UserSubscription, Subscription } = require('./models');
            const activeSubs = await UserSubscription.findAll({
                where: { is_active: true },
                include: [{ model: Subscription }],
            });
            for (const sub of activeSubs) {
                if (sub.Subscription?.free_seconds_per_month) {
                    await User.increment(
                        { bonus_seconds: sub.Subscription.free_seconds_per_month },
                        { where: { id: sub.user_id } }
                    );
                }
            }
            logger.info(`Monthly bonus_seconds replenishment done for ${activeSubs.length} subscribers`);
        } catch (err) {
            logger.error(`Monthly bonus replenishment failed: ${err.message}`);
        }
    });
}