'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('call_payment_intents', {
            id: {
                type: Sequelize.UUID,
                defaultValue: Sequelize.UUIDV4,
                primaryKey: true,
            },
            call_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'calls', key: 'id' },
                onDelete: 'CASCADE',
            },
            stripe_payment_intent_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            amount_cents: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            status: {
                type: Sequelize.ENUM('authorized', 'captured', 'cancelled'),
                defaultValue: 'authorized',
            },
            captured_cents: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.NOW,
            },
        });
    },

    async down(queryInterface) {
        await queryInterface.dropTable('call_payment_intents');
    },
};
