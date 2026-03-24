const express = require('express');
const callController = require('../controllers/callController');
const { authenticateToken } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/v1/calls/initiate
 * @desc    Initiate a new call matching process
 * @access  Private (Parlant)
 */
router.post('/initiate', authenticateToken, callController.initiateCall);

/**
 * @route   GET /api/v1/calls/active
 * @desc    Get active call for current user
 * @access  Private
 */
router.get('/active', authenticateToken, callController.getActiveCall);

/**
 * @route   GET /api/v1/calls/my-calls
 * @desc    Get call history for current user
 * @access  Private
 */
router.get('/my-calls', authenticateToken, callController.getMyCalls);

/**
 * @route   GET /api/v1/calls/:id
 * @desc    Get detailed info of a specific call
 * @access  Private
 */
router.get('/:id', authenticateToken, callController.getCallDetails);

/**
 * @route   POST /api/v1/calls/:id/end
 * @desc    Manually end a call
 * @access  Private
 */
router.post('/:id/end', authenticateToken, callController.endCall);

/**
 * @route   POST /api/v1/calls/:id/rate
 * @desc    Rate the call
 * @access  Private
 */
router.post('/:id/rate', authenticateToken, callController.rateCall);

module.exports = router;
