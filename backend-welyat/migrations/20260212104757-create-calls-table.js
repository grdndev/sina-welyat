'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('calls', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      talker_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      listener_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      business_mode_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'business_modes',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      status: {
        type: Sequelize.ENUM('waiting', 'active_free', 'alerted', 'active_paid', 'ended', 'cancelled'),
        allowNull: false,
        defaultValue: 'waiting',
      },
      twilio_call_sid: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      started_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      alerted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      became_paid_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      ended_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      duration_free_seconds: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      duration_paid_seconds: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      total_cost_client: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      total_payout_listener: {
        type: Sequelize.DECIMAL(10, 2),
        defaultValue: 0.00,
      },
      xp_generated: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      bridge_fee_1_charged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      bridge_fee_2_charged: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      dtmf_pressed: {
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
    await queryInterface.addIndex('calls', ['talker_id']);
    await queryInterface.addIndex('calls', ['listener_id']);
    await queryInterface.addIndex('calls', ['status']);
    await queryInterface.addIndex('calls', ['started_at']);
    await queryInterface.addIndex('calls', ['twilio_call_sid']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('calls');
  },
};
