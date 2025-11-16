-- =============================================
-- SCRIPT SQL PARA CREAR LOGIN DEL SERVIDOR SQL 'orion'
-- EJECUTAR EN AZURE PORTAL -> EDITOR DE CONSULTAS
-- =============================================

-- 1. Crear login del servidor SQL (IMPORTANTE: Esto es lo que falta)
IF NOT EXISTS (SELECT * FROM sys.server_principals WHERE name = 'orion')
BEGIN
    CREATE LOGIN [orion] 
    WITH PASSWORD = 'Medellin*2025$/',
    DEFAULT_DATABASE = [AndromedaBD],
    CHECK_EXPIRATION = OFF,
    CHECK_POLICY = OFF;
    PRINT '✅ Login del servidor SQL creado exitosamente';
END
ELSE
BEGIN
    PRINT '⚠️ El login del servidor SQL ya existe';
END
GO

-- 2. Cambiar a la base de datos AndromedaBD
USE [AndromedaBD];
GO

-- 3. Crear usuario en la base de datos vinculado al login
IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'orion')
BEGIN
    CREATE USER [orion] FOR LOGIN [orion];
    PRINT '✅ Usuario de base de datos creado exitosamente';
END
ELSE
BEGIN
    -- Si el usuario ya existe pero no está vinculado al login, vincularlo
    IF NOT EXISTS (SELECT * FROM sys.database_principals WHERE name = 'orion' AND type = 'S')
    BEGIN
        DROP USER [orion];
        CREATE USER [orion] FOR LOGIN [orion];
        PRINT '✅ Usuario vinculado al login exitosamente';
    END
    ELSE
    BEGIN
        PRINT '⚠️ El usuario de base de datos ya existe';
    END
END
GO

-- 4. Otorgar permisos completos
ALTER ROLE db_owner ADD MEMBER [orion];
PRINT '✅ Permisos otorgados exitosamente';
GO

-- 5. Verificar que todo se creó correctamente
SELECT 'Login del servidor:' AS Tipo, name, type_desc, default_database_name 
FROM sys.server_principals 
WHERE name = 'orion'
UNION ALL
SELECT 'Usuario de BD:', name, type_desc, NULL
FROM sys.database_principals 
WHERE name = 'orion';
GO

