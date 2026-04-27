'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('subscriptions', 'free_minutes_per_month', 'free_seconds_per_month');
    await queryInterface.sequelize.query(
      `UPDATE subscriptions SET free_seconds_per_month = free_seconds_per_month * 60`
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      `UPDATE subscriptions SET free_seconds_per_month = free_seconds_per_month / 60`
    );
    await queryInterface.renameColumn('subscriptions', 'free_seconds_per_month', 'free_minutes_per_month');
  },
};
