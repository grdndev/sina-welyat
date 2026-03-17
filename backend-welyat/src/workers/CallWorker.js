const { Call, BusinessMode } = require('../models');
const BillingService = require('../services/BillingService');
const CallStateMachine = require('../services/CallStateMachine');
const TwilioService = require('../services/TwilioService');
const logger = require('../config/logger');
const { Op } = require('sequelize');

class CallWorker {
    constructor() {
        this.interval = null;
    }

    start() {
        logger.info('Call Worker started - Checking active calls every 60s');
        this.interval = setInterval(() => this.tick(), 60000);
    }

    stop() {
        if (this.interval) clearInterval(this.interval);
    }

    async tick() {
        try {
            const activeCalls = await Call.findAll({
                where: {
                    status: { [Op.in]: ['active_free', 'alerted', 'active_paid'] }
                },
                include: ['business_mode']
            });

            const now = new Date();

            for (const call of activeCalls) {
                const startedAt = new Date(call.started_at);
                const elapsedMinutes = Math.floor((now - startedAt) / 60000);
                const fsm = new CallStateMachine(call);

                // Logic PHASE GRATUITE
                if (call.status === 'active_free' || call.status === 'alerted') {
                    const freeMinutesThreshold = call.business_mode.free_duration_minutes || 15;
                    const alertAt = freeMinutesThreshold - 2;

                    // T=10 : Second Bridge Fee (0.10$)
                    if (elapsedMinutes >= 10 && !call.bridge_fee_2_charged) {
                        await BillingService.chargeBridgeFee(call.id, 0.10, 'bridge_fee');
                        call.bridge_fee_2_charged = true;
                        await call.save();
                    }

                    // Audio Alert (2 minutes before end of free phase)
                    if (elapsedMinutes >= alertAt && call.status === 'active_free') {
                        await fsm.alert();
                        if (call.twilio_call_sid) {
                            await TwilioService.playAudioMessage(call.twilio_call_sid,
                                "This call will become paid in 2 minutes. Press # to continue or hang up.");
                        }
                    }

                    // Transition decision (Hangup if not converted at the end of free phase)
                    if (elapsedMinutes >= freeMinutesThreshold && call.status === 'alerted' && !call.dtmf_pressed) {
                        logger.info(`T=${freeMinutesThreshold} reached for call ${call.id} without DTMF. Hanging up.`);
                        await fsm.end('No DTMF conversion at end of free phase');
                        if (call.twilio_call_sid) {
                            await TwilioService.endCall(call.twilio_call_sid);
                        }
                    }
                }

                // Logic PHASE PAYANTE
                if (call.status === 'active_paid') {
                    await BillingService.chargeMinute(call.id);
                }
            }
        } catch (error) {
            logger.error(`Error in CallWorker tick: ${error.message}`);
        }
    }
}

module.exports = new CallWorker();
