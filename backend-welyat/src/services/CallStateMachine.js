const logger = require('../config/logger');
const CallFlowManager = require('./CallFlowManager');

class CallStateMachine {
    constructor(call) {
        this.call = call;
        this.validTransitions = {
            WAITING: ['ACTIVE_FREE', 'CANCELLED'],
            ACTIVE_FREE: ['ALERTED', 'ENDED'], // Peut aller direct à ENDED si raccris avant 13 min
            ALERTED: ['ACTIVE_PAID', 'ENDED'],
            ACTIVE_PAID: ['ENDED'],
            ENDED: [],
            CANCELLED: [],
        };
    }

    canTransitionTo(newState) {
        const currentState = this.call.status.toUpperCase();
        return this.validTransitions[currentState]?.includes(newState);
    }

    async transitionTo(newState, reason = '') {
        const currentState = this.call.status.toUpperCase();

        if (!this.canTransitionTo(newState)) {
            const errorMsg = `Invalid state transition from ${currentState} to ${newState}`;
            logger.error(`Call ${this.call.id}: ${errorMsg}`);
            throw new Error(errorMsg);
        }

        logger.info(`Call ${this.call.id}: Transitioning from ${currentState} to ${newState} ${reason ? `(Reason: ${reason})` : ''}`);

        // Update call status
        this.call.status = newState.toLowerCase();

        // State specific updates
        const now = new Date();
        switch (newState) {
            case 'ACTIVE_FREE':
                this.call.started_at = now;
                break;
            case 'ALERTED':
                this.call.alerted_at = now;
                break;
            case 'ACTIVE_PAID':
                this.call.became_paid_at = now;
                break;
            case 'ENDED':
            case 'CANCELLED':
                this.call.ended_at = now;
                break;
        }

        await this.call.save();
        return this.call;
    }

    // Helper methods for specific transitions
    async start() {
        const result = await this.transitionTo('ACTIVE_FREE', 'Call started');
        await CallFlowManager.onCallStarted(this.call);
        return result;
    }

    async alert() {
        return this.transitionTo('ALERTED', '13min alert triggered');
    }

    async convertToPaid() {
        return this.transitionTo('ACTIVE_PAID', '# pressed by user');
    }

    async end(reason = 'Normal termination') {
        CallFlowManager.stopTimers(this.call.id);
        return this.transitionTo('ENDED', reason);
    }

    async cancel(reason = 'Cancelled before start') {
        CallFlowManager.stopTimers(this.call.id);
        return this.transitionTo('CANCELLED', reason);
    }
}

module.exports = CallStateMachine;
