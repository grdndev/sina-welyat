'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ratings', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      call_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'calls',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      from_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      to_user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('ratings', ['call_id']);
    await queryInterface.addIndex('ratings', ['from_user_id']);
    await queryInterface.addIndex('ratings', ['to_user_id']);
    await queryInterface.addIndex('ratings', ['score']);
    await queryInterface.addIndex('ratings', ['created_at']);

    // Add unique constraint: one rating per user per call
    await queryInterface.addConstraint('ratings', {
      fields: ['call_id', 'from_user_id'],
      type: 'unique',
      name: 'unique_rating_per_call_per_user',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ratings');
  },
};
