require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuración simplificada para Azure SQL Database con autenticación SQL
const sequelize = new Sequelize(
  process.env.DB_NAME,      // AndromedaBD
  process.env.DB_USER,      // orion
  process.env.DB_PASSWORD,  // Medellin*2025$/
  {
    host: process.env.DB_HOST,    // orionbarberia.database.windows.net
    port: parseInt(process.env.DB_PORT) || 1433,
    dialect: 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true,
        requestTimeout: 30000
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log
  }
);

module.exports = sequelize;