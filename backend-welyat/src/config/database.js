const { Sequelize } = require('sequelize');
require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const config = require('../../config/config')[env];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        port: config.port,
        dialect: config.dialect,
        logging: config.logging,
        pool: config.pool,
        dialectOptions: config.dialectOptions || {},
    }
);

// Test database connection
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connection established successfully.');
        return true;
    } catch (error) {
        console.error('❌ Unable to connect to PostgreSQL:', error.message);
        return false;
    }
};

module.exports = { sequelize, testConnection };
