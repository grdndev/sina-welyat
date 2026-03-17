// Test setup file
require('dotenv').config({ path: '.env.test' });

process.env.JWT_SECRET = process.env.JWT_SECRET || 'test_secret_key';
process.env.TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || 'ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '+1234567890';

// Mock external services in tests
jest.mock('twilio', () => {
    return jest.fn().mockImplementation(() => ({
        calls: {
            create: jest.fn().mockResolvedValue({ sid: 'CAxxxxxxxx' }),
            fetch: jest.fn().mockResolvedValue({ sid: 'CAxxxxxxxx', status: 'completed' }),
            update: jest.fn().mockResolvedValue({ sid: 'CAxxxxxxxx' }),
        },
    }));
});

jest.mock('stripe', () => {
    return jest.fn().mockImplementation(() => ({
        customers: {
            create: jest.fn().mockResolvedValue({ id: 'cus_xxxx' }),
            retrieve: jest.fn().mockResolvedValue({ id: 'cus_xxxx' }),
            update: jest.fn().mockResolvedValue({ id: 'cus_xxxx' }),
        },
        paymentMethods: {
            attach: jest.fn().mockResolvedValue({ id: 'pm_xxxx' }),
        },
        paymentIntents: {
            create: jest.fn().mockResolvedValue({ id: 'pi_xxxx', status: 'requires_capture' }),
            capture: jest.fn().mockResolvedValue({ id: 'pi_xxxx', status: 'succeeded' }),
            cancel: jest.fn().mockResolvedValue({ id: 'pi_xxxx' }),
        },
        payouts: {
            create: jest.fn().mockResolvedValue({ id: 'po_xxxx' }),
        },
    }));
});

