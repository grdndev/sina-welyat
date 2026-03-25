const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Reputation = sequelize.define(
    'Reputation',
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
        duration_listened_seconds: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        status: {
            type: DataTypes.ENUM('in_progress', 'completed'),
            defaultValue: 'in_progress',
        },
    },
    {
        tableName: 'ratings',
        underscored: true,
        timestamps: true,
    }
);

module.exports = Reputation;
