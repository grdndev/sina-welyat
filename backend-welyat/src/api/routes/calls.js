const express = require('express');
const rateLimit = require('express-rate-limit');
const callController = require('../controllers/callController');

const router = express.Router();

const initiateLimit = rateLimit({
    legacyHeaders: false,
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP'
});

/**
 * @route   POST /api/v1/calls/initiate
 * @desc    Initiate a new call matching process
 * @access  Private (Parlant)
 */
router.post('/initiate', initiateLimit, callController.initiateCall);

/**
 * @route   GET /api/v1/calls/active
 * @desc    Get active call for current user
 * @access  Private
 */
router.get('/active', callController.getActiveCall);

/**
 * @route   GET /api/v1/calls/my-calls
 * @desc    Get call history for current user
 * @access  Private
 */
router.get('/my-calls', callController.getMyCalls);

router.get('/payment-status', callController.getPaymentStatus);
router.post('/setup-payment', callController.setupPayment);
router.post('/finalize-setup', callController.finalizeSetup);
router.post('/:id/second-preauth', callController.secondPreauth);

/**
 * @route   GET /api/v1/calls/:id
 * @desc    Get detailed info of a specific call
 * @access  Private
 */
router.get('/:id', callController.getCallDetails);

/**
 * @route   POST /api/v1/calls/:id/end
 * @desc    Manually end a call
 * @access  Private
 */
router.post('/:id/end', callController.endCall);

/**
 * @route   POST /api/v1/calls/:id/rate
 * @desc    Rate the call
 * @access  Private
 */
router.post('/:id/rate', callController.rateCall);

module.exports = router;
