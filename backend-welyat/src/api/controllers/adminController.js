const { body } = require("express-validator");
const logger = require("../../config/logger");
const { Op } = require('sequelize');
const { User, BusinessMode, Call, Transaction } = require("../../models");
const CloudXPService = require("../../services/CloudXPService");

const getSessions = async (req, res, next) => {
    try {
        const { status, limit = 20, offset = 0, from, to } = req.query;
        const where = {};
        if (status) where.status = status;
        if (from || to) {
            where.created_at = {};
            if (from) where.created_at[Op.gte] = new Date(from);
            if (to) where.created_at[Op.lte] = new Date(to);
        }

        const calls = await Call.findAndCountAll({
            where,
            include: [
                { model: User, as: 'talker', attributes: ['id', 'email', 'firstname', 'lastname'] },
                { model: User, as: 'listener', attributes: ['id', 'email', 'firstname', 'lastname'] },
                { model: BusinessMode, attributes: ['mode_name'] },
            ],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            success: true,
            data: calls.rows,
            pagination: { total: calls.count, limit: parseInt(limit), offset: parseInt(offset) },
        });
    } catch (error) {
        logger.error(`Admin sessions error: ${error.message}`);
        next(error);
    }
};

const getAnalytics = async (req, res, next) => {
    try {
        const sequelize = Call.sequelize;
        const now = new Date();
        const thirtyDaysAgo = new Date(now);
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [totalUsers, totalCalls, activeListeners, activeTalkers] = await Promise.all([
            User.count({ where: { role: { [Op.ne]: 'admin' } } }),
            Call.count(),
            User.count({ where: { role: ['listener', 'both'], is_active: true } }),
            User.count({ where: { role: ['talker', 'both'], is_active: true } }),
        ]);

        const callRows = await Call.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
                [sequelize.fn('SUM', sequelize.col('duration_paid_seconds')), 'paid_seconds'],
            ],
            where: { created_at: { [Op.gte]: thirtyDaysAgo } },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
            raw: true,
        });

        const revenueRows = await Transaction.findAll({
            attributes: [
                [sequelize.fn('DATE', sequelize.col('created_at')), 'date'],
                [sequelize.fn('SUM', sequelize.col('amount')), 'revenue'],
            ],
            where: {
                type: 'charge',
                status: 'completed',
                created_at: { [Op.gte]: thirtyDaysAgo },
            },
            group: [sequelize.fn('DATE', sequelize.col('created_at'))],
            order: [[sequelize.fn('DATE', sequelize.col('created_at')), 'ASC']],
            raw: true,
        });

        res.json({
            success: true,
            data: {
                totalUsers,
                totalCalls,
                activeListeners,
                activeTalkers,
                callsPerDay: callRows.map(r => ({
                    date: r.date,
                    count: Number(r.count),
                    paidMinutes: Math.floor(Number(r.paid_seconds || 0) / 60),
                })),
                revenuePerDay: revenueRows.map(r => ({
                    date: r.date,
                    revenue: Number(r.revenue || 0),
                })),
            },
        });
    } catch (error) {
        logger.error(`Admin analytics error: ${error.message}`);
        next(error);
    }
};

