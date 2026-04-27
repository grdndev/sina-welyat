const { BusinessMode, TechFees } = require('../../models');

const FEE_TYPES = ['twilio', 'infra', 'stripe'];

const getInfos = async (req, res) => {
    try {
        const mode = await BusinessMode.findOne({ where: { is_active: true } });
        if (!mode) {
            return res.status(404).json({ error: 'No active business mode found' });
        }


        const fees = await TechFees.findAll();
        const total_tech_fees = fees
            .filter(Boolean)
            .reduce((sum, f) => sum + f.amount_cents / 100, 0);

        res.status(200).json({ mode, total_tech_fees });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getInfos,
};
