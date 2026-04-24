const { UserSubscription } = require("../../models");
const SubscriptionService = require("../../services/SubscriptionService");

// Get current user subscription
const getCurrentSubscription = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscription = await SubscriptionService.getUserSubscription(userId);

        if (!subscription) {
            return res.status(404).json({ message: 'No active subscription found' });
        }

        res.json(subscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Subscribe to a subscription plan
const subscribe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subscriptionId } = req.body;

        if (!subscriptionId) {
            return res.status(400).json({ message: 'subscriptionId is required' });
        }

        // Cancel existing active subscription
        await UserSubscription.update(
            { is_active: false, cancelled_at: new Date() },
            { where: { user_id: userId, is_active: true } }
        );

        // Create new subscription
        const newSubscription = await SubscriptionService.subscribe(userId, subscriptionId);

        res.status(201).json(newSubscription);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cancel subscription
const cancelSubscription = async (req, res) => {
    try {
        const userId = req.user.id;

        await SubscriptionService.cancelSubscription(userId);

        res.json({ message: 'Subscription cancelled', subscription });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCurrentSubscription,
    subscribe,
    cancelSubscription
};