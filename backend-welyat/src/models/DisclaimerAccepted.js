const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DisclaimerAccepted = sequelize.define(
    'DisclaimerAccepted',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        disclaimer_version_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        detail: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    },
    {
        tableName: 'disclaimer_accepteds',
        underscored: true,
        timestamps: true,
    }
);

module.exports = DisclaimerAccepted;
