'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      phone: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.ENUM('talker', 'listener', 'both', 'admin'),
        allowNull: false,
        defaultValue: 'talker',
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other'),
        allowNull: true,
      },
      birthdate: {
          type: Sequelize.DATE,
          allowNull: true,
      },
      is_founding: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      founding_end_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      reputation_score: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 5.0,
      },
      toxic_flag: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      toxic_flagged_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      low_reputation_flag: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      low_reputation_since: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      total_xp: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      balance: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      stripe_customer_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      is_trial: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      trial_sessions_used: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      trial_seconds_used: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      accepted_disclaimer: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.addIndex('users', ['email']);
    await queryInterface.addIndex('users', ['phone']);
    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['is_founding']);
    await queryInterface.addIndex('users', ['reputation_score']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  },
};
