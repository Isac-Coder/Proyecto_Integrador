# Zoe Care — Proyecto Integrador

Zoe Care es una plataforma web orientada a apoyar la gestión de la atención y el seguimiento de pacientes. Ofrece vistas diferenciadas para profesionales de la salud y cuidadores, con secciones para consultar pacientes, citas, mensajes, resultados clínicos, medicación y novedades diarias.

El proyecto se divide en dos partes:

- `Front/Diseño_1`: interfaz web tipo SPA construida con HTML, CSS y JavaScript nativo.
- `Back`: API REST construida con Node.js y Express, encargada de la autenticación y de servir los datos consumidos por el frontend.

## Funcionalidades disponibles

- Inicio de sesión y registro de usuarios.
- Consulta del usuario autenticado mediante token.
- Información de paneles y secciones según el rol (`profesional` o `cuidador`).
- Endpoint de salud para comprobar el estado de la API y la conexión con la base de datos.

Para pruebas locales se incluyen estas cuentas de demostración:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Profesional | `profesional@zoecare.com` | `1234` |
| Cuidador | `cuidador@zoecare.com` | `1234` |

> Actualmente, la autenticación y los datos mostrados por los paneles se gestionan en memoria en el backend. La conexión PostgreSQL está preparada, pero estas rutas todavía no realizan consultas a la base de datos.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior (incluye `npm`).
- Un navegador web moderno.
- Opcional: Docker Desktop, si se desea levantar PostgreSQL localmente.

## Instalación y ejecución local

1. Clona el repositorio y entra en su carpeta:

   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd Proyecto_Integrador
   ```

2. Instala las dependencias del backend:

   ```bash
   cd Back
   npm install
   ```

3. Crea el archivo `Back/.env` con la siguiente configuración. El puerto debe ser `3001`, porque es el puerto configurado actualmente en los servicios del frontend:

   ```env
   PORT=3001
   DB_HOST=<host_de_postgresql>
   DB_PORT=5432
   DB_USER=<usuario>
   DB_PASSWORD=<contraseña>
   DB_NAME=postgres
   ```

   Si aún no vas a conectar la base de datos, puedes dejar fuera las variables `DB_*`. La API iniciará en modo de respaldo en memoria.

4. Inicia el backend:

   ```bash
   npm start
   ```

   Comprueba que funciona visitando `http://localhost:3001/health`. La respuesta indicará si la base de datos está `conectada` o si está en `modo respaldo`.

5. En otra terminal, vuelve a la raíz del repositorio y sirve los archivos estáticos del frontend. Por ejemplo, con Python:

   ```bash
   cd ..
   python -m http.server 8080
   ```

6. Abre en el navegador:

   ```text
   http://localhost:8080/Front/Diseño_1/src/index.html
   ```

   También puede utilizarse cualquier servidor estático equivalente (por ejemplo, la extensión Live Server de VS Code). No se debe abrir `index.html` directamente con `file://`, ya que los módulos JavaScript requieren un servidor HTTP.

## Base de datos en Supabase

La base de datos PostgreSQL de Zoe Care fue desplegada en **Supabase**. Los scripts con la estructura de las tablas se conservan en `Back/database/scripts/tables/` como referencia y respaldo del esquema.

Para conectar el backend local con la base de datos desplegada, obtén en el panel de Supabase los datos de conexión de PostgreSQL e introdúcelos en `Back/.env`:

```env
DB_HOST=db.<project-ref>.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<contraseña-de-la-base-de-datos>
DB_NAME=postgres
```

No subas el archivo `.env` ni contraseñas o cadenas de conexión al repositorio. Si se utiliza la conexión agrupada (pooler) proporcionada por Supabase, emplea exactamente el host, puerto y usuario indicados en su panel.

Como alternativa para desarrollo sin Supabase, hay una definición de PostgreSQL local en `Back/database/docker-compose.yml`:

```bash
cd Back/database
docker compose up -d
```

Después de iniciar PostgreSQL localmente, ajusta las variables `DB_*` de `Back/.env` con los valores definidos en ese archivo. Los scripts SQL pueden ejecutarse desde el editor SQL de Supabase o mediante una herramienta compatible con PostgreSQL, respetando las dependencias entre tablas.

## Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/health` | Estado del backend y de la base de datos. |
| `POST` | `/api/auth/login` | Inicia sesión. |
| `POST` | `/api/auth/register` | Registra un usuario de demostración. |
| `GET` | `/api/auth/me` | Consulta el usuario asociado a un token Bearer. |
| `GET` | `/api/data/dashboard/:rol` | Obtiene el panel por rol. |
| `GET` | `/api/data/sections/:rol/:seccion` | Obtiene una sección concreta del panel. |

## Estructura relevante

```text
Proyecto_Integrador/
├── Back/
│   ├── database/
│   │   ├── docker-compose.yml
│   │   └── scripts/tables/       # Esquema SQL de PostgreSQL/Supabase
│   └── src/
│       ├── config/database.js    # Conexión a PostgreSQL
│       ├── controllers/          # Lógica de autenticación y datos
│       ├── routes/               # Rutas de la API
│       ├── app.js
│       └── server.js
└── Front/Diseño_1/src/
    ├── components/
    ├── controllers/
    ├── services/                 # Consumo de la API local
    ├── styles/
    ├── views/
    └── index.html
```
