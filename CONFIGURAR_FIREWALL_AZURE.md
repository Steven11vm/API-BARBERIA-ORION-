# 🔥 Configurar Firewall de Azure SQL Database para Render

## ⚠️ Error Actual

El firewall de Azure SQL está bloqueando la conexión desde Render:
- **IP de Render**: `74.220.48.248`
- **Error**: "Client with IP address '74.220.48.248' is not allowed to access the server"

## ✅ Solución: Configurar Firewall en Azure Portal

### Opción 1: Permitir Servicios de Azure (Recomendado) ⭐

Esta es la forma más fácil y segura:

1. **Ve a Azure Portal**: https://portal.azure.com

2. **Ve a tu base de datos SQL**:
   - Busca "SQL databases" en el buscador
   - Click en tu base de datos `Orion`

3. **Configurar Firewall**:
   - En el menú lateral, click en **"Networking"** o **"Firewall rules"**
   - Busca la sección **"Firewall rules"**

4. **Activar acceso desde Azure**:
   - ✅ **Marca la casilla**: **"Allow Azure services and resources to access this server"**
   - Esto permite que cualquier servicio de Azure (incluyendo Render si está en Azure) se conecte

5. **Agregar IP de Render** (si la opción anterior no funciona):
   - Click en **"+ Add client IP"** o **"Add firewall rule"**
   - **Rule name**: `Render`
   - **Start IP address**: `74.220.48.248`
   - **End IP address**: `74.220.48.248`
   - Click en **"OK"**

6. **Click en "Save"** (arriba)

7. **Espera 2-5 minutos** para que los cambios se apliquen

### Opción 2: Permitir Todas las IPs (Solo para Desarrollo) ⚠️

**ADVERTENCIA**: Esto permite acceso desde cualquier IP. Solo úsalo para desarrollo.

1. En **"Firewall rules"**, agrega una regla:
   - **Rule name**: `AllowAll`
   - **Start IP address**: `0.0.0.0`
   - **End IP address**: `255.255.255.255`
   - Click en **"OK"**

2. **Click en "Save"**

### Opción 3: Obtener IPs de Render (Para Producción)

Render puede usar múltiples IPs. Para obtenerlas:

1. Ve a: https://render.com/docs/static-outbound-ip-addresses
2. Agrega todas las IPs de Render a las reglas de firewall

## 📋 Pasos Detallados (Paso a Paso)

### Paso 1: Acceder a Azure Portal
1. Abre: https://portal.azure.com
2. Inicia sesión con tu cuenta

### Paso 2: Encontrar tu Base de Datos
1. En el buscador superior, escribe: `SQL databases`
2. Click en "SQL databases"
3. Busca y click en tu base de datos: `Orion`

### Paso 3: Configurar Firewall
1. En el menú lateral izquierdo, busca y click en:
   - **"Networking"** (si está disponible)
   - O **"Firewall rules"** (si está disponible)
   - O **"Security"** → **"Networking"**

2. Verás una sección llamada **"Firewall rules"**

### Paso 4: Agregar Regla para Render
1. Click en **"+ Add client IP"** o **"Add firewall rule"**
2. Completa el formulario:
   ```
   Rule name: Render
   Start IP address: 74.220.48.248
   End IP address: 74.220.48.248
   ```
3. Click en **"OK"**

### Paso 5: Activar Servicios de Azure
1. Busca la opción: **"Allow Azure services and resources to access this server"**
2. ✅ **Marca la casilla**
3. Esto permite conexiones desde servicios de Azure

### Paso 6: Guardar Cambios
1. Click en **"Save"** (botón en la parte superior)
2. Espera a que aparezca el mensaje de confirmación

### Paso 7: Esperar
- Los cambios pueden tardar **2-5 minutos** en aplicarse
- No cierres la ventana hasta ver el mensaje de confirmación

## 🔍 Verificar que Funcionó

1. **Espera 2-5 minutos** después de guardar
2. **Ve a Render** → Tu servicio → **"Logs"**
3. **Reinicia el servicio** en Render (si es necesario):
   - Click en **"Manual Deploy"** → **"Deploy latest commit"**
4. **Revisa los logs** - deberías ver:
   ```
   Conexión a MSSQL establecida ✅
   Modelos sincronizados con la base de datos
   ```

## 🆘 Si Aún No Funciona

### Verificar Variables de Entorno en Render:
1. Ve a Render → Tu servicio → **"Environment"**
2. Verifica que estas variables estén correctas:
   ```
   DB_HOST = orionbarberia.database.windows.net
   DB_USER = orion@orionbarberia
   DB_PASSWORD = Medellin*2025$/
   ```

### Verificar en Azure SQL:
1. Ve a Azure Portal → Tu servidor SQL (`orionbarberia`)
2. Verifica que el firewall esté configurado correctamente
3. Asegúrate de que la regla esté **guardada** (no solo agregada)

### Obtener IP Actual de Render:
Si Render cambia de IP, puedes verla en los logs de error. Siempre será diferente, así que es mejor usar la opción de "Allow Azure services".

## ✅ Checklist

- [ ] Firewall configurado en Azure Portal
- [ ] Regla agregada para IP de Render (74.220.48.248)
- [ ] "Allow Azure services" activado
- [ ] Cambios guardados en Azure
- [ ] Esperado 2-5 minutos
- [ ] Servicio reiniciado en Render
- [ ] Logs muestran conexión exitosa

## 📝 Nota Importante

**IPs Dinámicas de Render**: 
- Render puede usar diferentes IPs en cada despliegue
- Por eso es mejor usar "Allow Azure services" o agregar un rango de IPs
- Para producción, considera usar un servicio de Azure directamente

## 🎯 Solución Rápida (Recomendada)

1. Azure Portal → Tu base de datos SQL → **"Networking"**
2. ✅ Marca: **"Allow Azure services and resources to access this server"**
3. Click en **"Save"**
4. Espera 2-5 minutos
5. Reinicia el servicio en Render

¡Esto debería resolver el problema! 🚀

