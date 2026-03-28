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
            type: DataTypes.STRING,
            allowNull: false
        },
        file_url: {
            type: DataTypes.STRING,
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
