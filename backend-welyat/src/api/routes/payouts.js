const express = require('express');
const router = express.Router();
const payoutController = require('../controllers/payoutController');
const { authenticateToken } = require('../../middleware/auth');

/**
 * @route   POST /api/v1/payouts/request
 * @desc    Request external payout (WELYAT V0)
 * @access  Private
 */
router.post('/request', payoutController.requestExternalPayout);

module.exports = router;
