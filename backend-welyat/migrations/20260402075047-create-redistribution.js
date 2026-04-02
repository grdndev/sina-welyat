'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('redistributions', {
      id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
      },
      executed_at: {
          type: Sequelize.DATE,
          defaultValue: Date.now()
      },
      total_margin: {
          type: Sequelize.DECIMAL,
          allowNull: false
      },
      redistribution_percentage: {
          type: Sequelize.DECIMAL,
          allowNull: false
      },
      total_xp_distributed: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      amount_per_xp: {
          type: Sequelize.DECIMAL,
          allowNull: false
      },
      total_amount_redistributed: {
          type: Sequelize.DECIMAL,
          allowNull: false
      },
      executed_by_admin_id: {
          type: Sequelize.UUID,
          allowNull: false
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

    await queryInterface.createTable('redistribution_details', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      redistribution_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'redistributions',
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
      xp_converted: {
          type: Sequelize.INTEGER,
          allowNull: false
      },
      amount_credited: {
          type: Sequelize.DECIMAL,
          allowNull: false
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
    await queryInterface.addIndex('redistribution_details', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('redistributions');
    await queryInterface.dropTable('redistribution_details');
  },
};
