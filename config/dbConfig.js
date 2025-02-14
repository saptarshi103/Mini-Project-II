const { Sequelize } = require('sequelize');
require('dotenv').config(); // Importing .env file

// Reading database configuration from environment variables
const dbConfig = {
  host: process.env.DB_HOST,       // Example: 'localhost'
  username: process.env.DB_USER,  // Example: 'root'
  password: process.env.DB_PASS,  // Example: 'password'
  database: process.env.DB_NAME,  // Example: 'hotels'
  dialect: 'mysql'                // Specify the database dialect
};

// Initializing Sequelize instance
const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect
});


// Testing the connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL database using Sequelize.');
  } catch (error) {
    console.error('Error connecting to MySQL database:', error.message);
  }
})();



// Exporting the Sequelize instance for use in other parts of the application
module.exports = sequelize;
