const { errorHandler, notFound } = require('./middleware/errorHandler');
const { sequelize } = require('./config/database');
const callWorker = require('./workers/CallWorker');
const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const logger = require('./config/logger');
const morganMiddleware = require('./middleware/morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const routes = require('./api/routes');
const twilio = require('./services/TwilioService');
require('./cron');
require('dotenv').config();

// Initialize Express app
const app = express();

// Trust proxy (important for rate limiting behind proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    credentials: true,
};
app.use(cors(corsOptions));

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// HTTP request logging
app.use(morganMiddleware.successHandler);
app.use(morganMiddleware.errorHandler);

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/', routes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

// Server configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Start server
if (process.env.NODE_ENV !== 'test') {
    const server = app.listen(PORT, HOST, async () => {
        logger.info(`🚀 Server started on http://${HOST}:${PORT}`);
        logger.info(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);

        // Start background workers
        callWorker.start();

        // Test database connection
        try {
            await sequelize.authenticate();
            logger.info('✅ PostgreSQL connection established successfully');
        } catch (error) {
            logger.error(`❌ Unable to connect to PostgreSQL: ${error.message}`);
        }
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
        logger.info('SIGTERM signal received: closing HTTP server');
        server.close(async () => {
            logger.info('HTTP server closed');
            callWorker.stop();
            await sequelize.close();
            logger.info('Database connection closed');
            process.exit(0);
        });
    });
}

module.exports = app;
