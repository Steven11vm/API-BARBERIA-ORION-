# ✅ Variables Finales para Render

## 🔍 Configuración Correcta

Tu base de datos se llama **`AndromedaBD`** (con "BD" al final).

## ✅ Variables para Render

Ve a **Render** → Tu servicio → **"Environment"** y configura estas variables:

```
DB_DIALECT = mssql

DB_HOST = orionbarberia.database.windows.net

DB_PORT = 1433

DB_NAME = AndromedaBD
(IMPORTANTE: "AndromedaBD" con "BD" al final, no "DB")

DB_USER = orion
(IMPORTANTE: Solo "orion", sin @orionbarberia para SQL auth)

DB_PASSWORD = Medellin*2025$/
(Exactamente así, sin espacios, sin comillas)

JWT_SECRET = your_secret_key

EMAIL_USER = barberiaorion2@gmail.com

EMAIL_PASS = tlcv syma hyvg pzuu

REACT_APP_GOOGLE_CLIENT_ID = 188110581981-qsaukgd7hcfeoedjummk0njn0if5kho2.apps.googleusercontent.com

NODE_ENV = production
```

## ✅ Checklist

- [ ] `DB_NAME = AndromedaBD` (con "BD" al final)
- [ ] `DB_USER = orion` (solo "orion")
- [ ] `DB_PASSWORD = Medellin*2025$/` (exactamente así)
- [ ] Todas las demás variables configuradas
- [ ] Cambios guardados en Render
- [ ] Servicio reiniciado
- [ ] Logs revisados

## 🎯 Después de Configurar

1. **Guarda** los cambios en Render
2. **Espera** 1-2 minutos
3. **Revisa los logs** - deberías ver:
   ```
   ✅ Conexión a MSSQL exitosa con SQL auth
   Conexión a MSSQL establecida
   Modelos sincronizados con la base de datos
   ```

¡Asegúrate de que `DB_NAME = AndromedaBD` (con "BD")! 🚀

