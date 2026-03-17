'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Rename old column to avoid conflicts if needed, but here we replace ENUM
    // In Postgres, we can't easily rename/change ENUM values in a column without drop/recreate or ALTER TYPE

    await queryInterface.sequelize.query('ALTER TYPE "enum_business_modes_mode_name" ADD VALUE \'OPEN\'');
    await queryInterface.sequelize.query('ALTER TYPE "enum_business_modes_mode_name" ADD VALUE \'SMART\'');
    await queryInterface.sequelize.query('ALTER TYPE "enum_business_modes_mode_name" ADD VALUE \'SHIELD\'');
    await queryInterface.sequelize.query('ALTER TYPE "enum_business_modes_mode_name" ADD VALUE \'CRITICAL\'');
  },

  async down(queryInterface, Sequelize) {
    // Note: Dropping enum values is not supported by Postgres without recreating the type
  }
};
