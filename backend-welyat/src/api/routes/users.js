const express = require('express');
const usersController = require('../controllers/usersController');
const { requireRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/v1/users/me/xp
 * @desc    Get XP status
 * @access  Private
 */
router.get('/me/xp', requireRole('listener', 'both'), usersController.getXp);


module.exports = router;
