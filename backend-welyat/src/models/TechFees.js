const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TechFees = sequelize.define(
    'TechFees',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: DataTypes.ENUM('twilio', 'infra', 'stripe'),
        allowNull: false,
      },
      amount_cents: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      incurred_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
        tableName: 'tech_fees',
        underscored: true,
        timestamps: true,
    }
);

module.exports = TechFees;
