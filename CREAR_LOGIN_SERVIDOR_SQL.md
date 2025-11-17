# 🔐 Crear Login del Servidor SQL para Usuario 'orion'

## ⚠️ Problema

El error `Login failed for user 'orion'` indica que:
- El usuario `orion` puede existir en la **base de datos** pero NO como **login del servidor SQL**
- Para conexiones externas (como desde Render), necesitas un **login del servidor SQL**

## ✅ Solución: Crear Login del Servidor SQL

### Paso 1: Ir al Servidor SQL en Azure Portal

1. **Azure Portal**: https://portal.azure.com
2. **Busca "SQL servers"** en el buscador
3. **Click en tu servidor**: `orionbarberia`

### Paso 2: Crear Login del Servidor SQL

**Opción A: Desde Azure Portal (Más Fácil)**

1. **En tu servidor SQL** `orionbarberia`
2. **Click en "SQL logins"** en el menú lateral
3. **Click en "+ New SQL login"** o **"+ Add"**
4. **Configura**:
   - **Login name**: `orion`
   - **Password**: `Medellin*2025$/`
   - **Default database**: `Orion`
   - **Click en "Create"** o **"Save"**

**Opción B: Desde Query Editor (Más Controlado)**

1. **Azure Portal** → Tu servidor SQL `orionbarberia`
2. **Click en "Query editor"** (o ve a tu base de datos `Orion` → Query editor)
3. **Inicia sesión** con tu usuario administrador
4. **Ejecuta este SQL**:

```sql
-- Crear login del servidor SQL si no existe
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'orion')
BEGIN
    CREATE LOGIN [orion] 
    WITH PASSWORD = 'Medellin*2025$/',
    DEFAULT_DATABASE = [Orion],
    CHECK_EXPIRATION = OFF,
    CHECK_POLICY = OFF;
END
GO

-- Verificar que se creó
SELECT name, type_desc, default_database_name 
FROM sys.server_principals 
WHERE name = 'orion';
GO
```

### Paso 3: Crear Usuario en la Base de Datos y Otorgar Permisos

1. **En Query Editor**, cambia a tu base de datos `Orion`:

```sql
USE [Orion];
GO

-- Crear usuario en la base de datos vinculado al login
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'orion')
BEGIN
    CREATE USER [orion] FOR LOGIN [orion];
END
GO

-- Otorgar permisos completos
ALTER ROLE db_owner ADD MEMBER [orion];
GO

-- Verificar permisos
SELECT dp.name, dp.type_desc, r.name AS role_name
FROM sys.database_principals dp
LEFT JOIN sys.database_role_members rm ON dp.principal_id = rm.member_principal_id
LEFT JOIN sys.database_principals r ON rm.role_principal_id = r.principal_id
WHERE dp.name = 'orion';
GO
```

### Paso 4: Verificar Variables en Render

1. **Render** → Tu servicio → **"Environment"**
2. **Verifica estas variables**:

```
DB_USER = orion@orionbarberia
```

O prueba primero:

```
DB_USER = orion
```

### Paso 5: Guardar y Reiniciar

1. **Guarda** los cambios en Render
2. **Espera** 1-2 minutos
3. **Revisa los logs**

## 🔍 Script SQL Completo (Copia y Pega)

Ejecuta este script completo en Query Editor:

```sql
-- =============================================
-- Crear Login del Servidor SQL y Usuario
-- =============================================

-- 1. Crear login del servidor SQL
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'orion')
BEGIN
    CREATE LOGIN [orion] 
    WITH PASSWORD = 'Medellin*2025$/',
    DEFAULT_DATABASE = [Orion],
    CHECK_EXPIRATION = OFF,
    CHECK_POLICY = OFF;
    PRINT 'Login del servidor SQL creado exitosamente';
END
ELSE
BEGIN
    PRINT 'El login del servidor SQL ya existe';
END
GO

-- 2. Cambiar a la base de datos Orion
USE [Orion];
GO

-- 3. Crear usuario en la base de datos
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'orion')
BEGIN
    CREATE USER [orion] FOR LOGIN [orion];
    PRINT 'Usuario de base de datos creado exitosamente';
END
ELSE
BEGIN
    PRINT 'El usuario de base de datos ya existe';
END
GO

-- 4. Otorgar permisos completos
ALTER ROLE db_owner ADD MEMBER [orion];
PRINT 'Permisos otorgados exitosamente';
GO

-- 5. Verificar
SELECT 'Login del servidor:' AS Tipo, name, type_desc, default_database_name 
FROM sys.server_principals 
WHERE name = 'orion'
UNION ALL
SELECT 'Usuario de BD:', name, type_desc, NULL
FROM sys.database_principals 
WHERE name = 'orion';
GO
```

## ✅ Verificar que Funcionó

Después de ejecutar el script y actualizar Render, en los logs deberías ver:

```
✅ Conexión a MSSQL establecida correctamente
Conexión a MSSQL establecida
Modelos sincronizados con la base de datos
```

## 🆘 Si Aún No Funciona

### Verificar Formato del Usuario en Render

Prueba estos formatos (uno a la vez):

**Opción 1:**
```
DB_USER = orion@orionbarberia
```

**Opción 2:**
```
DB_USER = orion
```

**Opción 3:**
```
DB_USER = orionbarberia\orion
```

### Verificar que el Login Existe

En Query Editor, ejecuta:

```sql
-- Verificar login del servidor
SELECT name, type_desc, default_database_name 
FROM sys.server_principals 
WHERE name = 'orion';

-- Si no aparece nada, el login no existe y necesitas crearlo
```

## 🎯 Pasos Inmediatos

1. **Azure Portal** → Tu servidor SQL `orionbarberia`
2. **Query Editor** → Ejecuta el script SQL completo de arriba
3. **Render** → Environment → Verifica `DB_USER = orion@orionbarberia`
4. **Guarda** y **revisa los logs**

¡El problema es que necesitas un **login del servidor SQL**, no solo un usuario de base de datos! 🚀

