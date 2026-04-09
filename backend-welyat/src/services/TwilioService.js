const twilio = require('twilio');
const logger = require('../config/logger');

class TwilioService {
    constructor() {
        this._client = null;
        this.twilioNumber = process.env.TWILIO_PHONE_NUMBER;
    }

    get client() {
        if (!this._client) {
            const sid = process.env.TWILIO_ACCOUNT_SID;
            const token = process.env.TWILIO_AUTH_TOKEN;
            if (!sid || !token) {
                throw new Error('Twilio credentials missing (TWILIO_ACCOUNT_SID / TWILIO_AUTH_TOKEN)');
            }
            this._client = twilio(sid, token);
        }
        return this._client;
    }

    /**
     * Initiate a call between two numbers
     */
    async initiateCall(fromNumber, toNumber, statusCallbackUrl) {
        try {
            const call = await this.client.calls.create({
                from: this.twilioNumber,
                to: toNumber,
                twiml: `<Response><Dial>${fromNumber}</Dial></Response>`,
                statusCallback: statusCallbackUrl,
                statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
                statusCallbackMethod: 'POST',
            });

            logger.info(`Twilio call initiated: ${call.sid} (${fromNumber} -> ${toNumber})`);
            return call;
        } catch (error) {
            logger.error(`Error initiating Twilio call: ${error.message}`);
            throw error;
        }
    }

    /**
     * End an ongoing call
     */
    async endCall(callSid) {
        try {
            const call = await this.client.calls(callSid).update({
                status: 'completed',
            });

            logger.info(`Twilio call ended: ${callSid}`);
            return call;
        } catch (error) {
            logger.error(`Error ending Twilio call: ${error.message}`);
            throw error;
        }
    }

    /**
     * Get call status
     */
    async getCallStatus(callSid) {
        try {
            const call = await this.client.calls(callSid).fetch();
            return {
                sid: call.sid,
                status: call.status,
                duration: call.duration,
                startTime: call.startTime,
                endTime: call.endTime,
            };
        } catch (error) {
            logger.error(`Error fetching call status: ${error.message}`);
            throw error;
        }
    }

    /**
     * Play audio message during call (for T=13:00 alert)
     */
    async playAudioMessage(callSid, message) {
        try {
            const twiml = `<Response><Say voice="alice">${message}</Say><Gather numDigits="1" action="/api/v1/webhooks/twilio/dtmf" method="POST"><Say>Press hash to continue.</Say></Gather></Response>`;

            const call = await this.client.calls(callSid).update({
                twiml,
            });

            logger.info(`Audio message played on call: ${callSid}`);
            return call;
        } catch (error) {
            logger.error(`Error playing audio message: ${error.message}`);
            throw error;
        }
    }

    /**
     * Enable DTMF listening
     */
    async enableDTMF(callSid, callbackUrl) {
        try {
            const twiml = `<Response><Gather numDigits="1" action="${callbackUrl}" method="POST"><Pause length="120"/></Gather></Response>`;

            const call = await this.client.calls(callSid).update({
                twiml,
            });

            logger.info(`DTMF enabled on call: ${callSid}`);
            return call;
        } catch (error) {
            logger.error(`Error enabling DTMF: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new TwilioService();
