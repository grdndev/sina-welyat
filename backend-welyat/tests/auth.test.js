const request = require('supertest');
const app = require('../src/server');
const User = require('../src/models/User');
const { sequelize } = require('../src/config/database');

describe('WELYAT Auth API', () => {
    beforeAll(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    describe('POST /api/v1/auth/register', () => {
        it('should register a new user', async () => {
            const res = await request(app).post('/api/v1/auth/register').send({
                email: 'test@welyat.com',
                password: 'password123',
                role: 'talker',
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data.user.email).toBe('test@welyat.com');
            expect(res.body.data.token).toBeDefined();
        });

        it('should not register duplicate email', async () => {
            const res = await request(app).post('/api/v1/auth/register').send({
                email: 'test@welyat.com',
                password: 'password123',
            });

            expect(res.statusCode).toBe(409);
            expect(res.body.success).toBe(false);
        });

        it('should validate email format', async () => {
            const res = await request(app).post('/api/v1/auth/register').send({
                email: 'invalid-email',
                password: 'password123',
            });

            expect(res.statusCode).toBe(400);
        });
    });

    describe('POST /api/v1/auth/login', () => {
        it('should login with valid credentials', async () => {
            const res = await request(app).post('/api/v1/auth/login').send({
                email: 'test@welyat.com',
                password: 'password123',
            });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.token).toBeDefined();
        });

        it('should not login with invalid password', async () => {
            const res = await request(app).post('/api/v1/auth/login').send({
                email: 'test@welyat.com',
                password: 'wrongpassword',
            });

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/v1/auth/me', () => {
        let token;

        beforeAll(async () => {
            const res = await request(app).post('/api/v1/auth/login').send({
                email: 'test@welyat.com',
                password: 'password123',
            });
            token = res.body.data ? res.body.data.token : null;
        });

        it('should get user profile with valid token', async () => {
            if (!token) throw new Error('Login failed in beforeAll');
            const res = await request(app)
                .get('/api/v1/auth/me')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.data.user.email).toBe('test@welyat.com');
        });

        it('should not get profile without token', async () => {
            const res = await request(app).get('/api/v1/auth/me');

            expect(res.statusCode).toBe(401);
        });
    });
});
