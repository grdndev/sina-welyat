const { sequelize } = require('../src/config/database');
const { Call, BusinessMode, Redistribution, RedistributionDetail } = require('../src/models');
const app = require('../src/server');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const User = require('../src/models/User');
const { firstOfMonth } = require('../src/utils');

describe('WELYAT Auth API', () => {
    let admin, userToken;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        admin = await User.create({
            email: 'admin@welyat.com',
            password_hash: 'hash',
            role: 'admin',
            total_xp: 20
        });

        user = await User.create({
            email: 'user@welyat.com',
            password_hash: 'hash',
            role: 'listener',
            total_xp: 20
        });
        userToken = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'test_secret_key');

        const businessMode = await BusinessMode.create({
            mode_name: 'OPEN',
            free_duration_minutes: 0,
            price_per_minute_client: 1,
            price_per_minute_listener: 1,
            xp_per_minutes: 1
        })

        await Call.create({
            talker_id: admin.id,
            listener_id: user.id,
            business_mode_id: businessMode.id,
            status: 'ended',
            started_at: firstOfMonth(),
            ended_at: firstOfMonth() + 6000,
            duration_free_seconds: 360,
            xp_generated: 1
        });

        const redistribution = await Redistribution.create({
            total_margin: 10,
            redistribution_percentage: 100,
            total_xp_distributed: 5,
            amount_per_xp: 2,
            total_amount_redistributed: 10,
            executed_by_admin_id: admin.id
        });

        await RedistributionDetail.create({
            redistribution_id: redistribution.id,
            user_id: user.id,
            xp_converted: 5,
            amount_credited: 10
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/v1/users/me/xp', () => {
        it('should get xp info', async () => {
            const res = await request(app).get('/api/v1/users/me/xp')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.total_xp).toBe(20);
            expect(res.body.recent_gains.length).toBe(1);
            expect(res.body.recent_gains[0].xp).toBe(1);
            expect(res.body.redistribution_history.length).toBe(1);
            expect(res.body.redistribution_history[0].xp_converted).toBe(5);
            expect(res.body.redistribution_history[0].amount_earned).toBe("10");
        });

        it('should block unauthorized user', async () => {
            const res = await request(app).get('/api/v1/users/me/xp');

            expect(res.statusCode).toBe(401);
        });
    });
});
