const Role = require('../models/role');

const defaultRoles = ['Administrador', 'Empleado', 'Cliente'];

const initializeRoles = async () => {
  try {
    console.log('Iniciando la sincronización de roles...');

    for (const roleName of defaultRoles) {
      // Buscar si ya existe
      const existingRole = await Role.findOne({ where: { name: roleName } });

      if (!existingRole) {
        await Role.create({ name: roleName });
        console.log(`Rol creado: ${roleName}`);
      } else {
        console.log(`Rol ya existente: ${roleName}`);
      }
    }

    console.log('Roles sincronizados exitosamente ✅');
  } catch (error) {
    console.error('Error al sincronizar roles:', error);
  }
};

module.exports = initializeRoles;
