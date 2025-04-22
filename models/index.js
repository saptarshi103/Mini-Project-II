const Sequelize = require('sequelize');
const sequelize = require('../config/dbConfig'); // Ensure correct path

const Landlord = require('./landlord');

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Landlord = Landlord;

module.exports = db;
