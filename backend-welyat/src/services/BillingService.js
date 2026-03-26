const { Op } = require('sequelize');
const { Transaction, Call, User, Boost } = require('../models');
const CallStateMachine = require('./CallStateMachine');
const logger = require('../config/logger');
const StripeService = require('./StripeService');
const TwilioService = require('./TwilioService');

class BillingService {
    /**
     * Facturer les frais de mise en relation (Bridge Fees)
     * WELYAT V0: 0.10$ au décrochage et 0.10$ à T=10:00
     */
    async chargeBridgeFee(callId, type = 'bridge_fee_hookup') {
        try {
            const call = await Call.findByPk(callId, {
                include: [{ model: User, as: 'talker' }]
            });

            if (!call) throw new Error(`Call ${callId} not found`);

            const amount = 0.10; // Fixe pour WELYAT V0
            const user = call.talker;

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
            const listenerRatePerMin = parseFloat(call.business_mode.price_per_minute_listener);
            let payoutForThisTick = listenerRatePerMin;

            // 2.1 Founding Listener Boost Logic (+10% max)
            const listener = await User.findByPk(call.listener_id);
            if (listener && listener.is_founding) {
                // Circuit Breaker: check platform margin (24h)
                const {margin, safe} = await this.checkPlatformMarginSafety();

                if (safe) {
                    const boost = listenerRatePerMin * 0.10;
                    payoutForThisTick += boost;

                    logger.info(`WELYAT: Founding Boost applied (+${boost.toFixed(3)}$) for listener ${listener.id}`);
                    await Boost.create({
                        user_id: listener.id,
                        original_amount: listenerRatePerMin,
                        boosted_amount: listenerRatePerMin + boost,
                        margin_at_time: margin
                    })
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
                await TwilioService.endCall(call.twilio_call_sid);
                const fsm = new CallStateMachine(call);
                await fsm.end('Payment failure - Zero Debt Rule');
                return;
            }

            // 4. Update DB
            call.total_cost_client = parseFloat(call.total_cost_client) + price;
            call.total_payout_listener = parseFloat(call.total_payout_listener) + payoutForThisTick;
            call.duration_paid_seconds = (call.duration_paid_seconds || 0) + 60;
            await call.save();

            // Credit listener
            if (listener) {
                listener.balance = parseFloat(listener.balance) + payoutForThisTick;
                await listener.save();
            }

            // Create transaction record
            await Transaction.create({
                user_id: call.talker_id,
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
     * To avoid blocking payments, safety is set to true on edge cases
     * NO_CHARGES_FOUND -> margin: 1
     * SERVER_ERROR -> margin: -1
     */
    async checkPlatformMarginSafety() {
        try {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

            const charge = await Transaction.sum('amount', {
                where: { type: 'charge', created_at: { [Op.gte]: twentyFourHoursAgo } }
            }) || 0;

            const payouts = await Transaction.sum('amount', {
                where: { type: 'payout', created_at: { [Op.gte]: twentyFourHoursAgo } }
            }) || 0;

            if (charge === 0) return {margin: 1, safe: true};

            const margin = (charge - payouts) / charge;
            return {margin, safe: margin >= 0.48};
        } catch (error) {
            logger.error(`BillingService: Error checking margin safety: ${error.message}`);
            return {margin: -1, safe: true};
        }
    }
}

module.exports = new BillingService();
