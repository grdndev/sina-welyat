const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const RedistributionDetail = sequelize.define(
    'RedistributionDetail',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        redistribution_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: true,
        },
        xp_converted: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        amount_credited: {
            type: DataTypes.DECIMAL,
            allowNull: false
        }
    },
    {
        tableName: 'redistribution_details',
        underscored: true,
        timestamps: true,
    }
);

module.exports = RedistributionDetail;
