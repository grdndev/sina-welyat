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
            data: { disclaimer: disclaimer.content }
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
        const { version } = req.body;
        const disclaimer = await DisclaimerVersion.findOne({ where: { version }});
        const latest = await DisclaimerVersion.findOne({ order: [['created_at', 'DESC']] });
        const user = await User.findByPk(req.user.id)

        if (!user || !disclaimer) {
            return res.status(400).json({
                success: false,
                error: { message: "Invalid request" }
            });
        }

        if (disclaimer.id !== latest.id) {
            return res.status(400).json({
                success: false,
                error: { message: "Disclaimer version is outdated" }
            });
        }

        await DisclaimerAccepted.findOrCreate({
            where: {
                user_id: req.user.id,
                disclaimer_version_id: disclaimer.id
            }
        });

        user.accepted_disclaimer = true;
        await user.save()

        const token = generateToken(user);

        logger.info(`User ${user.email} accepted disclaimer version ${version}`);

        res.status(200).json({
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
 * Upload new disclaimer version and invalidate all previous acceptances
 */
const updateDisclaimer = async (req, res, next) => {
    try {
        const { version, content } = req.body;

        if (!version || !content) {
            return res.status(400).json({
                success: false,
                error: { message: "Version and content are required" }
            });
        }

        await DisclaimerVersion.create({ version, content });

        await User.update({
            accepted_disclaimer: false
        }, {
            where: { accepted_disclaimer: true }
        });

        res.status(200).send();
    } catch (error) {
        logger.error(`update disclaimer error : ${error.message}`);
        next(error);
    }
}

module.exports = {
    getDisclaimer,
    acceptDisclaimer,
    updateDisclaimer,
}