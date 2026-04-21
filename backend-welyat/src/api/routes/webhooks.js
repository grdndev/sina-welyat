const express = require('express');
const webhookController = require('../controllers/webhookController');

const router = express.Router();

/**
 * @route   POST /api/v1/webhooks/twilio/status
 */
router.post('/twilio/status', webhookController.handleTwilioStatus);

/**
 * @route   POST /api/v1/webhooks/twilio/dtmf
 */
router.post('/twilio/dtmf', webhookController.handleTwilioDTMF);

/**
 * @route   POST /api/v1/webhooks/stripe
 * @desc    Handle Stripe events (account.updated, etc.)
 * @access  Public (Stripe webhook — raw body required)
 */
router.post('/stripe', express.raw({ type: 'application/json' }), webhookController.handleStripeWebhook);

module.exports = router;
