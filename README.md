# Zoe Care — Proyecto Integrador

Zoe Care es una plataforma web para apoyar la gestión y el seguimiento de pacientes. Cuenta con vistas para profesionales de salud y cuidadores, además de módulos de pacientes, citas, mensajes, resultados clínicos, medicación y novedades diarias.

El repositorio incluye un frontend tipo SPA y una API REST:

- `Front/Diseño_1`: interfaz desarrollada con HTML, CSS y JavaScript nativo.
- `Back`: API desarrollada con Node.js y Express.

## Características

- Inicio de sesión y registro de usuarios.
- Autenticación mediante token Bearer y consulta del perfil autenticado.
- Paneles y secciones diferenciados por rol: `profesional` y `cuidador`.
- Conexión opcional a PostgreSQL/Supabase para usuarios.
- Modo de respaldo en memoria si no se configura una base de datos.
- Inicio coordinado del frontend y backend desde un único comando.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior.
- Un navegador web moderno.
- Opcional: Docker Desktop o una instancia PostgreSQL/Supabase.

## Inicio rápido

Desde la raíz del proyecto, instala las dependencias y ejecuta la aplicación:

```bash
npm install
npm start
```

El comando inicia ambos servicios y abre la aplicación en el navegador.

| Servicio | Dirección |
| --- | --- |
| Frontend | `http://127.0.0.1:5500/` |
| Backend | `http://127.0.0.1:3001/health` |

Para detener los servicios, usa `Ctrl + C` en la terminal.

> Si el puerto `5500` ya está ocupado, el servidor del frontend intenta usar el siguiente puerto disponible. En ese caso, consulta la URL mostrada en la terminal.

## Cuentas de demostración

Cuando no hay una base de datos configurada, puedes acceder con estas cuentas:

| Rol | Correo | Contraseña |
| --- | --- | --- |
| Profesional | `profesional@zoecare.com` | `1234` |
| Cuidador | `cuidador@zoecare.com` | `1234` |

## Configuración de base de datos

La aplicación funciona sin base de datos, usando datos en memoria. Para conectar PostgreSQL o Supabase, crea un archivo `.env` en la **raíz** del repositorio (no dentro de `Back`) y usa una de estas alternativas.

Con una cadena de conexión:

```env
DB_URL=postgresql://<usuario>:<contraseña>@<host>:<puerto>/<base_de_datos>
```

Con variables individuales:

```env
DB_HOST=<host>
DB_PORT=5432
DB_USER=<usuario>
DB_PASSWORD=<contraseña>
DB_NAME=postgres
```

Para Supabase, copia los valores de conexión desde el panel del proyecto. La conexión mediante `DB_URL` utiliza SSL automáticamente.

También hay una configuración de PostgreSQL local en `Back/database/docker-compose.yml`:

```bash
cd Back/database
docker compose up -d
```

Los scripts del esquema se encuentran en `Back/database/scripts/tables/`.

> No subas `.env`, contraseñas ni cadenas de conexión al repositorio.

## Endpoints principales

| Método | Ruta | Descripción |
| --- | --- | --- |
| `GET` | `/health` | Estado de la API y de la conexión a base de datos. |
| `POST` | `/api/auth/login` | Inicia sesión. |
| `POST` | `/api/auth/register` | Registra un usuario. |
| `GET` | `/api/auth/me` | Devuelve el usuario asociado a un token Bearer. |
| `GET` | `/api/data/dashboard/:rol` | Obtiene el panel para un rol. |
| `GET` | `/api/data/sections/:rol/:seccion` | Obtiene una sección del panel. |

Ejemplo de inicio de sesión:

```bash
curl -X POST http://127.0.0.1:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"profesional@zoecare.com","password":"1234"}'
```

## Estructura del proyecto

```text
Proyecto_Integrador/
├── Back/
│   ├── database/                 # Docker y scripts SQL
│   └── src/
│       ├── config/               # Configuración de PostgreSQL
│       ├── controllers/          # Lógica de autenticación y datos
│       ├── routes/               # Rutas de la API
│       ├── app.js
│       └── server.js
├── Front/Diseño_1/
│   ├── server.js                 # Servidor estático del frontend
│   └── src/
│       ├── components/
│       ├── services/             # Consumo de la API
│       ├── views/
│       └── index.html
└── tools/run-all.js              # Lanzador de ambos servicios
```
