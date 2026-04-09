'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Make firstname nullable
    await queryInterface.changeColumn('users', 'firstname', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Make lastname nullable
    await queryInterface.changeColumn('users', 'lastname', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    // Make email nullable (keep unique constraint — postgres allows multiple NULLs)
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
    // Add unique constraint on phone
    await queryInterface.addIndex('users', ['phone'], { unique: true, name: 'users_phone_unique' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'firstname', { type: Sequelize.STRING, allowNull: false });
    await queryInterface.changeColumn('users', 'lastname', { type: Sequelize.STRING, allowNull: false });
    await queryInterface.changeColumn('users', 'email', { type: Sequelize.STRING, allowNull: false, unique: true });
    await queryInterface.removeIndex('users', 'users_phone_unique');
  },
};
