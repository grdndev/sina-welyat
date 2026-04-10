const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const Subscription = sequelize.define(
    'Subscription',
    {
        id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      free_minutes_per_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fast_track_matching: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      priority_matching: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gender_filter: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      age_filter: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      price_per_month: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    {
        tableName: 'subscriptions',
        underscored: true,
        timestamps: true,
    }
);

module.exports = Subscription;
