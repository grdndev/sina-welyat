const User = require('../../models/User');
const stripeService = require('../../services/StripeService');
const logger = require('../../config/logger');

/**
 * GET /api/v1/listeners/status
 * Returns listener profile + payout status
 */
const getStatus = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

        let payout_status = 'not_started';
        if (user.stripe_payouts_enabled) payout_status = 'verified';
        else if (user.stripe_account_id) payout_status = 'pending';

        return res.json({
            success: true,
            data: {
                listener: {
                    display_name: user.display_name || user.firstname || 'Listener',
                    earning_today: 0,
                    available_balance: parseFloat(user.balance) || 0,
                    total_minutes: 0,
                    payout_status,
                    is_online: !!user.is_online,
                    last_calls: [],
                    is_founding: !!user.is_founding,
                },
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/v1/listeners/setup-payout
 * Creates a Stripe Connect Express account and returns onboarding URL
 */
const setupPayout = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

        let accountId = user.stripe_account_id;

        if (!accountId) {
            const account = await stripeService.createConnectAccount({ email: user.email, userId: user.id });
            accountId = account.id;
            await user.update({ stripe_account_id: accountId });
        }

        const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        const accountLink = await stripeService.createAccountLink({
            accountId,
            refreshUrl: `${baseUrl}/listener/payout-setup`,
            returnUrl: `${baseUrl}/listener?payout=return`,
        });

        return res.json({ success: true, data: { url: accountLink.url } });
    } catch (err) {
        logger.error(`Stripe Connect setup error: ${err.message}`);
        next(err);
    }
};

/**
 * GET /api/v1/listeners/payout-status
 * Returns current Stripe payout status
 */
const getPayoutStatus = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

        if (user.stripe_account_id && !user.stripe_payouts_enabled) {
            const account = await stripeService.retrieveConnectAccount(user.stripe_account_id);
            if (account.payouts_enabled) {
                await user.update({ stripe_payouts_enabled: true });
            }
        }

        return res.json({
            success: true,
            data: {
                stripe_account_id: user.stripe_account_id,
                payouts_enabled: user.stripe_payouts_enabled,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/v1/listeners/toggle-online
 * Toggle the listener's online/offline status
 */
const toggleOnline = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

        const newStatus = !user.is_online;
        await user.update({ is_online: newStatus });

        return res.json({ success: true, data: { is_online: newStatus } });
    } catch (err) {
        next(err);
    }
};

module.exports = { getStatus, setupPayout, getPayoutStatus, toggleOnline };
