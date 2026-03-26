const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Boost = sequelize.define(
    'Boost',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        original_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        boosted_amount: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        margin_at_time: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        executed_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now()
        }
    },
    {
        tableName: 'boosts',
        underscored: true,
        timestamps: true,
    }
);

module.exports = Boost;
