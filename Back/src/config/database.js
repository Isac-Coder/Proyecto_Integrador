const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

// Carga las credenciales desde el archivo .env situado en la raíz del repositorio.
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

// El pool se crea una sola vez y se reutiliza entre solicitudes.
let pool;

/** Crea o devuelve el pool de PostgreSQL configurado para la aplicación. */
async function connectDatabase() {
  if (pool) return pool;

  const { DB_URL, DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  // DB_URL se usa para proveedores administrados como Supabase.
  if (DB_URL) {
    pool = new Pool({
      connectionString: DB_URL,
      ssl: { rejectUnauthorized: false },
      family: 4,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    });
  } else {
    // Sin parámetros mínimos, las rutas pueden operar en modo de respaldo.
    if (!DB_HOST || !DB_USER || !DB_NAME) {
      console.warn('La conexión a la base de datos no está configurada completamente. Se usará el modo de respaldo en memoria.');
      return null;
    }

    pool = new Pool({
      host: DB_HOST,
      port: DB_PORT ? Number(DB_PORT) : 5432,
      user: DB_USER,
      password: DB_PASSWORD || '',
      database: DB_NAME,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
      ssl: false
    });
  }

  // Se prueba la conexión antes de entregar el pool al resto de la aplicación.
  try {
    await pool.query('SELECT 1');
    return pool;
  } catch (error) {
    console.error('Error al conectar con PostgreSQL/Supabase:', error.message);
    throw error;
  }
}

// Punto único de acceso a la conexión para controladores y health check.
module.exports = { connectDatabase };
