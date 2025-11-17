const Permission = require("../models/permission")

const defaultPermissions = [
  "Roles",
  "Usuarios",
  "Categorias",
  "Productos",
  "Proveedores",
  "Compras",
  "Servicios",
  "Programacion de empleado",
  "Ausencias",
  "Citas",
  "Pedidos",
  "Ventas",
  "Perfil",
  "Dashboard",
  "Vista Cliente",
]

const initializePermissions = async () => {
  try {
    console.log("Iniciando la sincronización de permisos...")

    for (const name of defaultPermissions) {
      // Busca si ya existe el permiso
      const [permission, created] = await Permission.findOrCreate({
        where: { name },
        defaults: {
          name,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      })

      // Si ya existía, solo actualizamos la fecha
      if (!created) {
        await permission.update({ updatedAt: new Date() })
      }
    }

    console.log("Permisos sincronizados exitosamente ✅")
  } catch (error) {
    console.error("Error al sincronizar permisos:", error)
  }
}

module.exports = initializePermissions
