const express = require('express');
const path = require('path');
const { testConnection } = require('../../config/database');
const logger = require('../../config/logger');
const authRoutes = require('./auth');
const adminRoutes = require('./admin');
const disclaimerRoutes = require('./disclaimer');
const callRoutes = require('./calls');
const webhookRoutes = require('./webhooks');
const emergencyRoutes = require('./emergency');
const payoutRoutes = require('./payouts');
const usersRoutes = require('./users');
const { User, Call } = require('../../models');
const { Op } = require('sequelize');
const { requireRole, authenticateToken, requireDisclaimer } = require('../../middleware/auth');

const router = express.Router();

/**
 * @route   GET /
 * @desc    Root endpoint
 * @access  Public
 */
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
});


/**
 * @route   GET /health
 * @desc    Health check endpoint
 * @access  Public
 */
router.get('/health', async (req, res) => {
    try {
        const dbConnected = await testConnection();

        res.status(200).json({
            success: true,
            status: 'OK',
            timestamp: new Date().toISOString(),
            database: dbConnected ? 'connected' : 'disconnected',
        });
    } catch (error) {
        logger.error(`Health check failed: ${error.message}`);
        res.status(503).json({
            success: false,
            status: 'ERROR',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
        });
    }
});

/**
 * @route   GET /api/v1/status
 * @desc    API status endpoint
 * @access  Public
 */
router.get('/api/v1/status', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'WELYAT V0 API is running',
        version: '0.1.0',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
    });
});


router.use('/api/v1/auth', authRoutes);
router.use('/api/v1/webhooks', webhookRoutes);

router.use(authenticateToken);
router.use('/api/v1/admin', requireRole('admin'), adminRoutes);
router.use('/api/v1/disclaimer', disclaimerRoutes);

router.use(requireDisclaimer);
router.use('/api/v1/calls', callRoutes);
router.use('/api/v1/emergency', emergencyRoutes);
router.use('/api/v1/payouts', payoutRoutes);
router.use('/api/v1/users', usersRoutes);

/**
 * @route   GET /api/v1/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Public (for demo purposes)
 */
router.get('/api/v1/dashboard/stats', async (req, res) => {
    try {
        const userCount = await User.count();
        const callCount = await Call.count();
        const activeCalls = await Call.count({
            where: {
                status: { [Op.in]: ['waiting', 'active_free', 'alerted', 'active_paid'] }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                users: userCount,
                calls: callCount,
                activeCalls: activeCalls,
                uptime: process.uptime(),
            }
        });
    } catch (error) {
        logger.error(`Dashboard stats failed: ${error.message}`);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
});

module.exports = router;
