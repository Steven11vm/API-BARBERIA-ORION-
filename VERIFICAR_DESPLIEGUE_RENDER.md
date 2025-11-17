# ✅ Verificar Despliegue en Render

## Estado Actual

Tu Blueprint está sincronizado correctamente:
- ✅ Repositorio: `Steven11vm / API-BARBERIA-ORION-`
- ✅ Rama: `main`
- ✅ Sync: `1d73630 : render3` (hace unos segundos)
- ✅ Estado: "Resources already up to date"

## Próximos Pasos

### 1. Verificar que el Servicio Esté Activo

1. En Render, ve a tu **Dashboard**
2. Busca el servicio **"andromeda-api"**
3. Verifica que el estado sea **"Live"** (círculo verde)

### 2. Verificar Variables de Entorno

1. Click en tu servicio **"andromeda-api"**
2. Ve a **"Environment"** en el menú lateral
3. Verifica que todas estas variables estén configuradas:

```
✅ DB_DIALECT = mssql
✅ DB_HOST = orionbarberia.database.windows.net
✅ DB_PORT = 1433
✅ DB_NAME = Orion
✅ DB_USER = orion@orionbarberia
✅ DB_PASSWORD = Medellin*2025$/
✅ JWT_SECRET = your_secret_key
✅ EMAIL_USER = barberiaorion2@gmail.com
✅ EMAIL_PASS = tlcv syma hyvg pzuu
✅ REACT_APP_GOOGLE_CLIENT_ID = 188110581981-qsaukgd7hcfeoedjummk0njn0if5kho2.apps.googleusercontent.com
✅ NODE_ENV = production
```

### 3. Ver Logs

1. Click en **"Logs"** en el menú lateral
2. Deberías ver algo como:

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

### 4. Probar la API

Tu API debería estar disponible en:
**`https://andromeda-api.onrender.com`**

Prueba en tu navegador:
- `https://andromeda-api.onrender.com`
- Deberías ver: `{"message":"API BARBERIA ORION funcionando"}`

### 5. Probar Endpoints

Prueba estos endpoints:

```bash
# Ruta principal
GET https://andromeda-api.onrender.com/

# Usuarios
GET https://andromeda-api.onrender.com/api/users

# Productos
GET https://andromeda-api.onrender.com/api/products

# Categorías
GET https://andromeda-api.onrender.com/api/categories
```

## 🔍 Solución de Problemas

### Si el servicio está "Sleeping" (plan Free):

El servicio se duerme después de 15 min de inactividad. La primera petición después puede tardar ~30 segundos.

**Solución**: 
- Espera ~30 seg después de hacer la primera petición
- O actualiza al plan Starter ($7/mes) para que esté siempre activo

### Si hay errores en los logs:

1. **Error de conexión a BD**:
   - Verifica que el firewall de Azure SQL permita conexiones
   - Verifica las variables de entorno

2. **Error 500**:
   - Revisa los logs completos
   - Verifica que todas las dependencias estén en package.json

3. **Error de build**:
   - Verifica que el código esté en GitHub
   - Revisa los logs de build

### Si necesitas hacer cambios:

1. Haz cambios en tu código local
2. Haz commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```
3. Render detectará el cambio y desplegará automáticamente
4. O haz click en **"Manual sync"** en el Blueprint

## 📝 Notas Importantes

- **Plan Free**: El servicio se duerme después de 15 min de inactividad
- **Despliegue automático**: Cada `git push` despliega automáticamente
- **Logs**: Disponibles en tiempo real en Render
- **Base de datos**: Se crea automáticamente al iniciar la API

## ✅ Checklist

- [ ] Servicio está "Live" en Render
- [ ] Variables de entorno configuradas
- [ ] Logs muestran conexión exitosa a BD
- [ ] API responde en la URL de Render
- [ ] Endpoints funcionan correctamente

## 🎉 ¡Listo!

Tu API está desplegada y funcionando en Render.

