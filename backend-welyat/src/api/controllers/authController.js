const User = require('../../models/User');
const { body, validationResult } = require('express-validator');
const logger = require('../../config/logger');
const { generateToken } = require('../../utils');
const { Op } = require('sequelize');
const StripeService = require('../../services/StripeService');

const stripeService = new StripeService();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
const register = [
    // Validation
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters'),
    body('email')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail()
        .withMessage('Invalid email address'),
    body('role')
        .optional()
        .isIn(['talker', 'listener', 'both'])
        .withMessage('Invalid role'),

    // Handler
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Validation failed', details: errors.array() },
                });
            }

            const { password, email, role, firstname, lastname, age, gender } = req.body;
            const phone = req.body.phone?.replace(/\s+/g, '');

            // Check if phone already registered
            const existingPhone = await User.findOne({ where: { phone } });
            if (existingPhone) {
                return res.status(409).json({
                    success: false,
                    error: { message: 'Phone number already registered' },
                });
            }

            // Check if email already registered (only if provided)
            if (email) {
                const existingEmail = await User.findOne({ where: { email } });
                if (existingEmail) {
                    return res.status(409).json({
                        success: false,
                        error: { message: 'Email already registered' },
                    });
                }
            }

            const password_hash = await User.hashPassword(password);

            const user = await User.create({
                phone,
                email: email || null,
                password_hash,
                role: role || 'talker',
                firstname: firstname || null,
                lastname: lastname || null,
                birthdate: age ? new Date(Date.now() - age * 365.25 * 24 * 60 * 60 * 1000) : null,
                gender: gender || null,
                is_active: role === 'listener' ? false : true, // listeners need admin validation
            });

            if (role === 'talker' || role === 'both') {
                try {
                    const customer = await stripeService.createCustomer(user.id, email || null);
                    await user.update({ stripe_customer_id: customer.id });
                } catch (stripeError) {
                    logger.error(`Failed to create Stripe customer for user ${user.id}: ${stripeError.message}`);
                }
            }

            const token = generateToken(user);

            logger.info(`New user registered: ${user.phone} (${user.role})`);

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
 * @desc    Login user by phone number
 * @access  Public
 */
const login = [
    // Validation
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').notEmpty().withMessage('Password is required'),

    // Handler
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    error: { message: 'Validation failed', details: errors.array() },
                });
            }

            const { password } = req.body;
            const phone = req.body.phone?.replace(/\s+/g, '');

            const user = await User.findOne({ where: { phone } });
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: { message: 'Invalid credentials' },
                });
            }

            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: { message: 'Invalid credentials' },
                });
            }

            const isListener = user.role === 'listener' || user.role === 'both';
            if (!user.is_active && !isListener) {
                return res.status(403).json({
                    success: false,
                    error: { message: 'Account is deactivated' },
                });
            }

            const token = generateToken(user);

            logger.info(`User logged in: ${user.phone}`);

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
    logger.info(`User logged out: ${req.user.phone}`);

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

/**
 * @route   GET /api/v1/auth/magic/:token
 * @desc    Authenticate via magic link token
 * @access  Public
 */
const verifyMagicLink = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            where: {
                magic_link_token: token,
                magic_link_expires_at: { [Op.gt]: new Date() },
            },
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: { message: 'Invalid or expired magic link' },
            });
        }

        await user.update({ magic_link_token: null, magic_link_expires_at: null });

        const jwt = generateToken(user);

        logger.info(`User authenticated via magic link: ${user.phone}`);

        res.status(200).json({
            success: true,
            data: { user: user.toJSON(), token: jwt },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    login,
    getMe,
    logout,
    verifyMagicLink,
};
