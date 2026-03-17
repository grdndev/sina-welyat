'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business_modes', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mode_name: {
        type: Sequelize.ENUM('normal', 'corrigé', 'tendu'),
        allowNull: false,
        unique: true,
      },
      free_duration_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Duration of free phase in minutes',
      },
      price_per_minute_client: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Price charged to client per minute (USD)',
      },
      price_per_minute_écoutant: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Payout to listener per minute (USD)',
      },
      xp_per_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'XP awarded per X minutes of free listening',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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

    // Add index
    await queryInterface.addIndex('business_modes', ['is_active']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business_modes');
  },
};
