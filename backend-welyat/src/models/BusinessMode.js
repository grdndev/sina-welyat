const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const BusinessMode = sequelize.define(
    'BusinessMode',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        mode_name: {
            type: DataTypes.ENUM('OPEN', 'SMART', 'SHIELD', 'CRITICAL'),
            allowNull: false,
        },
        free_duration_minutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price_per_minute_client: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        price_per_minute_écoutant: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        xp_per_minutes: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        timeout_matching: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        tableName: 'business_modes',
        underscored: true,
        timestamps: true,
    }
);

module.exports = BusinessMode;
