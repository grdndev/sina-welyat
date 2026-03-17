const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Rating = sequelize.define(
    'Rating',
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
        from_user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        to_user_id: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        tableName: 'ratings',
        underscored: true,
        timestamps: true,
    }
);

module.exports = Rating;
