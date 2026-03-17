'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const hashPassword = async (password) => {
      const salt = await bcrypt.genSalt(10);
      return bcrypt.hash(password, salt);
    };

    const password = await hashPassword('password123');

    // Nettoyer la table pour éviter les doublons
    await queryInterface.bulkDelete('users', null, {});

    await queryInterface.bulkInsert(
      'users',
      [
        // Parlants
        {
          id: uuidv4(),
          email: 'parlant1@sina.com',
          password_hash: password,
          role: 'parlant',
          is_founding: false,
          reputation_score: 5.0,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 0,
          balance: 0.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'parlant2@sina.com',
          password_hash: password,
          role: 'parlant',
          is_founding: false,
          reputation_score: 4.8,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 0,
          balance: 0.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'parlant3@sina.com',
          password_hash: password,
          role: 'parlant',
          is_founding: false,
          reputation_score: 4.5,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 0,
          balance: 0.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'parlant4@sina.com',
          password_hash: password,
          role: 'parlant',
          is_founding: false,
          reputation_score: 3.2,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 0,
          balance: 0.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'parlant5@sina.com',
          password_hash: password,
          role: 'parlant',
          is_founding: false,
          reputation_score: 2.1,
          toxic_flag: true,
          toxic_flagged_at: new Date(),
          low_reputation_flag: false,
          total_xp: 0,
          balance: 0.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // Écoutants
        {
          id: uuidv4(),
          email: 'ecoutant1@sina.com',
          password_hash: password,
          role: 'écoutant',
          is_founding: false,
          reputation_score: 4.9,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 45,
          balance: 28.5,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'ecoutant2@sina.com',
          password_hash: password,
          role: 'écoutant',
          is_founding: false,
          reputation_score: 4.7,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 32,
          balance: 15.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'ecoutant3@sina.com',
          password_hash: password,
          role: 'écoutant',
          is_founding: false,
          reputation_score: 4.3,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 18,
          balance: 5.75,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'ecoutant4@sina.com',
          password_hash: password,
          role: 'écoutant',
          is_founding: false,
          reputation_score: 2.3,
          toxic_flag: false,
          low_reputation_flag: true,
          low_reputation_since: new Date(),
          total_xp: 5,
          balance: 0.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'ecoutant5@sina.com',
          password_hash: password,
          role: 'écoutant',
          is_founding: false,
          reputation_score: 3.8,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 12,
          balance: 3.25,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // Founding Listeners
        {
          id: uuidv4(),
          email: 'founding1@sina.com',
          password_hash: password,
          role: 'écoutant',
          is_founding: true,
          founding_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 year
          reputation_score: 4.95,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 127,
          balance: 85.5,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: uuidv4(),
          email: 'founding2@sina.com',
          password_hash: password,
          role: 'écoutant',
          is_founding: true,
          founding_end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 year
          reputation_score: 4.88,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 98,
          balance: 62.3,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },

        // Mixed role (both)
        {
          id: uuidv4(),
          email: 'both1@sina.com',
          password_hash: password,
          role: 'both',
          is_founding: false,
          reputation_score: 4.6,
          toxic_flag: false,
          low_reputation_flag: false,
          total_xp: 23,
          balance: 12.0,
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  },
};
