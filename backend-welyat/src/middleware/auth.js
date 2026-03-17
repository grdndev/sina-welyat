const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

/**
 * Middleware to verify JWT token
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({
            success: false,
            error: { message: 'Access token required' },
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            logger.warn(`Invalid token attempt: ${err.message}`);
            return res.status(403).json({
                success: false,
                error: { message: 'Invalid or expired token' },
            });
        }

        req.user = user;
        next();
    });
};

/**
 * Middleware to check if user has specific role
 */
const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Authentication required' },
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: { message: 'Insufficient permissions' },
            });
        }

        next();
    };
};

module.exports = { authenticateToken, requireRole };
