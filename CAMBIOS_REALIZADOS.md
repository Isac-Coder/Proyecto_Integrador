# Cambios realizados en el proyecto

## 1. Ejecución única del proyecto

Se añadió un comando único desde la raíz para levantar backend y frontend con una sola orden:

```bash
npm start
```

### Implementación
- Se creó el archivo [tools/run-all.js](tools/run-all.js)
- Se configuró el script en [package.json](package.json)

Este lanzador inicia el backend y el frontend de forma coordinada.

## 2. Servidor frontend en Node.js

 en Node.js.

### Archivos añadidos
- [Front/Diseño_1/server.js](Front/Diseño_1/server.js)
- [Front/Diseño_1/package.json](Front/Diseño_1/package.json)


## 3. Ajuste de rutas del frontend

Se corrigieron las rutas estáticas del frontend para que funcionen cuando la aplicación se sirve desde la carpeta [Front/Diseño_1/src](Front/Diseño_1/src).

### Archivos modificados
- [Front/Diseño_1/src/index.html](Front/Diseño_1/src/index.html)
- [Front/Diseño_1/src/views/loginView.js](Front/Diseño_1/src/views/loginView.js)
- [Front/Diseño_1/src/views/registerView.js](Front/Diseño_1/src/views/registerView.js)
- [Front/Diseño_1/src/views/homeView.js](Front/Diseño_1/src/views/homeView.js)
- [Front/Diseño_1/src/views/cuidadorView.js](Front/Diseño_1/src/views/cuidadorView.js)
- [Front/Diseño_1/src/views/medicoView.js](Front/Diseño_1/src/views/medicoView.js)

## 4. Conexión frontend-backend

Se ajustó la URL de la API del frontend para que funcione correctamente desde el navegador.

### Archivo modificado
- [Front/Diseño_1/src/services/auth.services.js](Front/Diseño_1/src/services/auth.services.js)

Ahora el frontend apunta al backend en:

```text
http://127.0.0.1:3001/api
```

## 5. Backend

Se dejó el backend preparado para responder en el puerto 3001 y para funcionar en modo respaldo si no hay base de datos configurada.

### Archivo modificado
- [Back/src/server.js](Back/src/server.js)
- [Back/src/config/database.js](Back/src/config/database.js)

## 6. Cómo ejecutar el proyecto

Desde la raíz del proyecto:

```bash
npm start
```

### URLs disponibles
- Frontend: http://127.0.0.1:5500/
- Backend: http://127.0.0.1:3001/health
