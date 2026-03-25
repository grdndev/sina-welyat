'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reputations', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
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
      duration_listened_seconds: {
          type: Sequelize.INTEGER,
          defaultValue: 0,
      },
      no_bad_ratings: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
      },
      status: {
          type: Sequelize.ENUM('in_progress', 'completed'),
          defaultValue: 'in_progress',
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
    await queryInterface.addIndex('reputations', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reputations');
  },
};
