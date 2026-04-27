'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('disclaimer_versions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      version: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      content: {
        type: Sequelize.TEXT,
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

    await queryInterface.createTable('disclaimer_accepteds', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      disclaimer_version_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'disclaimer_versions',
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
      accepted_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    await queryInterface.addIndex('disclaimer_accepteds', ['user_id']);

    await queryInterface.sequelize.query(`
      INSERT INTO disclaimer_versions (id, version, content, created_at, updated_at)
      VALUES (
        gen_random_uuid(),
        1,
        '<p>Welcome to <strong>Welyat</strong>.</p><p>By using this platform, you agree to the following terms:</p><p><strong>1. PURPOSE</strong><br>Welyat connects people who need to talk with compassionate listeners. This service is <strong>not a substitute</strong> for professional mental health care, therapy, or emergency services.</p><p><strong>2. NOT A CRISIS SERVICE</strong><br>If you are in danger or experiencing a mental health emergency, please contact emergency services (<strong>112 / 911</strong>) or a crisis hotline immediately. Welyat listeners are not trained mental health professionals.</p><p><strong>3. LISTENER CONDUCT</strong><br>Listeners are independent individuals, not employees of Welyat. While we screen and monitor quality, Welyat does not guarantee any specific outcome from a call.</p><p><strong>4. PRIVACY</strong><br>Calls are anonymous. Do not share personal information (full name, address, financial details) with listeners. Welyat does not record calls.</p><p><strong>5. ACCEPTABLE USE</strong><br>You agree not to use Welyat for harassment, illegal activity, or any purpose other than sincere conversation. Abuse will result in immediate account termination.</p><p><strong>6. BILLING</strong><br>Calls begin with a free period. Continued conversation may incur charges billed to your payment method on file. You may end a call at any time.</p><p><strong>7. CHANGES</strong><br>Welyat may update these terms at any time. Continued use of the platform after an update requires re-acceptance.</p><p>By clicking <strong>Accept &amp; continue</strong> you confirm that you have read, understood, and agreed to these terms.</p>',
        NOW(),
        NOW()
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('disclaimer_versions');
    await queryInterface.dropTable('disclaimer_accepteds');
  },
};
