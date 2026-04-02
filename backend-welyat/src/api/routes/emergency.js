const express = require('express');
const router = express.Router();
const emergencyController = require('../controllers/emergencyController');

/**
 * @route   POST /api/v1/emergency/911
 * @desc    Signal emergency, return useful resources
 * @access  Private
 */
router.post('/911', emergencyController.triggerEmergency);

module.exports = router;
