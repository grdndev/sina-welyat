const express = require('express');
const listenerController = require('../controllers/listenerController');

const router = express.Router();

/**
 * @route   GET /api/v1/listeners/status
 * @desc    Get listener profile and payout status
 * @access  Private (listener)
 */
router.get('/status', listenerController.getStatus);

/**
 * @route   POST /api/v1/listeners/setup-payout
 * @desc    Create/resume Stripe Connect onboarding link
 * @access  Private (listener)
 */
router.post('/setup-payout', listenerController.setupPayout);

/**
 * @route   GET /api/v1/listeners/payout-status
 * @desc    Check current Stripe payout status
 * @access  Private (listener)
 */
router.get('/payout-status', listenerController.getPayoutStatus);

module.exports = router;
