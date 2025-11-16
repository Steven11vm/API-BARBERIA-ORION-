import Role from './role.js';
import Permission from './permission.js';
import PermissionRole from './permissionRole.js';
import Privilege from './privilegios.js';
import PrivilegePermissionRole from './privilegePermissionRole.js';

// Define all associations here to avoid circular dependencies

// Role <-> Permission (Many-to-Many through PermissionRole)
Role.belongsToMany(Permission, { 
  through: PermissionRole, 
  foreignKey: 'roleId',
  otherKey: 'permissionId',
  onDelete: 'CASCADE' 
});

Permission.belongsToMany(Role, { 
  through: PermissionRole, 
  foreignKey: 'permissionId',
  otherKey: 'roleId',
  onDelete: 'CASCADE' 
});

// PermissionRole relationships
PermissionRole.belongsTo(Role, { foreignKey: 'roleId' });
PermissionRole.belongsTo(Permission, { foreignKey: 'permissionId' });

// Privilege <-> Permission (One-to-Many)
Privilege.belongsTo(Permission, { foreignKey: 'permissionId' });
Permission.hasMany(Privilege, { foreignKey: 'permissionId' });

// PrivilegePermissionRole relationships
PrivilegePermissionRole.belongsTo(PermissionRole, { foreignKey: 'permissionRoleId' });
PrivilegePermissionRole.belongsTo(Privilege, { foreignKey: 'privilegeId' });

PermissionRole.hasMany(PrivilegePermissionRole, { foreignKey: 'permissionRoleId' });
Privilege.hasMany(PrivilegePermissionRole, { foreignKey: 'privilegeId' });

export {
  Role,
  Permission,
  PermissionRole,
  Privilege,
  PrivilegePermissionRole
};

