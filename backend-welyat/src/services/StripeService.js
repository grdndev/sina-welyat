const Stripe = require('stripe');
const logger = require('../config/logger');

class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    /**
     * Create a Stripe customer
     */
    async createCustomer(userId, email) {
        try {
            const customer = await this.stripe.customers.create({
                email,
                metadata: {
                    user_id: userId,
                },
            });

            logger.info(`Stripe customer created: ${customer.id} for user ${userId}`);
            return customer;
        } catch (error) {
            logger.error(`Error creating Stripe customer: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create a payment method and attach to customer
     */
    async createPaymentMethod(customerId, paymentMethodId) {
        try {
            const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
                customer: customerId,
            });

            // Set as default payment method
            await this.stripe.customers.update(customerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });

            logger.info(`Payment method attached: ${paymentMethodId} to ${customerId}`);
            return paymentMethod;
        } catch (error) {
            logger.error(`Error attaching payment method: ${error.message}`);
            throw error;
        }
    }

    /**
     * Pre-authorize a call for WELYAT V0
     * Amount: 20.00$ mandatory
     */
    async preAuthorizeCall(customerId) {
        const amount = 20.00;
        return this.authorizePayment(customerId, amount, 'WELYAT V0: Pre-authorization security');
    }

    /**
     * Authorize a payment (creates PaymentIntent)
     */
    async authorizePayment(customerId, amount, description = 'WELYAT Call Authorization') {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: Math.round(amount * 100), // Convert to cents
                currency: 'usd',
                customer: customerId,
                capture_method: 'manual',
                description,
            });

            logger.info(
                `Payment authorized: ${paymentIntent.id} for ${amount} USD (customer: ${customerId})`
            );
            return paymentIntent;
        } catch (error) {
            logger.error(`Error authorizing payment: ${error.message}`);
            throw error;
        }
    }

    /**
     * Capture a charge (captures a previously authorized PaymentIntent)
     */
    async captureCharge(paymentIntentId, amountToCapture = null) {
        try {
            const captureOptions = {};
            if (amountToCapture) {
                captureOptions.amount_to_capture = Math.round(amountToCapture * 100);
            }

            const paymentIntent = await this.stripe.paymentIntents.capture(
                paymentIntentId,
                captureOptions
            );

            logger.info(`Payment captured: ${paymentIntentId} for ${paymentIntent.amount / 100} USD`);
            return paymentIntent;
        } catch (error) {
            logger.error(`Error capturing payment: ${error.message}`);
            throw error;
        }
    }

    /**
     * Cancel a payment authorization
     */
    async cancelPaymentIntent(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.cancel(paymentIntentId);

            logger.info(`Payment intent canceled: ${paymentIntentId}`);
            return paymentIntent;
        } catch (error) {
            logger.error(`Error canceling payment intent: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create a payout (transfer to écoutant)
     */
    async createPayout(amount, destination, description = 'WELYAT Listener Payout') {
        try {
            const payout = await this.stripe.payouts.create({
                amount: Math.round(amount * 100),
                currency: 'usd',
                destination,
                description,
            });

            logger.info(`Payout created: ${payout.id} for ${amount} USD`);
            return payout;
        } catch (error) {
            logger.error(`Error creating payout: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get customer by ID
     */
    async getCustomer(customerId) {
        try {
            const customer = await this.stripe.customers.retrieve(customerId);
            return customer;
        } catch (error) {
            logger.error(`Error retrieving customer: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new StripeService();
