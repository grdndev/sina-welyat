const express = require('express');
const disclaimerController = require('../controllers/disclaimerController');
const { authenticateToken, requireRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/v1/disclaimer/
 * @desc    Get disclaimer
 * @access  Public
 */
router.get('/', disclaimerController.getDisclaimer);

/**
 * @route   POST /api/v1/disclaimer/accept
 * @desc    Accept disclaimer
 * @access  Private
 */
router.post('/accept', authenticateToken, disclaimerController.acceptDisclaimer);

/**
 * @route   POST /api/v1/disclaimer/update
 * @desc    Update disclaimer
 * @access  Private
 */
router.post('/update', authenticateToken, requireRole('admin'), disclaimerController.updateDisclaimer);

module.exports = router;
