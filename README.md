# 🚀 ZOE-CARE (HealthTech SPA)

**ZOE-CARE** es una plataforma web Full-Stack modular bajo una arquitectura de *Single Page Application* (SPA) diseñada para centralizar, organizar y proteger la información clínica y operativa de pacientes con enfermedades prolongadas en el hogar. El sistema mitiga el error humano en la administración de tratamientos y reduce drásticamente el Síndrome de Burnout del Cuidador mediante una sincronización de roles en tiempo real.

---

## 📋 Índice
1. [Problema Identificado](#-problema-identificado)
2. [Objetivos del Sistema](#-objetivos-del-sistema)
3. [Alcance y Módulos del MVP](#-alcance-y-módulos-del-mvp)
4. [Arquitectura de la Solución](#%EF%B8%8F-arquitectura-de-la-solución)
5. [Estructura del Proyecto](#-estructura-del-proyecto)
6. [Modelo de Datos (PostgreSQL)](#-modelo-de-datos-postgresql)
7. [Endpoints de la API](#-endpoints-de-la-api)
8. [Instrucciones de Configuración y Ejecución](#-instrucciones-de-configuración-y-ejecución)
9. [Gestión Ágil (Scrumban)](#-gestión-ágil-scrumban)

---

## 🚨 Problema Identificado
En Colombia, más de 3 millones de personas gestionan enfermedades prolongadas en el hogar de manera aislada y desorganizada. La fragmentación de la información médica sensible (recetas en papel, chats de WhatsApp, cuadernos físicos) destruye la estabilidad emocional del núcleo familiar. El **67% de los errores de medicación** en casa ocurren por la confusión de horarios y la falta de un canal unificado entre profesionales y cuidadores, detonando el Síndrome de Burnout del Cuidador y situaciones de pánico prevenibles.

---

## 🎯 Objetivos del Sistema

*   **Control de Acceso Basado en Roles (RBAC):** Segmentación precisa de permisos de visualización, creación y edición de datos clínicos según el perfil de usuario.
*   **Base de Datos Relacional Robusta:** Integridad referencial estricta en PostgreSQL para resguardar de forma segura los historiales médicos, bitácoras y dosis.
*   **API REST Segura:** Comunicación desacoplada bajo el patrón Controlador-Ruta utilizando variables de entorno protegidas.
*   **Dashboard Reactivo:** Visualización inmediata de constantes vitales y seguimiento automatizado de pautas de dosificación de medicamentos.

---

## 📦 Alcance y Módulos del MVP
El Producto Mínimo Viable comprende el despliegue funcional de 6 módulos de negocio síncronos que operan de forma coordinada:
1.  **Dashboard del Paciente:** Monitoreo gráfico de constantes vitales clave (niveles de glucosa y presión arterial).
2.  **Módulo de Administración de Pacientes:** Registro de datos maestros y vinculación de encargados médicos o familiares.
3.  **Agenda y Recordatorios:** Calendario basado en eventos críticos para dosificación horaria de medicamentos y citas.
4.  **Registro Diario de Síntomas / Bitácora:** Captura de cambios clínicos y observaciones en tiempo real desde el hogar.
5.  **Historial Médico Consultable:** Repositorio centralizado de exámenes, diagnósticos previos y recetas emitidas.
6.  **Configuración de Perfil:** Gestión de credenciales y seguridad de los accesos al sistema.

---

## 🛠️ Arquitectura de la Solución

### Frontend (Client Side)
*   **Tecnologías:** HTML5, CSS3 y JavaScript Moderno (Vanilla JS).
*   **Flujo:** Arquitectura SPA dinámica y responsiva que realiza peticiones asíncronas HTTP (`Fetch`/`Axios`) para actualizar el DOM en tiempo real sin recargar la página, optimizando las consultas críticas en emergencias.

### Backend (Server Side)
*   **Tecnologías:** Node.js y Framework Express.
*   **Modo Respaldo:** El servidor está configurado para ejecutarse en el puerto `3001` y operar en modo respaldo (*fallback*) con datos simulados si la base de datos PostgreSQL no se encuentra disponible.

---

## 📂 Estructura del Proyecto

```text
ZOE-CARE/
│   package.json          # Configuración del script unificado de arranque
│
├── Back/                 # Servidor API REST
│   ├── .env              # Variables de entorno protegidas (Configurar localmente)
│   ├── package.json
│   └── src/
│       ├── app.js        # Configuración Express, middlewares y rutas principales
│       ├── server.js     # Inicialización del servidor (Puerto 3001)
│       ├── config/
│       │   └── database.js  # Pool de conexiones a PostgreSQL y modo fallback
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   └── data.controller.js
│       ├── models/       # Espacio preparado para modelos de persistencia
│       ├── routes/
│       │   ├── auth.routes.js
│       │   └── data.routes.js
│       └── utils/        # Utilidades reutilizables del sistema
│
├── Front/                # Aplicación Cliente (SPA)
│   └── Diseño_1/
│       ├── package.json
│       ├── server.js     # Servidor Frontend en Node.js
│       └── src/
│           ├── index.html # Punto de entrada único de la SPA
│           ├── services/
│           │   └── auth.services.js # Cliente API (Apunta a http://127.0.0)
│           └── views/    # Vistas dinámicas e interactivas cargadas por DOM
│               ├── loginView.js
│               ├── registerView.js
│               ├── homeView.js
│               ├── cuidadorView.js
│               └── medicoView.js
│
└── tools/
    └── run-all.js        # Lanzador coordinado y simultáneo de Front y Back
```

---

## 🗄️ Modelo de Datos (PostgreSQL)
La persistencia de datos asegura la integridad transaccional (ACID) y evita registros huérfanos mediante 12 tablas estructuradas de forma lógica:
*   `usuarios_sistema.sql`: Credenciales, estados de cuenta y roles (RBAC).
*   `encargados_o_cuidadores.sql`: Datos del responsable del paciente (vínculo con rol).
*   `profecionales.sql`: Registro maestro del personal médico/enfermería validado.
*   `pacientes.sql`: Entidad pivote central con la información base del afectado.
*   `estado_pacientes.sql`: Monitoreo periódico de métricas y constantes vitales (tensión, glucosa).
*   `medicamentos_paciente.sql`: Relación de dosis, frecuencias, fármacos y alertas de la agenda.
*   `agendamiento_citas.sql`: Gestión de controles médicos y visitas de enfermería.
*   `bitacoras.sql`: Diario clínico de síntomas detectados en el hogar.
*   `atencion_clinica.sql`: Registro oficial de consultas o intervenciones ejecutadas.
*   `observaciones_clinicas.sql`: Notas aclaratorias y seguimientos especializados por parte del médico.
*   `examenes_pacientes.sql`: Repositorio de analíticas de laboratorio y diagnósticos por imagen.
*   `asistencia_pacientes.sql`: Control logístico de visitas del personal médico domiciliario.

---

## 🛣️ Endpoints de la API

| Método | Endpoint | Descripción | Acceso (RBAC) |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/login` | Autenticación de usuarios y generación de sesión | Público |
| **POST** | `/api/auth/register` | Registro básico de nuevos usuarios en el sistema | Público |
| **GET** | `/api/auth/me` | Consulta información del usuario autenticado | Sesión activa |
| **GET** | `/api/data/dashboard/:rol` | Obtiene los datos reactivos del panel según el rol | Cuidador / Médico |
| **GET** | `/api/data/sections/:rol/:seccion` | Acceso dinámico a las secciones del negocio | Controlado por Rol |

---

## ⚙️ Instrucciones de Configuración y Ejecución

Sigue estos pasos en orden para clonar, instalar e iniciar todo el ecosistema de **ZOE-CARE** en tu máquina local.

### 1. Requisitos Previos
Asegúrate de tener instalado en tu sistema:
*   **Node.js** (Versión LTS recomendada)
*   **npm** (Incluido automáticamente con Node.js)
*   **PostgreSQL** (Opcional, el backend cuenta con modo *fallback* de respaldo si decides evaluar la interfaz sin base de datos local).

### 2. Clonar e Instalar Dependencias
Debido a que el proyecto está modularizado, debes instalar los paquetes de Node en cada una de las carpetas de los componentes. Ejecuta en tu terminal:

```bash
# 1. Clonar el repositorio
git clone https://github.com
cd ZOE-CARE

# 2. Instalar dependencias del Backend
cd Back
npm install
cd ..

# 3. Instalar dependencias del Frontend
cd Front/Diseño_1
npm install
cd ../..
```

### 3. Configurar el Entorno (Backend)
El servidor backend requiere conocer los parámetros de conexión. 
1. Dirígete a la carpeta `Back/`.
2. Crea un archivo llamado `.env`.
3. Agrega el siguiente bloque de código configurando tus credenciales de PostgreSQL locales:

```env
PORT=3001
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=tu_usuario_postgres
DB_PASSWORD=tu_contraseña_postgres
DB_NAME=zoe_care_db
```
*(Nota: Si no conectas una base de datos activa, los scripts de `database.js` lo detectarán automáticamente y permitirán que la aplicación corra en modo de respaldo interactivo).*

### 4. Lanzamiento con Comando Único (Raíz)
Ya no es necesario abrir múltiples terminales para levantar el Frontend y el Backend por separado. Regresa a la **carpeta raíz del proyecto** (`ZOE-CARE/`) y arranca el lanzador coordinado:

```bash
npm start
```

Este comando invocará el archivo automatizado `tools/run-all.js`, el cual se encargará de inicializar el servidor de la API REST y, de forma integrada, el servidor local para la SPA del frontend.

### 🌐 Verificación de Servicios y URLs
Una vez iniciado con éxito, abre tu navegador web y comprueba el despliegue ingresando a:

*   **⚡ Interfaz Web (Frontend SPA):** [http://127.0.0](http://127.0.0)
*   **🩺 Estado del Backend (Health Check):** [http://127.0.0](http://127.0.0)
*   **🔌 Endpoint Base de la API:** `http://127.0.0`

---

## 👥 Gestión Ágil (Scrumban)
El proyecto se ejecutó bajo el marco híbrido Scrumban, combinando la estructura por Sprints de alta intensidad de Scrum con la flexibilidad de flujo visual de Kanban. Esto permitió priorizar las historias de usuario críticas (como la Gestión de Medicación sin Errores y el Control de Acceso con Permisos Estrictos RBAC) para garantizar un MVP estable enfocado en la entrega continua y el despliegue seguro.
## 👥 Equipo Desarrollador

Este proyecto fue diseñado, estructurado y desarrollado con pasión por:

*   Sebastian Ortiz - Scrum Master
*   Isac Alvarez] - Backend  / Database
*   Alejandra Jimenez - Frontend / UI Design*
*   Juan Bolivar  - Data Analist
*   Luis Medrano- Backend / Database 
*   Maryuris Aragon - *Frontend  / UI Design* 

---
ZOE-CARE - Solución tecnológica desarrollada en el marco del Proyecto Integrador - RIWI 2026.
