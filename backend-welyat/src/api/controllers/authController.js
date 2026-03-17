const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const logger = require('../../config/logger');

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = [
    // Validation
    body('email').isEmail().withMessage('Email invalide'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Le mot de passe doit contenir au moins 8 caractères'),
    body('role')
        .optional()
        .isIn(['parlant', 'écoutant', 'both'])
        .withMessage('Rôle invalide'),

    // Handler
    async (req, res, next) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Validation failed', details: errors.array() },
                });
            }

            const { email, password, role } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    error: { message: 'Email already registered' },
                });
            }

            // Hash password
            const password_hash = await User.hashPassword(password);

            // Create user
            const user = await User.create({
                email,
                password_hash,
                role: role || 'parlant',
            });

            // Generate token
            const token = generateToken(user);

            logger.info(`New user registered: ${user.email}`);

            res.status(201).json({
                success: true,
                data: {
                    user: user.toJSON(),
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    },
];

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = [
    // Validation
    body('email').isEmail().withMessage('Email invalide'),
    body('password').notEmpty().withMessage('Mot de passe requis'),

    // Handler
    async (req, res, next) => {
        try {
            // Check validation errors
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Validation failed', details: errors.array() },
                });
            }

            const { email, password } = req.body;

            // Find user
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: { message: 'Invalid credentials' },
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: { message: 'Invalid credentials' },
                });
            }

            // Check if user is active
            if (!user.is_active) {
                return res.status(403).json({
                    success: false,
                    error: { message: 'Account is deactivated' },
                });
            }

            // Generate token
            const token = generateToken(user);

            logger.info(`User logged in: ${user.email}`);

            res.status(200).json({
                success: true,
                data: {
                    user: user.toJSON(),
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    },
];

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
const getMe = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: { message: 'User not found' },
            });
        }

        res.status(200).json({
            success: true,
            data: { user: user.toJSON() },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user (client-side token deletion)
 * @access  Private
 */
const logout = async (req, res) => {
    logger.info(`User logged out: ${req.user.email}`);

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

module.exports = {
    register,
    login,
    getMe,
    logout,
};
