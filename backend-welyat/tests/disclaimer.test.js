const { sequelize } = require('../src/config/database');
const { v4: uuidv4 } = require('uuid');
const app = require('../src/server');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const User = require('../src/models/User');
const { DisclaimerVersion } = require('../src/models');

describe('Admin API', () => {
    let admin, adminToken, disclaimer, userToken;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        admin = await User.create({
            email: 'admin@welyat.com',
            password_hash: 'hash',
            role: 'admin'
        });
        adminToken = jwt.sign({ id: admin.id, email: admin.email, role: admin.role }, process.env.JWT_SECRET || 'test_secret_key');

        user = await User.create({
            email: 'user@welyat.com',
            password_hash: 'hash',
            role: 'both',
            total_xp: 20
        });
        userToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'test_secret_key');

        await DisclaimerVersion.create({
            content: "Test disclaimer content",
            version: "0.1"
        });

        disclaimer = await DisclaimerVersion.create({
            content: "Test disclaimer content",
            version: "1.0"
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('GET /api/v1/disclaimer/', () => {
        it('should get disclaimer', async () => {
            const res = await request(app).get('/api/v1/disclaimer/')
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.disclaimer).toBe(disclaimer.content);
        });

        it('should block visitor', async () => {
            const res = await request(app).get('/api/v1/disclaimer/')

            expect(res.statusCode).toBe(401);
        });
    });

    describe('POST /api/v1/disclaimer/accept', () => {
        it('should block visitor', async () => {
            const res = await request(app).post('/api/v1/disclaimer/accept')
                .send({version: disclaimer.version});

            expect(res.statusCode).toBe(401);
        });

        it('should block accepting wrong version', async () => {
            const res = await request(app).post('/api/v1/disclaimer/accept')
                .send({version: "0.0"})
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(400);
            const updatedUser = await User.findByPk(user.id);
            expect(updatedUser.accepted_disclaimer).toBe(false);
        });

        it('should block accepting old version', async () => {
            const res = await request(app).post('/api/v1/disclaimer/accept')
                .send({version: "0.1"})
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(400);
            const updatedUser = await User.findByPk(user.id);
            expect(updatedUser.accepted_disclaimer).toBe(false);
        });

        it('should accept disclaimer', async () => {
            const res = await request(app).post('/api/v1/disclaimer/accept')
                .send({version: disclaimer.version})
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(200);

            const updatedUser = await User.findByPk(user.id);
            expect(updatedUser.accepted_disclaimer).toBe(true);
        });
    });

    describe('POST /api/v1/disclaimer/update', () => {
        it('should block visitor', async () => {
            const res = await request(app).post('/api/v1/disclaimer/update')
                .send({version: "2.0", content: "Updated disclaimer content"})

            expect(res.statusCode).toBe(401);
        });

        it('should block normal user', async () => {
            const res = await request(app).post('/api/v1/disclaimer/update')
                .send({version: "2.0", content: "Updated disclaimer content"})
                .set('Authorization', `Bearer ${userToken}`);

            expect(res.statusCode).toBe(401);
        });

        it('should block updating previous version', async () => {
            const res = await request(app).post('/api/v1/disclaimer/update')
                .send({version: "1.0", content: "Updated disclaimer content"})
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(500);
        });

        it('should update disclaimer', async () => {
            const res = await request(app).post('/api/v1/disclaimer/update')
                .send({version: "2.0", content: "Updated disclaimer content"})
                .set('Authorization', `Bearer ${adminToken}`);

            expect(res.statusCode).toBe(200);

            const latest = await request(app).get('/api/v1/disclaimer/')
                .set('Authorization', `Bearer ${userToken}`);

            expect(latest.statusCode).toBe(200);
            expect(latest.body.data.disclaimer).toBe("Updated disclaimer content");

            const updatedUser = await User.findByPk(user.id);
            expect(updatedUser.accepted_disclaimer).toBe(false);
        });
    });
});
