'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_transactions_type" ADD VALUE IF NOT EXISTS 'refund'`
    );
  },

  async down() {
    // Postgres does not support removing enum values; no-op
  },
};
