require('dotenv').config();
const { Sequelize } = require('sequelize');

// Configuración para forzar autenticación SQL (no Azure AD)
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Orion
  process.env.DB_USER,      // orion
  process.env.DB_PASSWORD,  // Medellin*2025$/
  {
    host: process.env.DB_HOST,    // orionbarberia.database.windows.net
    port: process.env.DB_PORT || 1433,
    dialect: process.env.DB_DIALECT || 'mssql',
    dialectOptions: {
      options: {
        encrypt: true,                // Obligatorio en Azure
        trustServerCertificate: false,
        requestTimeout: 30000,        // 30 segundos
        enableArithAbort: true,
        // Fuerza SQL auth (ignora Azure AD)
        authentication: {
          type: 'default',            // Usa SQL con user/pass
        },
      },
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
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MSSQL exitosa con SQL auth');
  } catch (error) {
    console.error('❌ Error de conexión a MSSQL:', error.message);
    // No hacer exit(1) aquí para que el servidor pueda iniciar y mostrar el error
  }
}

// Ejecutar test de conexión
testConnection();

module.exports = sequelize;