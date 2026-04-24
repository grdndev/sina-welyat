const { requireRole, authenticateToken, requireDisclaimer } = require('../../middleware/auth');
const adminRoutes = require('./admin');
const authRoutes = require('./auth');
const callRoutes = require('./calls');
const disclaimerRoutes = require('./disclaimer');
const emergencyRoutes = require('./emergency');
const express = require('express');
const rateLimit = require('express-rate-limit');
const payoutRoutes = require('./payouts');
const subscriptionRoutes = require('./subscriptions');
const listenerRoutes = require('./listeners');
const usersRoutes = require('./users');
const webhookRoutes = require('./webhooks');

const highLimit = rateLimit({
    legacyHeaders: false,
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: 'Too many requests from this IP'
});

const lowLimit = rateLimit({
    legacyHeaders: false,
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: 'Too many requests from this IP'
});

const router = express.Router();

router.use('/api/v1/auth', lowLimit, authRoutes);
router.use('/api/v1/webhooks', webhookRoutes);

router.use(authenticateToken);
router.use('/api/v1/admin', requireRole('admin'), adminRoutes);
router.use('/api/v1/disclaimer', disclaimerRoutes);

router.use('/api/v1/listeners', listenerRoutes);

router.use(requireDisclaimer);
router.use('/api/v1/calls', callRoutes);
router.use('/api/v1/emergency', emergencyRoutes);
router.use('/api/v1/payouts', payoutRoutes);
router.use('/api/v1/subscriptions', subscriptionRoutes);
router.use('/api/v1/users', usersRoutes);

module.exports = router;
