const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CallPaymentIntent = sequelize.define(
    'CallPaymentIntent',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        call_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        stripe_payment_intent_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount_cents: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('authorized', 'captured', 'cancelled'),
            defaultValue: 'authorized',
        },
        captured_cents: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        tableName: 'call_payment_intents',
        underscored: true,
        timestamps: true,
    }
);

module.exports = CallPaymentIntent;
