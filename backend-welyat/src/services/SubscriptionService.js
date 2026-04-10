const { UserSubscription } = require("../models");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class SubscriptionService {
    /**
     * Subscribe a user to a plan
     * @param {string} userId - The user ID
     * @param {string} planId - The plan ID to subscribe to
     * @returns {Promise<Object>} Subscription details
     */
    async subscribe(userId, planId) {
        // Check user's existing subscriptions
        const existingSubscription = await this.getUserSubscription(userId);

        if (existingSubscription) {
            // User has a subscription, only allow if different plan
            if (existingSubscription.planId === planId) {
                throw new Error('User is already subscribed to this plan');
            }
            // Cancel existing subscription before creating new one
            await this.cancelSubscription(userId, existingSubscription.id);
        }

        // Create new subscription via Stripe
        const stripeSubscription = await this.createStripeSubscription(userId, planId);

        // Save subscription to database
        const subscription = await this.saveSubscription(userId, planId, stripeSubscription.id);

        return subscription;
    }

    /**
     * Get user's current subscription
     * @param {string} userId - The user ID
     * @returns {Promise<Object|null>} Current subscription or null
     */
    async getUserSubscription(userId) {
        const userSubscription = await UserSubscription.findOne({
            where: { user_id: userId, is_active: true },
            include: 'Subscription',
        });

        return userSubscription ? userSubscription.Subscription : null;
    }

    /**
     * Cancel user's subscription
     * @param {string} userId - The user ID
     * @param {string} subscriptionId - The subscription ID
     * @returns {Promise<void>}
     */
    async cancelSubscription(userId, subscriptionId) {
        // TODO: Cancel via Stripe

        await UserSubscription.update(
            { is_active: false },
            { where: { user_id: userId, subscription_id: subscriptionId, is_active: true } }
        );
    }

    /**
     * Create subscription in Stripe
     * @param {string} userId - The user ID
     * @param {string} planId - The plan ID
     * @returns {Promise<Object>} Stripe subscription object
     */
    async createStripeSubscription(userId, planId) {
        // TODO: Implement Stripe integration
        // return await stripe.subscriptions.create({
        //   customer: stripeCustomerId,
        //   items: [{ price: stripePriceId }],
        // });
        throw new Error('Stripe integration not implemented');
    }

    /**
     * Save subscription to database
     * @param {string} userId - The user ID
     * @param {string} planId - The plan ID
     * @param {string} stripeSubscriptionId - The Stripe subscription ID
     * @returns {Promise<Object>} Saved subscription
     */
    async saveSubscription(userId, planId, stripeSubscriptionId) {
        const subscription = await UserSubscription.create({
            user_id: userId,
            subscription_id: planId,
            stripe_subscription_id: stripeSubscriptionId,
        });

        return subscription;
    }
}

module.exports = SubscriptionService;