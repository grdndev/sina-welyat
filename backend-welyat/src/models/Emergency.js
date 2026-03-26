const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Emergency = sequelize.define(
    'Emergency',
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
        call_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        ip_address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        reported_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Date.now()
        }
    },
    {
        tableName: 'emergencies',
        underscored: true,
        timestamps: true,
    }
);

module.exports = Emergency;
