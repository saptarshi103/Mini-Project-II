const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt'); // Add bcrypt for password hashing
const sequelize = require('../config/dbConfig');

const Landlord = sequelize.define('Landlord', {
    landlord_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'Landlords', // Match the table name in your database
    timestamps: false, // Disable timestamps
});

// Add a hook to hash the password before saving
Landlord.beforeCreate(async (landlord, options) => {
    try {
        // Generate salt and hash the password
        const salt = await bcrypt.genSalt(10);
        landlord.password = await bcrypt.hash(landlord.password, salt);
    } catch (error) {
        throw error;
    }
});

Landlord.beforeUpdate(async (landlord, options) => {
    try {
        if (landlord.changed('password')) {
            // Generate salt and hash the updated password
            const salt = await bcrypt.genSalt(10);
            landlord.password = await bcrypt.hash(landlord.password, salt);
        }
    } catch (error) {
        throw error;
    }
});

// Add a method to compare passwords
Landlord.prototype.comparePassword = async function (candidatePassword) {
    try {
        // Compare the given password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw error;
    }
};

module.exports = Landlord;
