require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER, // Debe ser 'orion' (no 'orionbarberia')
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      encrypt: true, // Required for secure connections
      trustServerCertificate: false, // Azure SQL requires this to be false
      enableArithAbort: true,
      options: {
        encrypt: true
      }
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: process.env.NODE_ENV === 'production' ? false : console.log // Disable logs in production
  }
);

// Prueba la conexión al inicializar
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión a MSSQL establecida correctamente');
  })
  .catch(err => {
    console.error('❌ Error de conexión a MSSQL:', err.message);
  });

module.exports = sequelize;