const getUsers = async (req, res, next) => {
    try {
        const { search, role, limit = 20, offset = 0 } = req.query;
        const where = {};
        if (role) where.role = role;
        if (search) {
            where[Op.or] = [
                { email: { [Op.iLike]: `%${search}%` } },
                { firstname: { [Op.iLike]: `%${search}%` } },
                { lastname: { [Op.iLike]: `%${search}%` } },
            ];
        }

        const users = await User.findAndCountAll({
            where,
            attributes: ['id', 'email', 'firstname', 'lastname', 'role', 'is_founding', 'founding_end_date', 'is_active', 'total_xp', 'reputation_score', 'created_at'],
            order: [['created_at', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({
            success: true,
            data: users.rows,
            pagination: { total: users.count, limit: parseInt(limit), offset: parseInt(offset) },
        });
    } catch (error) {
        logger.error(`Admin users error: ${error.message}`);
        next(error);
    }
};

const updateBusinessMode = [
    body('free_duration_minutes').optional().isInt({ min: 0 }),
    body('price_per_minute_client').optional().isNumeric(),
    body('earn_per_minute_listener').optional().isNumeric(),
    body('xp_per_minutes').optional().isInt({ min: 0 }),
    body('timeout_matching').optional().isInt({ min: 1 }),
    async (req, res, next) => {
        try {
            const { id } = req.params;
            const mode = await BusinessMode.findByPk(id);
            if (!mode) return res.status(404).json({ success: false, error: { message: 'Business mode not found' } });

            const allowed = ['free_duration_minutes', 'price_per_minute_client', 'earn_per_minute_listener', 'xp_per_minutes', 'timeout_matching'];
            const updates = {};
            for (const f of allowed) {
                if (req.body[f] !== undefined) updates[f] = req.body[f];
            }

            await mode.update(updates);
            logger.info(`Business mode ${mode.mode_name} (id: ${id}) updated by admin ${req.user.id}`);
            res.json({ success: true, data: { mode } });
        } catch (error) {
            logger.error(`Admin update mode error: ${error.message}`);
            next(error);
        }
    },
];

const cloudStatus = async (req, res, next) => {
    try {
        const { total_payout, total_charged } = await CloudXPService.calculateCurrentMargin();
        const eligible_users = await CloudXPService.getEligibleUsers();
        const listeners = await User.count({where: {
            role: ['listener', 'both'],
            is_active: true
        }});
        const total_xp = eligible_users.reduce((sum, u) => sum + u.total_xp, 0);

        res.status(200).json({
            total_xp,
            estimated_pool: total_charged - total_payout,
            eligible_ratio: eligible_users.length / (listeners || 1) * 100
        });
    } catch (error) {
        logger.error(`Admin cloud status error : ${error.message}`);
        next(error);
    }
}

const executeRedistribution = [
    body('percentage').isInt({ min: 1, max: 100 }).withMessage('Percentage should be between 1 and 100'),
    async (req, res, next) => {
        try {
            const percentage = req.body.percentage;

            if (!percentage || percentage < 1 || percentage > 100) {
                return res.status(400).json({
                    success: false,
                    error: { message: "Percentage should be between 1 and 100" }
                });
            }

            await CloudXPService.executeRedistribution(percentage, req.user.id)

            res.status(200).send();
        } catch (error) {
            logger.error(`Admin cloud execute : ${error.message}`);
            next(error);
        }
    }
]

const promoteUser = [
    body('force').optional().isBoolean().withMessage('Force should be a boolean'),
    async (req, res, next) => {
        try {
            const user = await User.findByPk(req.params.id);
            const force = !!req.query.force;

            if (!user) {
                return res.status(400).json({
                    success: false,
                    error: { message: "User not found" }
                });
            }

            if (user.is_founding && !force) {
                return res.status(400).json({
                    success: false,
                    error: { message: "User is already founding. Force it to reset duration."}
                });
            }

            user.is_founding = true;
            user.founding_start_date = new Date();
            user.founding_end_date = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365);
            await user.save();

            return res.status(200).send();
        } catch (error) {
            logger.error(`Admin promote user : ${error.message}`);
        }
    }
]

/**
 * GET /api/v1/admin/business-modes
 * List all business modes
 */
const getBusinessModes = async (req, res, next) => {
    try {
        const modes = await BusinessMode.findAll({ order: [['id', 'ASC']] });
        res.json({ success: true, data: { modes } });
    } catch (err) {
        next(err);
    }
};

/**
 * POST /api/v1/admin/business-modes/:id/activate
 * Activate a specific business mode (deactivates others)
 */
const activateBusinessMode = async (req, res, next) => {
    try {
        const { id } = req.params;
        const mode = await BusinessMode.findByPk(id);
        if (!mode) return res.status(404).json({ success: false, error: { message: 'Business mode not found' } });

        await BusinessMode.update({ is_active: false }, { where: {} });
        await mode.update({ is_active: true });

        logger.info(`Business mode activated: ${mode.mode_name} (id: ${id}) by admin ${req.user.id}`);
        res.json({ success: true, data: { mode } });
    } catch (err) {
        next(err);
    }
};

const startOfDay = (d = new Date()) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
};

const startOfWeek = (d = new Date()) => {
    const x = startOfDay(d);
    const day = x.getDay(); // 0=Sun
    const diff = (day === 0 ? -6 : 1) - day; // Monday as start
    x.setDate(x.getDate() + diff);
    return x;
};

const startOfMonth = (d = new Date()) => {
    const x = startOfDay(d);
    x.setDate(1);
    return x;
};

const sumPaidMinutes = async (from, to = new Date()) => {
    const rows = await Call.findAll({
        attributes: ['duration_paid_seconds'],
        where: {
            created_at: { [Op.gte]: from, [Op.lt]: to },
        },
        raw: true,
    });

    const paidSeconds = rows.reduce((sum, r) => sum + (Number(r.duration_paid_seconds) || 0), 0);
    return Math.floor(paidSeconds / 60);
};

const sumTransactions = async (type, from, to = new Date()) => {
    const rows = await Transaction.findAll({
        attributes: ['amount'],
        where: {
            type,
            status: 'completed',
            created_at: { [Op.gte]: from, [Op.lt]: to },
        },
        raw: true,
    });
    return rows.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
};

/**
 * GET /api/v1/admin/metrics
 * Net profit / paid minute + paid minutes activity
 */
const getMetrics = async (req, res, next) => {
    try {
        const now = new Date();
        const dayStart = startOfDay(now);
        const weekStart = startOfWeek(now);
        const monthStart = startOfMonth(now);

        const [paidMinutesToday, paidMinutesWeek, paidMinutesMonth] = await Promise.all([
            sumPaidMinutes(dayStart, now),
            sumPaidMinutes(weekStart, now),
            sumPaidMinutes(monthStart, now),
        ]);

        // RevenueMonth = total completed charges
        const revenueMonth = await sumTransactions('charge', monthStart, now);

        // CostsMonth (available from DB): payouts + bridge_fee + xp_redistribution
        // External costs (Twilio/Stripe fees/infra) are not tracked in DB yet.
        const payoutsMonth = await sumTransactions('payout', monthStart, now);
        const bridgeFeesMonth = await sumTransactions('bridge_fee', monthStart, now);
        const xpRedistributionMonth = await sumTransactions('xp_redistribution', monthStart, now);

        const twilioCostsMonth = Number(process.env.TWILIO_COSTS_MONTH || 0);
        const stripeFeesMonth = Number(process.env.STRIPE_FEES_MONTH || 0);
        const infraCostsMonth = Number(process.env.INFRA_COSTS_MONTH || 0);

        const costsMonth = payoutsMonth + bridgeFeesMonth + xpRedistributionMonth + twilioCostsMonth + stripeFeesMonth + infraCostsMonth;
        const netProfitMonth = revenueMonth - costsMonth;

        const netProfitPerPaidMinuteMonth = paidMinutesMonth > 0
            ? netProfitMonth / paidMinutesMonth
            : 0;

        res.json({
            success: true,
            data: {
                netProfitPerPaidMinuteMonth,
                paidMinutesToday,
                paidMinutesWeek,
                paidMinutesMonth,
                // expose breakdown for audit/verification
                revenueMonth,
                costsMonth,
                costsBreakdown: {
                    payoutsMonth,
                    bridgeFeesMonth,
                    xpRedistributionMonth,
                    twilioCostsMonth,
                    stripeFeesMonth,
                    infraCostsMonth,
                },
            },
        });
    } catch (error) {
        logger.error(`Admin metrics error : ${error.message}`);
        next(error);
    }
};

module.exports = {
    cloudStatus,
    executeRedistribution,
    promoteUser,
    getBusinessModes,
    activateBusinessMode,
    getMetrics,
    getSessions,
    getAnalytics,
    getUsers,
    updateBusinessMode,
}