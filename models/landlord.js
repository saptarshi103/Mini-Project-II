const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

// Landlords model definition
const Landlord = sequelize.define('Landlord', {
    landlord_id: {
        type: DataTypes.STRING,  // Changed to STRING since it's the Cognito user ID (which is alphanumeric)
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,  // Ensure email is unique across landlords
        allowNull: false,  // Email is mandatory
    },
    
}, {
    tableName: 'Landlords',  // Match the table name in your database
    timestamps: false,  // Enable timestamps, as users will have createdAt and updatedAt fields
});

// Optionally, add some instance methods or hooks if required (e.g., for validation or additional processing)

module.exports = Landlord;
