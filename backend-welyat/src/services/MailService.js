const { User } = require('../models');
const { Op } = require('sequelize');

class MailService {
    /**
     * Send automatic email reminders at 1h and 24h
     */
    static async sendHourlyReminders() {
        try {
            const now = new Date();
            const oneHourAgo = new Date(now.getTime() - (60 * 60 * 1000));
            const twentyFourHoursAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000));

            // Placeholder for users needing 1h reminder
            // Requires tracking of reminder state in DB to avoid dupes in production
            console.log(`[MailService] Checking for users requiring 1H reminders around ${oneHourAgo.toISOString()}`);
            
            // Placeholder for users needing 24h reminder
            console.log(`[MailService] Checking for users requiring 24H reminders around ${twentyFourHoursAgo.toISOString()}`);

            // TODO: Implement actual email sending logic (e.g. using Nodemailer or SendGrid)
            // Example:
            // const users1h = await User.findAll({ where: { createdAt: { [Op.between]: [new Date(oneHourAgo.getTime() - 3600000), oneHourAgo] } } });
            // for (let user of users1h) {
            //     console.log(`[MailService] Sending 1h reminder to ${user.email}`);
            // }

        } catch (error) {
            console.error('[MailService] Error sending hourly reminders:', error.message);
        }
    }
}

module.exports = MailService;