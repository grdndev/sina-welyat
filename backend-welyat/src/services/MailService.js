const { Op } = require('sequelize');
const { Resend } = require('resend');
const crypto = require('crypto');
const { User } = require('../models');

const resend = new Resend(process.env.RESEND_API_KEY);

const MAGIC_LINK_TTL_MS = 7 * 24 * 60 * 60 * 1000;

class MailService {
    static async generateMagicLink(user) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + MAGIC_LINK_TTL_MS);
        await user.update({ magic_link_token: token, magic_link_expires_at: expires });
        return `${process.env.FRONTEND_URL}/magic/${token}`;
    }

    static async sendAfterOneHour() {
        try {
            const oneHourAgo = new Date(Date.now() - (60 * 60 * 1000));

            console.log(`[MailService] Checking for users requiring 1H reminders around ${oneHourAgo.toISOString()}`);
            const users1h = await User.findAll({
                where: {
                    email: { [Op.ne]: null },
                    createdAt: { [Op.between]: [new Date(oneHourAgo.getTime() - (60 * 60 * 1000)), oneHourAgo] },
                },
            });

            for (const user of users1h) {
                const email = await MailService.emailOneHour(user);
                await resend.emails.send({
                    from: 'contact@welyat.com',
                    to: user.email,
                    subject: email.subject,
                    html: email.html,
                });
            }
        } catch (error) {
            console.error('[MailService] Error sending +1h reminders:', error.message);
        }
    }

    static async sendAfterOneDay() {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - (24 * 60 * 60 * 1000));

            console.log(`[MailService] Checking for users requiring 24H reminders around ${twentyFourHoursAgo.toISOString()}`);
            const users24h = await User.findAll({
                where: {
                    email: { [Op.ne]: null },
                    createdAt: { [Op.between]: [new Date(twentyFourHoursAgo.getTime() - (24 * 60 * 60 * 1000)), twentyFourHoursAgo] },
                },
            });

            for (const user of users24h) {
                const email = await MailService.emailOneDay(user);
                await resend.emails.send({
                    from: 'contact@welyat.com',
                    to: user.email,
                    subject: email.subject,
                    html: email.html,
                });
            }
        } catch (error) {
            console.error('[MailService] Error sending +24h reminders:', error.message);
        }
    }

    static emailOneHour = async (user) => {
        const magicLink = await MailService.generateMagicLink(user);
        return {
            subject: 'Still thinking about earlier ?',
            html: `Hi,<br><br>We just wanted to check in with you.<br><br>How are you feeling right now?<br><br>If you need to talk again, someone is always here to listen.<br><br>You don't have to go through this alone.<br><br>👉 <a href="${magicLink}">Talk again</a><br><br>— Welyat`,
        };
    }

    static emailOneDay = async (user) => {
        const magicLink = await MailService.generateMagicLink(user);
        return {
            subject: "You don't have to go through this alone",
            html: `Hi,<br><br>Just a quick reminder that you're not alone.<br><br>If things feel heavy again, you can always come back and talk to someone who listens.<br><br>Sometimes, talking more than once can really help.<br>Our listeners are here whenever you need.<br><br>👉 <a href="${magicLink}">Talk to someone now</a><br><br>Take care of yourself,<br>— Welyat`,
        };
    }
}

module.exports = MailService;
