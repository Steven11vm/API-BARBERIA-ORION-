const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./src/config/database');
const initializePermissions = require('./src/config/initPermissions');
const initializeRoles = require('./src/config/initRoles');
const initializeAdminRole = require('./src/config/initializeAdminRole');
const seedPrivileges = require('./src/config/privilegesSeeder');
const seedPrivilegePermissionRoles = require('./src/config/privilegePermissionRoleseeder');
const initializeUserAdmin = require('./src/config/initializeUserAdmin');

// Importación de rutas
const categoryRoutes = require('./src/routes/categoryRoutes');
const userRoutes = require('./src/routes/userRoutes');
const roleRoutes = require('./src/routes/roleRoutes');
const permissionRoutes = require('./src/routes/permissionRoutes');
const permissionRoleRoutes = require('./src/routes/permissionRoleRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const saleRoutes = require('./src/routes/saleRoutes');
const absenceRoutes = require('./src/routes/absenceRoutes');
const productRoutes = require('./src/routes/productsRoutes');
const suppliersRoutes = require('./src/routes/suppliersRoutes');
const orderRoutes = require('./src/routes/ordersRoutes');
const shoppingRoutes = require('./src/routes/shoppingRoutes');
const appointment = require('./src/routes/appointment');
const privilegeRoutes = require('./src/routes/privilegiosRoutes');
const privilegePermissionRoleRoutes = require('./src/routes/privilegePermissionRoleRoutes');

dotenv.config();

const app = express();
app.use(cors());

// Configuración del body-parser
app.use(bodyParser.json({ limit: '20mb' }));
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));

// Configuración de rutas estáticas
app.use('/uploads', express.static('Uploads'));

// Configuración de rutas de la API
app.use('/api/privileges', privilegeRoutes);
app.use('/api/privilege-permission-roles', privilegePermissionRoleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/permissionsRole', permissionRoleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/absences', absenceRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', suppliersRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/shopping', shoppingRoutes);
app.use('/api/appointment', appointment);

// Función para inicializar la base de datos
const initializeDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a MSSQL establecida');
    await sequelize.sync();
    console.log('Modelos sincronizados con la base de datos');
    await initializePermissions();
    console.log('Permisos inicializados correctamente');
    await initializeRoles();
    console.log('Roles inicializados correctamente');
    await initializeAdminRole();
    console.log('Rol Admin inicializado correctamente');
    await seedPrivileges();
    console.log('Privilegios sembrados correctamente');
    await seedPrivilegePermissionRoles();
    console.log('PrivilegePermissionRoles sembrados correctamente');
    await initializeUserAdmin();
    console.log('Usuario Admin inicializado correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    throw error;
  }
};

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API BARBERIA ORION funcionando' });
});

// Variable para controlar la inicialización en producción
let dbInitialized = false;

// Detectar el entorno de despliegue
const isVercel = process.env.VERCEL;
const isAzure = process.env.WEBSITE_SITE_NAME || process.env.AZURE_APP_SERVICE;
const isRender = process.env.PORT && !isVercel && !isAzure;
const isLocal = process.env.NODE_ENV !== 'production' && !isVercel && !isRender && !isAzure;

// Si es Vercel (serverless), exportar función handler
if (isVercel) {
  module.exports = async (req, res) => {
    // Inicializar la base de datos solo una vez en producción
    if (!dbInitialized) {
      try {
        await initializeDatabase();
        dbInitialized = true;
        console.log('Base de datos inicializada en producción (Vercel)');
      } catch (error) {
        console.error('Error al inicializar la base de datos en producción:', error);
        return res.status(500).json({ error: 'Error al inicializar la base de datos' });
      }
    }
    return app(req, res);
  };
} else {
  // Para Azure, Render y desarrollo local: iniciar servidor en puerto
  const PORT = process.env.PORT || process.env.APP_PORT || 3000;
  initializeDatabase().then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
      if (isAzure) {
        console.log('Desplegado en Azure App Service');
      } else if (isRender) {
        console.log('Desplegado en Render.com');
      } else if (isLocal) {
        console.log('Modo desarrollo local');
      }
    });
  }).catch(error => {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  });
}