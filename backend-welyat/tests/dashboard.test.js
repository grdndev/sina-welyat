const request = require('supertest');
const app = require('../src/server');
const { sequelize } = require('../src/config/database');
const { User, Call, BusinessMode } = require('../src/models');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

describe('WELYAT Call Dashboard API', () => {
    let parlant, ecoutant, token, businessMode, activeCall, pastCall;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Setup data
        businessMode = await BusinessMode.create({
            mode_name: 'OPEN',
            free_duration_minutes: 15,
            price_per_minute_client: 0.33,
            price_per_minute_écoutant: 0.22,
            xp_per_minutes: 5,
            timeout_matching: 5
        });

        parlant = await User.create({
            id: uuidv4(),
            email: 'parlant@welyat.com',
            password_hash: 'hash',
            role: 'parlant'
        });

        ecoutant = await User.create({
            id: uuidv4(),
            email: 'ecoutant@welyat.com',
            password_hash: 'hash',
            role: 'écoutant'
        });

        token = jwt.sign({ id: parlant.id, email: parlant.email }, process.env.JWT_SECRET || 'test_secret_key');

        // Create calls
        activeCall = await Call.create({
            parlant_id: parlant.id,
            écoutant_id: ecoutant.id,
            business_mode_id: businessMode.id,
            status: 'active_free',
            started_at: new Date()
        });

        pastCall = await Call.create({
            parlant_id: parlant.id,
            écoutant_id: ecoutant.id,
            business_mode_id: businessMode.id,
            status: 'ended',
            started_at: new Date(Date.now() - 3600000),
            ended_at: new Date(Date.now() - 3000000)
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/v1/calls/my-calls', () => {
        it('should return call history', async () => {
            const res = await request(app)
                .get('/api/v1/calls/my-calls')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.length).toBe(2);
        });
    });

    describe('GET /api/v1/calls/active', () => {
        it('should return the currently active call', async () => {
            const res = await request(app)
                .get('/api/v1/calls/active')
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe(activeCall.id);
            expect(res.body.data.status).toBe('active_free');
        });
    });

    describe('GET /api/v1/calls/:id', () => {
        it('should return call details', async () => {
            const res = await request(app)
                .get(`/api/v1/calls/${activeCall.id}`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.id).toBe(activeCall.id);
            expect(res.body.data.parlant.email).toBe(parlant.email);
        });

        it('should not allow unauthorized users to see call details', async () => {
            const otherUser = await User.create({ id: uuidv4(), email: 'other@welyat.com', password_hash: 'hash', role: 'parlant' });
            const otherToken = jwt.sign({ id: otherUser.id, email: otherUser.email }, process.env.JWT_SECRET || 'test_secret_key');

            const res = await request(app)
                .get(`/api/v1/calls/${activeCall.id}`)
                .set('Authorization', `Bearer ${otherToken}`);

            expect(res.status).toBe(403);
        });
    });

    describe('POST /api/v1/calls/:id/end', () => {
        it('should manually end an active call', async () => {
            const res = await request(app)
                .post(`/api/v1/calls/${activeCall.id}/end`)
                .set('Authorization', `Bearer ${token}`);

            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);

            const updatedCall = await Call.findByPk(activeCall.id);
            expect(updatedCall.status).toBe('ended');
            expect(updatedCall.ended_at).toBeDefined();
        });
    });
});
