const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Redistribution = sequelize.define(
    'Redistribution',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        executed_at: {
            type: DataTypes.DATE,
            defaultValue: Date.now()
        },
        total_margin: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        redistribution_percentage: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        total_xp_distributed: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount_per_xp: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        total_amount_redistributed: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        executed_by_admin_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        tableName: 'xp_redistributions',
        underscored: true,
        timestamps: true,
    }
);

module.exports = Redistribution;
