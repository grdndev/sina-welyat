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
     * Amount: 10.00$ mandatory, confirmed off-session with customer's default PM
     */
    async preAuthorizeCall(customerId) {
        const customer = await this.stripe.customers.retrieve(customerId);
        const pm = customer.invoice_settings?.default_payment_method;
        if (!pm) {
            const err = new Error('No payment method on file');
            err.code = 'no_payment_method';
            throw err;
        }
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: 1000,
            currency: 'usd',
            customer: customerId,
            payment_method: pm,
            capture_method: 'manual',
            confirm: true,
            off_session: true,
            description: 'WELYAT: Call pre-authorization',
        });
        logger.info(`Pre-auth created: ${paymentIntent.id} for customer ${customerId}`);
        return paymentIntent;
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
     * Create a payout (transfer to listener)
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

    /**
     * Create a Stripe Checkout Session for a subscription
     */
    async createCheckoutSession({ customerId, priceId, successUrl, cancelUrl, userId, subscriptionId }) {
        try {
            const session = await this.stripe.checkout.sessions.create({
                customer: customerId,
                mode: 'subscription',
                line_items: [{ price: priceId, quantity: 1 }],
                success_url: successUrl,
                cancel_url: cancelUrl,
                client_reference_id: userId,
                metadata: { subscription_id: subscriptionId, user_id: userId },
            });
            logger.info(`Checkout session created: ${session.id} for user ${userId}`);
            return session;
        } catch (error) {
            logger.error(`Error creating checkout session: ${error.message}`);
            throw error;
        }
    }

    /**
     * Cancel a Stripe subscription
     */
    async cancelStripeSubscription(stripeSubscriptionId) {
        try {
            const subscription = await this.stripe.subscriptions.cancel(stripeSubscriptionId);
            logger.info(`Stripe subscription cancelled: ${stripeSubscriptionId}`);
            return subscription;
        } catch (error) {
            logger.error(`Error cancelling Stripe subscription: ${error.message}`);
            throw error;
        }
    }

    /**
     * Construct and verify a Stripe webhook event
     */
    constructWebhookEvent(payload, signature, secret) {
        return this.stripe.webhooks.constructEvent(payload, signature, secret);
    }

    async hasDefaultPaymentMethod(customerId) {
        const customer = await this.stripe.customers.retrieve(customerId);
        return !!customer.invoice_settings?.default_payment_method;
    }

    async createSetupIntent(customerId) {
        return this.stripe.setupIntents.create({
            customer: customerId,
            usage: 'off_session',
            automatic_payment_methods: { enabled: true },
        });
    }

    async setDefaultPaymentMethod(customerId, paymentMethodId) {
        await this.stripe.customers.update(customerId, {
            invoice_settings: { default_payment_method: paymentMethodId },
        });
    }

    async createSetupCheckoutSession({ customerId, successUrl, cancelUrl, userId }) {
        const session = await this.stripe.checkout.sessions.create({
            customer: customerId,
            mode: 'setup',
            currency: 'usd',
            success_url: successUrl,
            cancel_url: cancelUrl,
            client_reference_id: String(userId),
        });
        logger.info(`Setup checkout session created: ${session.id} for user ${userId}`);
        return session;
    }

    async finalizeSetupFromSession(customerId) {
        const customer = await this.stripe.customers.retrieve(customerId);
        if (customer.invoice_settings?.default_payment_method) return true;

        const sessions = await this.stripe.checkout.sessions.list({ customer: customerId, limit: 10 });
        const setupSession = sessions.data.find(s => s.mode === 'setup' && s.status === 'complete');
        if (!setupSession?.setup_intent) return false;

        const setupIntent = await this.stripe.setupIntents.retrieve(setupSession.setup_intent);
        if (!setupIntent.payment_method) return false;

        await this.setDefaultPaymentMethod(customerId, setupIntent.payment_method);
        return true;
    }

    async captureCallPayment(paymentIntentId, amountCents) {
        return this.stripe.paymentIntents.capture(paymentIntentId, {
            amount_to_capture: amountCents,
        });
    }

    /**
     * Create a Stripe Connect Express account for a listener
     */
    async createConnectAccount({ email, userId }) {
        try {
            const account = await this.stripe.accounts.create({
                type: 'express',
                email: email || undefined,
                metadata: { user_id: userId },
                capabilities: { transfers: { requested: true } },
            });
            logger.info(`Stripe Connect account created: ${account.id} for user ${userId}`);
            return account;
        } catch (error) {
            logger.error(`Error creating Connect account: ${error.message}`);
            throw error;
        }
    }

    /**
     * Create a Stripe Connect onboarding link
     */
    async createAccountLink({ accountId, refreshUrl, returnUrl }) {
        try {
            const link = await this.stripe.accountLinks.create({
                account: accountId,
                refresh_url: refreshUrl,
                return_url: returnUrl,
                type: 'account_onboarding',
            });
            return link;
        } catch (error) {
            logger.error(`Error creating account link: ${error.message}`);
            throw error;
        }
    }

    /**
     * Retrieve a Stripe Connect account
     */
    async retrieveConnectAccount(accountId) {
        try {
            return await this.stripe.accounts.retrieve(accountId);
        } catch (error) {
            logger.error(`Error retrieving Connect account: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new StripeService();
