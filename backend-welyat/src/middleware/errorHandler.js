const logger = require('../config/logger');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    logger.error(`Stack: ${err.stack}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        error: {
            message,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
};

/**
 * 404 Not Found middleware
 */
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

module.exports = { errorHandler, notFound };
