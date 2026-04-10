const { sequelize } = require('../src/config/database');
const { Transaction, Call, BusinessMode } = require('../src/models');
const { v4: uuidv4 } = require('uuid');
const app = require('../src/server');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const User = require('../src/models/User');
const { firstOfMonth } = require('../src/utils');

describe('Admin API', () => {
    let admin, adminToken, userToken;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        admin = await User.create({
            firstname: 'admin',
            lastname: 'welyat',
            phone: '0000000000',
            email: 'admin@welyat.com',
            password_hash: 'hash',
            role: 'admin'
        });
        adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'test_secret_key');

        user = await User.create({
            firstname: 'user',
            lastname: 'welyat',
            phone: '0000000000',
            email: 'user@welyat.com',
            password_hash: 'hash',
            role: 'both',
            total_xp: 20
        });
        userToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'test_secret_key');

        const businessMode = await BusinessMode.create({
            mode_name: 'BALANCED',
            free_duration_minutes: 0,
            price_per_minute_client: 1,
            earn_per_minute_listener: 1,
            xp_per_minutes: 1
        })

        const call = await Call.create({
            talker_id: admin.id,
            listener_id: user.id,
            business_mode_id: businessMode.id,
            status: 'ended',
            started_at: firstOfMonth(),
            ended_at: firstOfMonth() + 6000,
            duration_paid_seconds: 60
        });

        await Transaction.create({
            user_id: admin.id,
            call_id: call.id,
            type: 'charge',
            amount: 30,
            status: 'completed'
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/v1/admin/cloud/status', () => {
        it('should get cloud status', async () => {
            const res = await request(app).get('/api/v1/admin/cloud/status')
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toStrictEqual({
                total_xp: 20,
                estimated_pool: 30,
                eligible_ratio: 100
            });
        });

        it('should block non admin user', async () => {
            const res = await request(app).get('/api/v1/admin/cloud/status')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/v1/admin/cloud/execute', () => {
        it('should execute', async () => {
            const res = await request(app).post('/api/v1/admin/cloud/execute')
                .send({percentage: 10})
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
        });

        it('should block non admin user', async () => {
            const res = await request(app).post('/api/v1/admin/cloud/execute')
                .send({percentage: 10})
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(401);
        });

        it('should get an error with negative percentage', async () => {
            const res = await request(app).post('/api/v1/admin/cloud/execute')
                .send({percentage: -10})
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(400);
        });

        it('should get an error with over 100 percentage', async () => {
            const res = await request(app).post('/api/v1/admin/cloud/execute')
                .send({percentage: 110})
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(400);
        });
    });

    describe('GET /api/v1/admin/users/:id/promote-founding', () => {
        it('should promote User', async () => {
            expect(user.is_founding).toBe(false);

            const res = await request(app).post(`/api/v1/admin/users/${user.id}/promote-founding`)
                .set('Authorization', `Bearer ${adminToken}`);

            const founding = await User.findByPk(user.id);

            expect(res.statusCode).toBe(200);
            expect(founding.is_founding).toBe(true);
        });

        it('should get an error for already founding user', async () => {
            const founding = await User.findByPk(user.id);
            expect(founding.is_founding).toBe(true);

            const res = await request(app).post(`/api/v1/admin/users/${founding.id}/promote-founding`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(400);
        });

        it('should get an error for unknown user', async () => {
            const res = await request(app).post(`/api/v1/admin/users/${uuidv4()}/promote-founding`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(400);
        });

        it('should allow forcing on already founding user', async () => {
            const founding = await User.findByPk(user.id);
            expect(founding.is_founding).toBe(true);

            const res = await request(app).post(`/api/v1/admin/users/${founding.id}/promote-founding?force=true`)
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);
        });
    });
});
