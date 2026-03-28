const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password_hash: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.ENUM('talker', 'listener', 'both', 'admin'),
            allowNull: false,
            defaultValue: 'talker',
        },
        is_founding: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        founding_end_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        reputation_score: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 5.0,
        },
        toxic_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        toxic_flagged_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        low_reputation_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        low_reputation_since: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        total_xp: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        balance: {
            type: DataTypes.DECIMAL(10, 2),
            defaultValue: 0.0,
        },
        stripe_customer_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        is_trial: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        trial_sessions_used: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        trial_seconds_used: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        },
        accepted_disclaimer: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        tableName: 'users',
        underscored: true,
        timestamps: true,
    }
);

// Instance methods
User.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password_hash);
};

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password_hash;
    return values;
};

// Class methods
User.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
};

module.exports = User;
