const logger = require("../../config/logger");
const { User } = require("../../models");
const DisclaimerAccepted = require("../../models/DisclaimerAccepted");
const DisclaimerVersion = require("../../models/DisclaimerVersion");
const { generateToken } = require("../../utils");

/**
 * Return disclaimer file URL
 */
const getDisclaimer = async (req, res, next) => {
    try {
        const disclaimer = await DisclaimerVersion.findOne({ order: [['created_at', 'DESC']] });

        if (!disclaimer) {
            return res.status(404).json({
                success: false,
                error: { message: "No disclaimer found" }
            });
        }

        res.status(200).json({
            data: { disclaimer: disclaimer.file_url }
        });
    } catch (error) {
        logger.error(`get disclaimer error : ${error.message}`);
        next(error);
    }
}

/**
 * Accept disclaimer and return new JWT
 */
const acceptDisclaimer = async (req, res, next) => {
    try {
        const disclaimer = await DisclaimerVersion.findOne({ order: [['created_at', 'DESC']] });
        const user = await User.findByPk(req.user.id)

        await DisclaimerAccepted.findOrCreate({
            where: {
                user_id: req.user.id,
                disclaimer_version_id: disclaimer.id,
            }
        });

        user.accepted_disclaimer = true;
        await user.save()

        const token = generateToken(user);

        logger.info(`New user registered: ${user.email}`);

        res.status(201).json({
            success: true,
            data: {
                token,
            },
        });
    } catch (error) {
        logger.error(`accept disclaimer error : ${error.message}`);
        next(error);
    }
}

/**
 * Reset disclaimer OR upload new ?
 */
const updateDisclaimer = async (req, res, next) => {
    try {
        await User.update({
            accepted_disclaimer: false
        });

        res.status(200).send();
    } catch (error) {
        logger.error(`accept disclaimer error : ${error.message}`);
        next(error);
    }
}

module.exports = {
    getDisclaimer,
    acceptDisclaimer,
    updateDisclaimer,
}