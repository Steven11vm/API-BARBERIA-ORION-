const Role = require('../models/role');
const Permission = require('../models/Permission');
const PermissionRole = require('../models/permissionRole');

const initializeAdminRole = async () => {
  try {
    console.log('Iniciando la creación del rol administrador...');

    // 1. Crear o encontrar los roles sin usar description (no existe en el modelo)
    let adminRole = await Role.findOne({ where: { name: 'Administrador' } });
    if (!adminRole) {
      adminRole = await Role.create({ name: 'Administrador' });
      console.log('Rol Administrador creado');
    }

    let employeeRole = await Role.findOne({ where: { name: 'Empleado' } });
    if (!employeeRole) {
      employeeRole = await Role.create({ name: 'Empleado' });
      console.log('Rol Empleado creado');
    }

    let clientRole = await Role.findOne({ where: { name: 'Cliente' } });
    if (!clientRole) {
      clientRole = await Role.create({ name: 'Cliente' });
      console.log('Rol Cliente creado');
    }

    // 2. Obtener todos los permisos
    const allPermissions = await Permission.findAll();

    // 3. Asignar todos los permisos al rol Administrador
    for (const permission of allPermissions) {
      const exists = await PermissionRole.findOne({
        where: { roleId: adminRole.id, permissionId: permission.id },
      });

      if (!exists) {
        await PermissionRole.create({
          roleId: adminRole.id,
          permissionId: permission.id,
        });
      }
    }

    // 4. Permisos para Empleado (todos menos Usuarios, Roles, Dashboard)
    const excludedPermissions = ['Usuarios', 'Roles', 'Dashboard'];
    const employeePermissions = allPermissions.filter(
      (permission) => !excludedPermissions.includes(permission.name)
    );

    for (const permission of employeePermissions) {
      const exists = await PermissionRole.findOne({
        where: { roleId: employeeRole.id, permissionId: permission.id },
      });

      if (!exists) {
        await PermissionRole.create({
          roleId: employeeRole.id,
          permissionId: permission.id,
        });
      }
    }

    // 5. Permisos para Cliente (solo Vista Cliente)
    const clientPermission = allPermissions.find(
      (permission) => permission.name === 'Vista Cliente'
    );

    if (clientPermission) {
      const exists = await PermissionRole.findOne({
        where: { roleId: clientRole.id, permissionId: clientPermission.id },
      });

      if (!exists) {
        await PermissionRole.create({
          roleId: clientRole.id,
          permissionId: clientPermission.id,
        });
      }
    }

    console.log('Roles y permisos asignados exitosamente ✅');
    return adminRole;
  } catch (error) {
    console.error('Error al crear el rol administrador:', error);
    throw error;
  }
};

module.exports = initializeAdminRole;
