const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

/**
 * @route   GET /api/v1/admin/cloud/status
 * @desc    Get Cloud XP status
 * @access  Private
 */
router.get('/cloud/status', adminController.cloudStatus);

/**
 * @route   POST /api/v1/admin/cloud/execute
 * @desc    Redistribute XP
 * @access  Private
 */
router.post('/cloud/execute', adminController.execute);

module.exports = router;
