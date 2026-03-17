const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');
const { authenticateToken } = require('../../middleware/auth');

/**
 * @route   POST /api/v1/emergency/trigger
 * @desc    Trigger emergency procedures
 * @access  Private
 */
router.post('/trigger', authenticateToken, emergencyController.triggerEmergency);

module.exports = router;
