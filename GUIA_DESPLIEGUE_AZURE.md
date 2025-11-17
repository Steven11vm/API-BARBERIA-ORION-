# Guía para Desplegar API en Azure App Service

## Paso 1: Preparar el Código

✅ Ya tienes todo listo:
- `server.js` configurado correctamente
- `package.json` con todas las dependencias
- `.env` actualizado con valores de Azure SQL

## Paso 2: Crear App Service en Azure Portal

1. **Ve a Azure Portal**: https://portal.azure.com

2. **Crear nuevo recurso**:
   - Click en "Create a resource"
   - Busca "Web App"
   - Click en "Create"

3. **Configurar App Service**:
   - **Subscription**: Tu suscripción
   - **Resource Group**: `Orion` (o el que ya tienes)
   - **Name**: `andromeda-api` (debe ser único, Azure te dirá si está disponible)
   - **Publish**: Code
   - **Runtime stack**: Node 18 LTS o Node 20 LTS
   - **Operating System**: Linux (recomendado) o Windows
   - **Region**: Mexico Central (misma que tu base de datos)
   - **App Service Plan**: 
     - Si es la primera vez, crea uno nuevo (Free tier disponible)
     - O usa uno existente

4. **Click en "Review + create"** → **"Create"**

## Paso 3: Configurar Variables de Entorno en Azure

1. **Ve a tu App Service creado**

2. **En el menú lateral, busca "Configuration"** → **"Application settings"**

3. **Agrega estas variables** (click en "+ New application setting" para cada una):

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

4. **Click en "Save"** (arriba)

## Paso 4: Configurar Firewall de Azure SQL

1. **Ve a tu base de datos SQL** (`Orion`)
2. **Click en "Networking"**
3. **En "Firewall rules"**:
   - Activa "Allow Azure services and resources to access this server" ✅
   - Esto permite que tu App Service se conecte automáticamente

## Paso 5: Desplegar el Código

### Opción A: Desde GitHub (Recomendado)

1. **Sube tu código a GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin [tu-repositorio-github]
   git push -u origin main
   ```

2. **En Azure Portal**:
   - Ve a tu App Service
   - Click en "Deployment Center"
   - Selecciona "GitHub" como fuente
   - Autoriza Azure a acceder a tu GitHub
   - Selecciona tu repositorio y rama (main)
   - Click en "Save"

3. **Azure desplegará automáticamente** cada vez que hagas push

### Opción B: Desde Visual Studio Code (Más fácil)

1. **Instala la extensión "Azure App Service"** en VS Code

2. **Login en Azure**:
   - Click en el ícono de Azure en la barra lateral
   - Click en "Sign in to Azure"

3. **Desplegar**:
   - Click derecho en tu carpeta del proyecto
   - Selecciona "Deploy to Web App"
   - Selecciona tu App Service creado
   - Espera a que termine el despliegue

### Opción C: Desde Azure CLI

1. **Instala Azure CLI**: https://aka.ms/installazurecliwindows

2. **Login**:
   ```bash
   az login
   ```

3. **Desplegar**:
   ```bash
   az webapp up --name andromeda-api --resource-group Orion --runtime "NODE:18-lts"
   ```

## Paso 6: Verificar el Despliegue

1. **Ve a tu App Service** en Azure Portal
2. **Click en "Overview"**
3. **Busca la URL**: `https://andromeda-api.azurewebsites.net`
4. **Abre la URL en tu navegador**
5. **Deberías ver**: `{"message":"API BARBERIA ORION funcionando"}`

## Paso 7: Ver Logs (Si hay problemas)

1. **En Azure Portal** → Tu App Service
2. **Click en "Log stream"** (en el menú lateral)
3. **Verás los logs en tiempo real**

## Comandos Útiles

### Ver logs desde Azure CLI:
```bash
az webapp log tail --name andromeda-api --resource-group Orion
```

### Reiniciar App Service:
```bash
az webapp restart --name andromeda-api --resource-group Orion
```

## Solución de Problemas

### Error de conexión a base de datos:
- Verifica que el firewall de Azure SQL permita servicios de Azure
- Verifica las variables de entorno en Configuration

### Error 500:
- Revisa los logs en "Log stream"
- Verifica que todas las dependencias estén en package.json

### La API no inicia:
- Verifica que el comando start en package.json sea correcto: `"start": "node server.js"`

## Costos

- **Free Tier**: Disponible para pruebas (con limitaciones)
- **Basic Tier**: Desde ~$13 USD/mes (más recursos)
- **Consumption Plan**: Paga por uso (más económico para APIs)

## ¡Listo! 🎉

Tu API estará disponible en: `https://tu-app-service.azurewebsites.net`

