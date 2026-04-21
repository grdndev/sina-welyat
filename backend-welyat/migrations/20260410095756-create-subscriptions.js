'use strict';

const { v4: uuidv4 } = require('uuid');
const { stripe } = require("../src/services/StripeService");

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      free_minutes_per_month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      fast_track_matching: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      priority_matching: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      gender_filter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      age_filter: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      price_per_month: {
        type: Sequelize.DECIMAL,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.createTable('user_subscriptions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      subscription_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'subscriptions',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      stripe_subscription_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      subscribed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('user_subscriptions', ['user_id']);

    // Seed subscription tiers
    const now = new Date();
    await queryInterface.bulkInsert('subscriptions', [
      {
        id: uuidv4(), 
        name: 'Essential',
        free_minutes_per_month: 300,
        gender_filter: true,
        age_filter: false,
        fast_track_matching: true,
        priority_matching: false,
        price_per_month: 9.99,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Comfort',
        free_minutes_per_month: 720,
        gender_filter: true,
        age_filter: true,
        fast_track_matching: true,
        priority_matching: false,
        price_per_month: 19.99,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Elite',
        free_minutes_per_month: 2400,
        gender_filter: true,
        age_filter: true,
        fast_track_matching: true,
        priority_matching: true,
        price_per_month: 49.99,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('user_subscriptions');
    await queryInterface.dropTable('subscriptions');
  },
};
