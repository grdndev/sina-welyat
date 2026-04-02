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
        accepted_at: {
            type: DataTypes.DATE,
            defaultValue: Date.now()
        }
    },
    {
        tableName: 'disclaimer_accepteds',
        underscored: true,
        timestamps: true,
    }
);

module.exports = DisclaimerAccepted;
