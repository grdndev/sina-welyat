const StripeService = require('./StripeService');
const { Transaction, Call, User } = require('../models');
const logger = require('../config/logger');

class BillingService {
    /**
     * Facturer les frais de mise en relation (Bridge Fees)
     * WELYAT V0: 0.10$ au décrochage et 0.10$ à T=10:00
     */
    async chargeBridgeFee(callId, type = 'bridge_fee_hookup') {
        try {
            const call = await Call.findByPk(callId, {
                include: [{ model: User, as: 'parlant' }]
            });

            if (!call) throw new Error(`Call ${callId} not found`);

            const amount = 0.10; // Fixe pour WELYAT V0
            const user = call.parlant;

            // Zero Debt Rule applies here too
            try {
                // StripeService.chargeBridgeFee(user.id, amount, type)
                // if FAIL -> trigger hangup
            } catch (stripeError) {
                logger.error(`Bridge fee ${type} failed for call ${callId}. Disconnecting.`);
                // Logic to disconnect call...
                throw stripeError;
            }

            const transaction = await Transaction.create({
                user_id: user.id,
                call_id: call.id,
                type: 'bridge_fee',
                amount: amount,
                status: 'completed',
                metadata: { bridge_type: type }
            });

            // Mettre à jour le coût total de l'appel
            call.total_cost_client = parseFloat(call.total_cost_client || 0) + amount;
            await call.save();

            logger.info(`WELYAT Bridge fee (${type}) of ${amount}$ charged for call ${callId}`);
            return transaction;
        } catch (error) {
            logger.error(`Error charging WELYAT bridge fee: ${error.message}`);
            throw error;
        }
    }

    /**
     * Facturer une minute de conversation payante (Logic WELYAT V0)
     */
    async chargeMinute(callId) {
        try {
            const call = await Call.findByPk(callId, {
                include: ['business_mode']
            });

            if (!call || call.status !== 'active_paid') return;

            // 1. Calcul du montant de la minute
            // Billing cap: 19.99 * ceil(paid_seconds / 3600)
            const hourlyCap = parseFloat(process.env.MAX_CHARGE_PER_HOUR) || 19.99;
            const currentHour = Math.ceil((call.duration_paid_seconds + 60) / 3600);
            const totalMaxAllowed = currentHour * hourlyCap;

            let price = parseFloat(call.business_mode.price_per_minute_client);

            // Si le prochain ajout dépasse le cap de l'heure en cours, on ajuste le prix
            if (parseFloat(call.total_cost_client) + price > totalMaxAllowed) {
                price = Math.max(0, totalMaxAllowed - parseFloat(call.total_cost_client));
            }

            // 2. Calcul du Payout précis (à la seconde)
            // Logic: payout = paid_seconds * (listener_rate_per_min / 60)
            const listenerRatePerMin = parseFloat(call.business_mode.price_per_minute_écoutant);
            let payoutForThisTick = listenerRatePerMin;

            // 2.1 Founding Listener Boost Logic (+10% max)
            const listener = await User.findByPk(call.écoutant_id);
            if (listener && listener.is_founding) {
                // Circuit Breaker: check platform margin (24h)
                const isMarginSafe = await this.checkPlatformMarginSafety();
                if (isMarginSafe) {
                    const boost = listenerRatePerMin * 0.10;
                    payoutForThisTick += boost;
                    logger.info(`WELYAT: Founding Boost applied (+${boost.toFixed(3)}$) for listener ${listener.id}`);
                } else {
                    logger.warn(`WELYAT: Circuit Breaker active - Margin < 48%. Founding Boost paused.`);
                }
            }

            // 3. Tentative de charge Stripe immédiate (Zero Debt Rule)
            try {
                // Simulation Stripe Charge
                // if (FAIL) throw new Error('Payment failed');
            } catch (stripeError) {
                logger.error(`Zero Debt Rule: Stripe charge failed for call ${callId}. Hanging up.`);
                const TwilioService = require('./TwilioService');
                await TwilioService.endCall(call.twilio_call_sid);
                const CallStateMachine = require('./CallStateMachine');
                const fsm = new CallStateMachine(call);
                await fsm.end('Payment failure - Zero Debt Rule');
                return;
            }

            // 4. Update DB
            call.total_cost_client = parseFloat(call.total_cost_client) + price;
            call.total_payout_écoutant = parseFloat(call.total_payout_écoutant) + payoutForThisTick;
            call.duration_paid_seconds = (call.duration_paid_seconds || 0) + 60;
            await call.save();

            // Crediter la balance de l'écoutant
            if (listener) {
                listener.balance = parseFloat(listener.balance) + payoutForThisTick;
                await listener.save();
            }

            // Create transaction record
            await Transaction.create({
                user_id: call.parlant_id,
                call_id: call.id,
                type: 'charge',
                amount: price,
                status: 'completed'
            });

            logger.info(`WELYAT Minute charged: +${price}$ (Total: ${call.total_cost_client}$ / Cap: ${totalMaxAllowed}$) for call ${callId}`);

        } catch (error) {
            logger.error(`Error in WELYAT chargeMinute: ${error.message}`);
        }
    }
    /**
     * Circuit Breaker: Check if platform margin (24h rolling) is >= 48%
     */
    async checkPlatformMarginSafety() {
        try {
            const { Op } = require('sequelize');
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const revenue = await Transaction.sum('amount', {
                where: { type: 'charge', created_at: { [Op.gte]: twentyFourHoursAgo } }
            }) || 0;

            const payouts = await Call.sum('total_payout_écoutant', {
                where: { ended_at: { [Op.gte]: twentyFourHoursAgo } }
            }) || 0;

            if (revenue === 0) return true; // Start of day, safety first

            const margin = (revenue - payouts) / revenue;
            return margin >= 0.48;
        } catch (error) {
            logger.error(`BillingService: Error checking margin safety: ${error.message}`);
            return true; // Default to safe to avoid blocking payments
        }
    }
}

module.exports = new BillingService();
