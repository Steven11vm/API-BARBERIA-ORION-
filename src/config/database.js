require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME, // AndromedaDB
    process.env.DB_USER, // Mendoza
    process.env.DB_PASSWORD, // 2025*
    {
        host: process.env.DB_HOST, // 34.44.0.39
        port: process.env.DB_PORT, // 1433
        dialect: 'mssql',
        dialectOptions: {
            instanceName: undefined, // Cambia si usas una instancia específica, e.g., 'SQLEXPRESS'
            encrypt: true, // Para conexiones seguras
            trustServerCertificate: true // Solo para desarrollo
        },
        server: process.env.DB_HOST, // Mapeo explícito para tedious
        logging: console.log // Habilitar logs para depuración
    }
);

module.exports = sequelize;