const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Call = sequelize.define(
    'Call',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        parlant_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        écoutant_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        business_mode_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('waiting', 'active_free', 'alerted', 'active_paid', 'ended', 'cancelled'),
            defaultValue: 'waiting',
        },
        twilio_call_sid: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        started_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        alerted_at: {
            type: DataTypes.DATE, // T=13 min
            allowNull: true,
        },
        became_paid_at: {
            type: DataTypes.DATE, // T > 15 min + # pressed
            allowNull: true,
        },
        ended_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        duration_free_seconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        duration_paid_seconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        total_cost_client: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
        },
        total_payout_écoutant: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
        },
        xp_generated: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        bridge_fee_1_charged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        bridge_fee_2_charged: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dtmf_pressed: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: 'calls',
        underscored: true,
        timestamps: true,
    }
);

module.exports = Call;
