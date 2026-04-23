const logger = require('../config/logger');
const BillingService = require('./BillingService');
const TwilioService = require('./TwilioService');
const CallStateMachine = require('./CallStateMachine');

/**
 * CallFlowManager - Orchestrates WELYAT V0 call lifecycle timers
 */
class CallFlowManager {
    constructor() {
        this.activeTimers = new Map(); // callId -> { timers: [] }
    }

    /**
     * Start the lifecycle for an active call
     */
    async onCallStarted(call) {
        const callId = call.id;
        const timers = [];

        // Fetch BusinessMode for dynamic free_minutes
        const { BusinessMode } = require('../models');
        const mode = await BusinessMode.findByPk(call.business_mode_id);
        const freeMinutes = mode ? mode.free_duration_minutes : 15;

        logger.info(`CallFlowManager: Starting lifecycle for call ${callId} (${freeMinutes}m free)`);

        // 1. T=0: Micro-fee Hook-up ($0.20)
        await BillingService.chargeBridgeFee(callId, 'hook_up');

        // 2. T = (Free - 2)m: Audio Alert (TTS English)
        const alertTimeMs = (freeMinutes - 2) * 60 * 1000;
        const alertTimer = setTimeout(async () => {
            if (call.twilio_call_sid) {
                await TwilioService.playAudioMessage(
                    call.twilio_call_sid,
                    "This call will become paid in 2 minutes. Press pound to continue."
                );
            }
        }, alertTimeMs);
        timers.push(alertTimer);

        // 4. T = Free m: Safety Hangup (if not converted to paid)
        const hangupTimeMs = freeMinutes * 60 * 1000;
        const hangupTimer = setTimeout(async () => {
            const { Call } = require('../models');
            const currentCall = await Call.findByPk(callId);

            if (currentCall && currentCall.status !== 'active_paid' && currentCall.status !== 'ended') {
                logger.info(`CallFlowManager: ${freeMinutes}m limit reached for call ${callId}. No # pressed. Hanging up.`);
                if (currentCall.twilio_call_sid) {
                    await TwilioService.endCall(currentCall.twilio_call_sid);
                }
                const fsm = new CallStateMachine(currentCall);
                await fsm.end(`${freeMinutes}m Free limit reached - No conversion`);
            }
        }, hangupTimeMs);
        timers.push(hangupTimer);

        this.activeTimers.set(callId, timers);
    }

    /**
     * Clean up timers when call ends
     */
    stopTimers(callId) {
        const timers = this.activeTimers.get(callId);
        if (timers) {
            timers.forEach(t => clearTimeout(t));
            this.activeTimers.delete(callId);
            logger.info(`CallFlowManager: Timers stopped for call ${callId}`);
        }
    }
}

module.exports = new CallFlowManager();
