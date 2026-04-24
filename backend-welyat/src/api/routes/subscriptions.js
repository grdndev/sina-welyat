const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

/**
 * @route   GET /api/v1/subscriptions/plans
 * @desc    Get all subscription plans
 * @access  Private
 */
router.get('/plans', subscriptionController.getPlans);

/**
 * @route   GET /api/v1/subscriptions/current
 * @desc    Get current subscription
 * @access  Private
 */
router.get('/current', subscriptionController.getCurrentSubscription);

/**
 * @route   POST /api/v1/subscriptions/cancel
 * @desc    Cancel subscription
 * @access  Private
 */
router.post('/cancel', subscriptionController.cancelSubscription);


/**
 * @route   POST /api/v1/subscriptions/checkout
 * @desc    Create a Stripe Checkout Session
 * @access  Private
 */
router.post('/checkout', subscriptionController.createCheckoutSession);

module.exports = router;
