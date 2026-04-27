const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const DisclaimerVersion = sequelize.define(
    'DisclaimerVersion',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    },
    {
        tableName: 'disclaimer_versions',
        underscored: true,
        timestamps: true,
    }
);

module.exports = DisclaimerVersion;
