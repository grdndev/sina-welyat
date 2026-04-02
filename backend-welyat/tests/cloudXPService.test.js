const app = require('../src/server');
const { sequelize } = require('../src/config/database');
const { User, Redistribution, RedistributionDetail, BusinessMode, Transaction, Call } = require('../src/models');
const { firstOfMonth } = require('../src/utils');
const CloudXPService = require('../src/services/CloudXPService');

describe("Create Redistribution", () => {
    let admin, users, calls;

    beforeEach(async () => {
        await sequelize.sync({ force: true });
        users = {};
        calls = {};
        admin = await User.create({
            firstname: 'admin',
            lastname: 'welyat',
            phone: '0000000000',
            email: 'admin@welyat.com',
            password_hash: 'hash',
            role: 'admin'
        });

        users.listener = await User.create({
            firstname: 'listener',
            lastname: 'welyat',
            phone: '0000000000',
            email: 'listener@welyat.com',
            password_hash: 'hash',
            role: 'listener',
            total_xp: 30
        });

        users.both = await User.create({
            firstname: 'both',
            lastname: 'welyat',
            phone: '0000000000',
            email: 'both@welyat.com',
            password_hash: 'hash',
            role: 'both',
            total_xp: 10
        });

        talker = await User.create({
            firstname: 'talker',
            lastname: 'welyat',
            phone: '0000000000',
            email: 'talker@welyat.com',
            password_hash: 'hash',
            role: 'talker'
        });

        const businessMode = await BusinessMode.create({
            mode_name: 'NORMAL',
            free_duration_minutes: 0,
            price_per_minute_client: 1,
            price_per_minute_listener: 1,
            xp_per_minutes: 1
        })

        for (const type in users) {
            calls[type] = await Call.create({
                talker_id: talker.id,
                listener_id: users[type].id,
                business_mode_id: businessMode.id,
                status: 'ended',
                started_at: firstOfMonth(),
                ended_at: firstOfMonth() + 6000,
                duration_paid_seconds: 60
            });

            await Transaction.create({
                user_id: users[type].id,
                call_id: calls[type].id,
                type: 'charge',
                amount: 20,
                status: 'completed'
            });
        }
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should calculate margins', async () => {
        const {total_payout, total_charged, total_margin} = await CloudXPService.calculateCurrentMargin();

        expect(total_payout).toBe(0);
        expect(total_charged).toBe(40);
        expect(total_margin).toBe(100);
    })

    it('should redistribute 100%', async () => {
        expect(await User.sum('balance')).toBe(0);

        await CloudXPService.executeRedistribution(100, admin.id);
        const total_xp = await User.sum('total_xp');
        const total_amount_redistributed = await Redistribution.sum('total_amount_redistributed');
        const listener = await RedistributionDetail.findOne({ where: {user_id: users.listener.id}})
        const both = await RedistributionDetail.findOne({ where: {user_id: users.both.id}})

        expect(await User.sum('balance')).toBe(40);
        expect(total_xp).toBe(0);
        expect(total_amount_redistributed).toBe(40);
        expect(listener.amount_credited).toBe("30");
        expect(listener.xp_converted).toBe(30);
        expect(both.amount_credited).toBe("10");
        expect(both.xp_converted).toBe(10);
    })

    it('should redistribute 50%', async () => {
        expect(await User.sum('balance')).toBe(0);

        await CloudXPService.executeRedistribution(50, admin.id);
        const total_xp = await User.sum('total_xp');
        const total_amount_redistributed = await Redistribution.sum('total_amount_redistributed');
        const listener = await RedistributionDetail.findOne({ where: {user_id: users.listener.id}})
        const both = await RedistributionDetail.findOne({ where: {user_id: users.both.id}})

        expect(await User.sum('balance')).toBe(20);
        expect(total_xp).toBe(0);
        expect(total_amount_redistributed).toBe(20);
        expect(listener.amount_credited).toBe("15");
        expect(listener.xp_converted).toBe(30);
        expect(both.amount_credited).toBe("5");
        expect(both.xp_converted).toBe(10);
    })

    it('should not redistribute XP', async () => {
        let error;
        expect(await User.sum('balance')).toBe(0);

        await Transaction.create({
            user_id: users.listener.id,
            call_id: calls.listener.id,
            type: 'payout',
            amount: 30,
            status: 'completed'
        });

        try {
            await CloudXPService.executeRedistribution(100, admin.id);
        } catch (e) {
            error = e;
        }

        const redistribution = await Redistribution.count();
        const redistributionDetails = await RedistributionDetail.count();

        expect(await User.sum('balance')).toBe(0);
        expect(error.message).toBe("Platform health is too low.");
        expect(users.listener.total_xp + users.both.total_xp).toBe(40);
        expect(redistribution).toBe(0);
        expect(redistributionDetails).toBe(0);
    })
});