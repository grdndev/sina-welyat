const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// KPI metrics
router.get('/metrics', adminController.getMetrics);

/**
 * @route   GET /api/v1/admin/business-modes
 * @desc    List all business modes with their config
 * @access  Private (admin)
 */
router.get('/business-modes', adminController.getBusinessModes);

/**
 * @route   POST /api/v1/admin/business-modes/:id/activate
 * @desc    Switch active business mode (Normal / Corrigé / Tendu)
 * @access  Private (admin)
 */
router.post('/business-modes/:id/activate', adminController.activateBusinessMode);

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
router.post('/cloud/execute', adminController.executeRedistribution);

/**
 * @route   POST /api/v1/admin/users/:id/promote-founding
 * @desc    Promote User to founding
 * @access  Private
 */
router.post('/users/:id/promote-founding', adminController.promoteUser);

router.get('/sessions', adminController.getSessions);
router.post('/sessions/:id/refund', adminController.refundSession);

router.get('/analytics', adminController.getAnalytics);

router.get('/users', adminController.getUsers);
router.post('/users/:id/ban', adminController.banUser);
router.post('/users/:id/grant-minutes', adminController.grantMinutes);

router.patch('/business-modes/:id', adminController.updateBusinessMode);

router.get('/fees', adminController.getFees);
router.post('/fees', adminController.updateFees);

module.exports = router;
