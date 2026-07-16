const path = require('path');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

let pool;

async function connectDatabase() {
  if (pool) return pool;

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

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

  try {
    await pool.query('SELECT 1');
    return pool;
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error.message);
    throw error;
  }
}

module.exports = { connectDatabase };
