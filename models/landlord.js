const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');

const Landlord = sequelize.define('Landlord', {
    landlord_id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true, // optional, defaults to true if not specified
    },
    mobile: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    profile_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    tableName: 'Landlords',
    timestamps: false,
});

module.exports = Landlord;
