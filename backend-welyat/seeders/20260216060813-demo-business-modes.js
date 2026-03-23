'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Supprimer les anciens modes pour repartir sur une base propre
    await queryInterface.bulkDelete('business_modes', null, {});

    await queryInterface.bulkInsert('business_modes', [
      {
        mode_name: 'NORMAL',
        free_duration_minutes: 15,
        price_per_minute_client: 0.33,
        price_per_minute_listener: 0.22,
        xp_per_minutes: 5,
        timeout_matching: 5,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        mode_name: 'SMART',
        free_duration_minutes: 15,
        price_per_minute_client: 0.33,
        price_per_minute_listener: 0.22,
        xp_per_minutes: 5,
        timeout_matching: 8,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        mode_name: 'SHIELD',
        free_duration_minutes: 15,
        price_per_minute_client: 0.33,
        price_per_minute_listener: 0.22,
        xp_per_minutes: 5,
        timeout_matching: 12,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        mode_name: 'CRITICAL',
        free_duration_minutes: 13,
        price_per_minute_client: 0.33,
        price_per_minute_listener: 0.22,
        xp_per_minutes: 5,
        timeout_matching: 25,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('business_modes', null, {});
  },
};
