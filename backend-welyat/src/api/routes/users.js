const express = require('express');
const usersController = require('../controllers/userController');
const { requireRole } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/v1/users/me/reputation
 * @desc    Get XP status
 * @access  Private
 */
router.get('/me/reputation', usersController.getReputation);

/**
 * @route   GET /api/v1/users/me/xp
 * @desc    Get XP status
 * @access  Private
 */
router.get('/me/xp', requireRole('listener', 'both'), usersController.getXp);

/**
 * @route   GET /api/v1/users/me/data
 * @desc    Get user data
 * @access  Private
 */
router.get('/me/data', usersController.getData);

/**
 * @route   DELETE /api/v1/users/me
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/me', usersController.deleteUser);


module.exports = router;
