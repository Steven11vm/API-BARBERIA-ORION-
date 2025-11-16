# 🚀 Guía Completa para Desplegar en Render.com

## Paso 1: Preparar el Código

✅ Tu código ya está listo:
- `render.yaml` configurado
- `server.js` detecta Render automáticamente
- `.env` actualizado con valores de Azure SQL

## Paso 2: Subir Código a GitHub

1. **Inicializa Git** (si no lo has hecho):
   ```bash
   git init
   git add .
   git commit -m "Preparado para Render"
   ```

2. **Crea repositorio en GitHub**:
   - Ve a: https://github.com/new
   - Crea un nuevo repositorio (ej: `andromeda-api`)
   - **NO** inicialices con README

3. **Conecta y sube**:
   ```bash
   git remote add origin https://github.com/TU_USUARIO/andromeda-api.git
   git branch -M main
   git push -u origin main
   ```

## Paso 3: Crear Servicio en Render

1. **Ve a Render**: https://render.com
2. **Sign up / Login** (puedes usar GitHub)

3. **Crear nuevo Web Service**:
   - Click en **"New +"** → **"Web Service"**
   - Click en **"Connect GitHub"** (si no lo has hecho)
   - Selecciona tu repositorio `andromeda-api`

4. **Configurar el servicio**:
   - **Name**: `andromeda-api`
   - **Region**: `Oregon (US West)` o el más cercano
   - **Branch**: `main`
   - **Root Directory**: (dejar vacío)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free` (para empezar)

5. **Variables de Entorno**:
   Click en "Advanced" y agrega estas variables:

   ```
   DB_DIALECT = mssql
   DB_HOST = orionbarberia.database.windows.net
   DB_PORT = 1433
   DB_NAME = Orion
   DB_USER = orion@orionbarberia
   DB_PASSWORD = Medellin*2025$/
   JWT_SECRET = your_secret_key
   EMAIL_USER = barberiaorion2@gmail.com
   EMAIL_PASS = tlcv syma hyvg pzuu
   REACT_APP_GOOGLE_CLIENT_ID = 188110581981-qsaukgd7hcfeoedjummk0njn0if5kho2.apps.googleusercontent.com
   NODE_ENV = production
   ```

6. **Click en "Create Web Service"**

## Paso 4: Configurar Firewall de Azure SQL

Para que Render se conecte a tu base de datos Azure SQL:

1. **Ve a Azure Portal**: https://portal.azure.com
2. **Ve a tu base de datos SQL** (`Orion`)
3. **Click en "Networking"**
4. **En "Firewall rules"**:
   - Activa: **"Allow Azure services and resources to access this server"** ✅
   - Agrega regla temporal para Render:
     - **Rule name**: `Render`
     - **Start IP**: `0.0.0.0`
     - **End IP**: `255.255.255.255`
     - Click en **"OK"**
   - Click en **"Save"**

**Nota**: La regla `0.0.0.0 - 255.255.255.255` permite todas las IPs. Para producción, deberías obtener las IPs específicas de Render o usar solo "Allow Azure services".

## Paso 5: Verificar el Despliegue

1. **Render comenzará a construir** tu aplicación automáticamente
2. **Ve a "Logs"** en Render para ver el progreso
3. **Espera a que termine** (puede tomar 2-5 minutos)
4. **Tu API estará en**: `https://andromeda-api.onrender.com`

5. **Prueba la API**:
   - Abre: `https://andromeda-api.onrender.com`
   - Deberías ver: `{"message":"API BARBERIA ORION funcionando"}`

## Paso 6: Verificar que la Base de Datos se Creó

La API creará automáticamente todas las tablas cuando inicie por primera vez. Verifica en los logs:

```
Conexión a MSSQL establecida
Modelos sincronizados con la base de datos
Permisos inicializados correctamente
Roles inicializados correctamente
Rol Admin inicializado correctamente
Privilegios sembrados correctamente
PrivilegePermissionRoles sembrados correctamente
Usuario Admin inicializado correctamente
Servidor corriendo en el puerto 10000
Desplegado en Render.com
```

## 📋 Checklist Pre-Despliegue

- [ ] Código subido a GitHub
- [ ] `render.yaml` en el repositorio
- [ ] Variables de entorno configuradas en Render
- [ ] Firewall de Azure SQL configurado
- [ ] Web Service creado en Render

## 🔍 Ver Logs en Render

1. Ve a tu servicio en Render
2. Click en **"Logs"** (en el menú lateral)
3. Verás logs en tiempo real

## ⚙️ Configuración Actual

- **Runtime**: Node.js (automático)
- **Build Command**: `npm install`
- **Start Command**: `npm start` (ejecuta `node server.js`)
- **Puerto**: Render asigna automáticamente (process.env.PORT)
- **Base de Datos**: Azure SQL Database

## 💰 Planes de Render

- **Free**: 
  - ✅ Gratis
  - ⚠️ Se "duerme" después de 15 min de inactividad
  - ⚠️ Tarda ~30 seg en despertar
  - ✅ Perfecto para desarrollo/pruebas

- **Starter** ($7/mes):
  - ✅ Siempre activo
  - ✅ Mejor rendimiento
  - ✅ Para producción

## 🆘 Solución de Problemas

### Error de conexión a base de datos:
- Verifica que el firewall de Azure SQL permita conexiones
- Verifica las variables de entorno en Render
- Revisa los logs en Render

### Error 500:
- Revisa los logs en Render
- Verifica que todas las dependencias estén en package.json
- Verifica que las variables de entorno estén correctas

### La API no responde:
- Verifica que el servicio esté "Live" en Render
- Si está en Free tier, espera ~30 seg después de inactividad
- Revisa los logs

### Error de build:
- Verifica que `package.json` tenga todas las dependencias
- Revisa los logs de build en Render

## 🔄 Actualizar Código

Cada vez que hagas `git push` a GitHub, Render desplegará automáticamente:

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

Render detectará el cambio y desplegará automáticamente.

## 📝 Notas Importantes

1. **Free tier se duerme**: Si no hay tráfico por 15 min, el servicio se duerme. La primera petición después tarda ~30 seg en responder.

2. **Variables de entorno**: Si cambias variables de entorno, Render reiniciará el servicio automáticamente.

3. **Logs**: Los logs se mantienen por 7 días en el plan Free.

4. **Base de datos**: Tu base de datos Azure SQL está separada, así que los datos persisten aunque el servicio de Render se reinicie.

## ✅ ¡Listo!

Tu API estará disponible en: `https://andromeda-api.onrender.com`

Todas las rutas estarán disponibles:
- `https://andromeda-api.onrender.com/api/users`
- `https://andromeda-api.onrender.com/api/products`
- etc.

