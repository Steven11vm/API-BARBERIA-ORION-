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

// Inicialización para entornos locales
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.APP_PORT || 3000;
  initializeDatabase().then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor local corriendo en el puerto ${PORT}`);
    });
  }).catch(error => {
    console.error('Error al iniciar el servidor local:', error);
    process.exit(1);
  });
}

// Exportar para Vercel
module.exports = async (req, res) => {
  await initializeDatabase(); // Inicializa DB por solicitud en serverless
  return app(req, res);
};