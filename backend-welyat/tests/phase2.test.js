const request = require('supertest');
const { sequelize } = require('../src/config/database');
const { User, Call, BusinessMode } = require('../src/models');
const CallStateMachine = require('../src/services/CallStateMachine');
const MatchingService = require('../src/services/MatchingService');
const { v4: uuidv4 } = require('uuid');

describe('Phase 2 Tests: FSM & Matching', () => {
    let talker, listener, businessMode;

    beforeAll(async () => {
        await sequelize.sync({ force: true });

        // Setup basic data
        businessMode = await BusinessMode.create({
            mode_name: 'NORMAL',
            free_duration_minutes: 15,
            price_per_minute_client: 0.33,
            price_per_minute_listener: 0.22,
            xp_per_minutes: 5,
        });

        talker = await User.create({
            id: uuidv4(),
            email: 'talker_test@sina.com',
            password_hash: 'hash',
            role: 'talker',
            reputation_score: 5.0,
            toxic_flag: false,
            is_active: true
        });

        listener = await User.create({
            id: uuidv4(),
            email: 'listener_test@sina.com',
            password_hash: 'hash',
            role: 'listener',
            reputation_score: 5.0,
            toxic_flag: false,
            is_active: true,
        });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    afterEach(async () => {
        // Clean up calls to ensure listener is free for next test
        await Call.destroy({ where: {} });
    });

    describe('CallStateMachine', () => {
        let call;
        let fsm;

        beforeEach(async () => {
            call = await Call.create({
                talker_id: talker.id,
                listener_id: listener.id,
                business_mode_id: businessMode.id,
                status: 'waiting',
            });
            fsm = new CallStateMachine(call);
        });

        it('should transition from WAITING to ACTIVE_FREE', async () => {
            await fsm.start();
            expect(call.status).toBe('active_free');
            expect(call.started_at).toBeDefined();
        });

        it('should transition from ACTIVE_FREE to ALERTED', async () => {
            await fsm.start();
            await fsm.alert();
            expect(call.status).toBe('alerted');
            expect(call.alerted_at).toBeDefined();
        });

        it('should transition from ALERTED to ACTIVE_PAID', async () => {
            await fsm.start();
            await fsm.alert();
            await fsm.convertToPaid();
            expect(call.status).toBe('active_paid');
            expect(call.became_paid_at).toBeDefined();
        });

        it('should transition from ACTIVE_PAID to ENDED', async () => {
            await fsm.start();
            await fsm.alert();
            await fsm.convertToPaid();
            await fsm.end();
            expect(call.status).toBe('ended');
            expect(call.ended_at).toBeDefined();
        });

        it('should throw error on invalid transition', async () => {
            await fsm.start(); // ACTIVE_FREE
            await expect(fsm.convertToPaid()).rejects.toThrow(); // Cannot go ACTIVE_FREE -> ACTIVE_PAID without ALERTED
        });
    });

    describe('MatchingService', () => {
        it('should find an available listener', async () => {
            const match = await MatchingService.findMatch(talker.id);
            expect(match).toBeDefined();
            expect(match).not.toBeNull();
            expect(match.id).toBe(listener.id);
        });

        it('should not find a listener if they are busy (in call)', async () => {
            // Create an active call for the listener
            await Call.create({
                talker_id: talker.id,
                listener_id: listener.id, // listener is busy
                business_mode_id: businessMode.id,
                status: 'active_free',
            });

            const match = await MatchingService.findMatch(talker.id);
            expect(match).toBeNull();
        });

        it('should filter out toxic listeners', async () => {
            const toxicEcoutant = await User.create({
                id: uuidv4(),
                email: 'toxic@sina.com',
                password_hash: 'hash',
                role: 'listener',
                toxic_flag: true,
            });

            // Ensure normal listener is busy so we only look for toxic one
            await Call.create({
                talker_id: talker.id,
                listener_id: listener.id,
                business_mode_id: businessMode.id,
                status: 'active_free',
            });

            const match = await MatchingService.findMatch(talker.id);
            expect(match).toBeNull(); // good listener is busy, toxic is ignored -> null

            // Cleanup toxic user
            await toxicEcoutant.destroy();
        });
    });
});
