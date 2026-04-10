const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

/**
 * @route   GET /api/v1/subscriptions/current
 * @desc    Get current subscription
 * @access  Private
 */
router.get('/current', subscriptionController.getCurrentSubscription);

/**
 * @route   POST /api/v1/subscriptions/subscribe
 * @desc    Subscribe to a plan
 * @access  Private
 */
router.post('/subscribe', subscriptionController.subscribe);

/**
 * @route   POST /api/v1/subscriptions/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/cancel', subscriptionController.cancelSubscription);


module.exports = router;
