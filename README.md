# Proyecto_Integrador

## Backend

El backend del proyecto está implementado en la carpeta Back y fue diseñado para exponer una API sencilla que permita autenticar usuarios, gestionar datos de sesión y preparar la conexión con una base de datos PostgreSQL.

### Funcionalidades actuales
- Autenticación de usuarios mediante login.
- Registro básico de usuarios.
- Consulta de información del usuario autenticado.
- Endpoints para obtener datos del dashboard según el rol del usuario.
- Configuración preparada para conectar con PostgreSQL.

### Estructura del backend

```text
Back/
│   .env
│   package-lock.json
│   package.json
│
└── src
    │   app.js
    │   server.js
    │
    ├── config
    │       database.js
    │
    ├── controllers
    │       auth.controller.js
    │       data.controller.js
    │
    ├── models
    ├── routes
    │       auth.routes.js
    │       data.routes.js
    │
    └── utils
```

### Descripción de carpetas
- `src/app.js`: configura la aplicación Express, middleware y rutas principales.
- `src/server.js`: inicia el servidor en el puerto configurado.
- `src/config/database.js`: gestiona la conexión a PostgreSQL.
- `src/controllers`: contiene la lógica de negocio para autenticación y datos.
- `src/routes`: define los endpoints expuestos por la API.
- `src/models`: espacio preparado para definir modelos de datos.
- `src/utils`: utilidades reutilizables.

### Variables de entorno
El backend espera variables como:
- `PORT`
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

### Ejecución
Desde la carpeta Back, puedes iniciar el servidor con:

```bash
npm start
```

### Endpoints principales
- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/auth/me`
- `GET /api/data/dashboard/:rol`
- `GET /api/data/sections/:rol/:seccion`

