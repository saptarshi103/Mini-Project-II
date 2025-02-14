const { DataTypes } = require('sequelize');
const sequelize = require('../config/dbConfig');
const Landlord = require('./landlord'); // For foreign key relation


const RoomDetails = sequelize.define('RoomDetails', {
    room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    location_cordinate:{
        type: DataTypes.TEXT, // Store URLs or JSON strings if multiple
        allowNull: false,
    },
    photos: {
        type: DataTypes.TEXT, // Store URLs or JSON strings if multiple
        allowNull: false,
    },
    available_from: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    preferences: {
        type: DataTypes.ENUM('Boys', 'Girls', 'Family'),
        allowNull: false,
    },
    rent: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    pincode: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    deposit: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    buildup_area: {
        type: DataTypes.FLOAT, // Square feet
        allowNull: false,
    },
    furnishing: {
        type: DataTypes.STRING, // E.g., "Fully Furnished", "Semi-Furnished"
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING, 
        allowNull: false,
    },
    bhk: {
        type: DataTypes.INTEGER, // Total rooms
        allowNull: false,
    },
    parking: {
        type: DataTypes.ENUM('Bike', 'Car', 'None'),
        allowNull: false,
    },
    balcony: {
        type: DataTypes.INTEGER, // Number of balconies
        allowNull: false,
    },
    age_of_property: {
        type: DataTypes.INTEGER, // Age of property
        allowNull: false,
    },
    non_veg_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    floor_number: {
        type: DataTypes.INTEGER, // Floor number
        allowNull: false,
    },
    facing: {
        type: DataTypes.STRING, // E.g., "East", "West"
        allowNull: false,
    },
    number_of_bathrooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    water_supply: {
        type: DataTypes.BOOLEAN, 
        allowNull: false,
    },
    inverter_backup: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    property_type: {
        type: DataTypes.STRING, // E.g., "Apartment", "Villa"
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    landmark: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    landlord_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Landlord, // Table name
            key: 'landlord_id',
        },
        allowNull: false,
    },
}, {
    tableName: 'RoomDetails', // Match the table name in your database
    timestamps: false,
});

module.exports = RoomDetails;
