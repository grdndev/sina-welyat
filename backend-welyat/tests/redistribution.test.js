const app = require('../src/server');
const { sequelize } = require('../src/config/database');
const { User, Redistribution, RedistributionDetail } = require('../src/models');

describe("Create Redistribution", () => {
    let admin, user, redistribution, detail;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        admin = await User.create({
            email: 'admin@welyat.com',
            password_hash: 'hash',
            role: 'both',
        });

        user = await User.create({
            email: 'user@welyat.com',
            password_hash: 'hash',
            role: 'écoutant',
        });

        redistribution = await Redistribution.create({
            total_margin: 10,
            redistribution_percentage: 10,
            total_xp_distributed: 2,
            amount_per_xp: 10,
            total_amount_redistributed: 10,
            executed_by_admin_id: admin.id
        });

        detail = await RedistributionDetail.create({
            redistribution_id: redistribution.id,
            user_id: user.id,
            xp_converted: 2,
            amount_credited: 10
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should have working relations', async () => {
        expect((await admin.getRedistributions()).length).toBe(1);
        expect((await user.getRedistributionDetails()).length).toBe(1);
        expect((await redistribution.getRedistributionDetails()).length).toBe(1);
        expect((await detail.getRedistribution()).id).toBe(redistribution.id);
        expect((await detail.getUser()).id).toBe(user.id);
    })
});