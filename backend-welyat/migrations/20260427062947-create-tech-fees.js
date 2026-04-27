'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tech_fees', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM('twilio', 'infra', 'stripe', 'other'),
        allowNull: false,
      },
      amount_cents: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      incurred_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('tech_fees', [
      {
        id: uuidv4(),
        type: 'twilio',
        amount_cents: Number(process.env.TWILIO_COSTS_MONTH || 0) * 100,
        description: 'Initial Twilio costs from env var'
      },
      {
        id: uuidv4(),
        type: 'infra',
        amount_cents: Number(process.env.INFRA_COSTS_MONTH || 0) * 100,
        description: 'Initial Infra costs from env var'
      },
      {
        id: uuidv4(),
        type: 'stripe',
        amount_cents: Number(process.env.STRIPE_FEES_MONTH || 0) * 100,
        description: 'Initial Stripe fees from env var'
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('call_payment_intents');
  }
};
