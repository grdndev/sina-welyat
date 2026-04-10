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
        type: Sequelize.ENUM('BALANCED', 'OPTIMIZATION', 'PROTECTION'),
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
      earn_per_minute_listener: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
        comment: 'Payout to listener per minute (USD)',
      },
      xp_per_minutes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1 XP awarded per X minutes of free listening',
      },
      timeout_matching: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 5,
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
      }
    });

    // Add index
    await queryInterface.addIndex('business_modes', ['is_active']);

    await queryInterface.bulkInsert('business_modes', [
      {
        mode_name: 'BALANCED',
        free_duration_minutes: 15,
        price_per_minute_client: 0.33,
        earn_per_minute_listener: 0.22,
        xp_per_minutes: 5,
        timeout_matching: 5,
        is_active: true,
      },
      {
        mode_name: 'OPTIMIZATION',
        free_duration_minutes: 15,
        price_per_minute_client: 0.35,
        earn_per_minute_listener: 0.21,
        xp_per_minutes: 5,
        timeout_matching: 8,
        is_active: true,
      },
      {
        mode_name: 'PROTECTION',
        free_duration_minutes: 13,
        price_per_minute_client: 0.36,
        earn_per_minute_listener: 0.20,
        xp_per_minutes: 5,
        timeout_matching: 12,
        is_active: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business_modes');
  },
};
