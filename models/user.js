const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig'); // Ensure dbConfig.js exports your Sequelize instance

const User = sequelize.define('User', {
    user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
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
    gender: {
        type: DataTypes.ENUM('Male', 'Female', 'Other'),
        allowNull: true,
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'Users', // Optional: specify table name
    timestamps: false, // Disable created_at and updated_at if you haven't added them
});

module.exports = User;
