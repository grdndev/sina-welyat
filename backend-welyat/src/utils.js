const jwt = require('jsonwebtoken');

const firstOfMonth = () => {
    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    firstOfMonth.setHours(0, 0, 0, 0);
    return firstOfMonth;
}

/**
 * Generate JWT token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            // used by requireDisclaimer middleware
            disclaimer: !!user.accepted_disclaimer,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

module.exports = {
    firstOfMonth,
    generateToken
}