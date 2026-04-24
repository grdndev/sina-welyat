const { UserSubscription, Subscription, User } = require("../../models");
const stripeService = require("../../services/StripeService");

// Get all subscription plans
const getPlans = async (req, res) => {
    try {
        const plans = await Subscription.findAll({ order: [['price_per_month', 'ASC']] });
        res.json({ plans });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get current user subscription
const getCurrentSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const userSubscription = await UserSubscription.findOne({
            where: { user_id: userId, is_active: true },
            include: 'Subscription',
        });

        if (!userSubscription) {
            return res.status(404).json({ message: 'No active subscription found' });
        }

        res.json({ success: true, data: { subscription: userSubscription } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id;

        const userSubscription = await UserSubscription.findOne({
            where: { user_id: userId, is_active: true },
        });

        if (!userSubscription) {
            return res.status(404).json({ message: 'No active subscription found' });
        }

        if (userSubscription.stripe_subscription_id) {
            await stripeService.cancelStripeSubscription(userSubscription.stripe_subscription_id);
        }

        await userSubscription.update({ is_active: false });

        res.json({ message: 'Subscription cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Create a Stripe Checkout Session for a subscription plan
const createCheckoutSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({ message: 'subscriptionId is required' });
        }

        const plan = await Subscription.findByPk(subscriptionId);
        if (!plan || !plan.stripe_pricing_id) {
            return res.status(404).json({ message: 'Plan not found or not configured' });
        }

        const user = await User.findByPk(userId);
        let customerId = user.stripe_customer_id;
        if (!customerId) {
            const customer = await stripeService.createCustomer(userId, user.email);
            await user.update({ stripe_customer_id: customer.id });
            customerId = customer.id;
        }

        const session = await stripeService.createCheckoutSession({
            customerId,
            priceId: plan.stripe_pricing_id,
            successUrl: `${process.env.FRONTEND_URL}/talker?subscribed=true`,
            cancelUrl: `${process.env.FRONTEND_URL}/talker/subscriptions`,
            userId,
            subscriptionId,
        });

        res.json({ url: session.url });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPlans,
    getCurrentSubscription,
    cancelSubscription,
    createCheckoutSession,
};
