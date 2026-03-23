const { User, Transaction } = require('../../models');
const logger = require('../../config/logger');
const StripeService = require('../../services/StripeService');

/**
 * @route   POST /api/v1/payouts/request
 * @desc    Request an external payout to Stripe bank account
 * @access  Private
 */
const requestExternalPayout = async (req, res, next) => {
    try {
        const { id: userId } = req.user;
        const user = await User.findByPk(userId);

        if (!user || (user.role !== 'listener' && user.role !== 'both')) {
            return res.status(403).json({ success: false, message: 'Only listeners can request payouts' });
        }

        const threshold = parseFloat(process.env.EXTERNAL_PAYOUT_THRESHOLD) || 10.00;
        const balance = parseFloat(user.balance);

        // Rule 7: External payout authorized only if balance >= 10 USD
        if (balance < threshold) {
            return res.status(400).json({
                success: false,
                message: `Minimum payout threshold is ${threshold} USD. Your current balance is ${balance.toFixed(2)} USD.`
            });
        }

        // Logic for external payout (Stripe Payout)
        // In V0, we assume the user has a connected account or we pay to a registered card
        // logger.info(`WELYAT: Processing external payout for user ${userId} of ${balance} USD`);

        // Placeholder for real Stripe Payout call
        // const payoutResult = await StripeService.createPayout(balance, 'destination_account_id');

        // Update balance
        const amountToPay = balance;
        user.balance = 0.00;
        await user.save();

        // Record transaction
        await Transaction.create({
            user_id: userId,
            type: 'payout',
            amount: amountToPay,
            status: 'completed',
            description: 'External Payout (WELYAT V0)'
        });

        res.status(200).json({
            success: true,
            message: `Payout of ${amountToPay.toFixed(2)} USD requested successfully.`,
            data: { amount: amountToPay }
        });

    } catch (error) {
        logger.error(`Error in requestExternalPayout: ${error.message}`);
        next(error);
    }
};

module.exports = {
    requestExternalPayout
};
