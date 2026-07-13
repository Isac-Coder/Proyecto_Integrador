const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { Pool } = require('pg');

let pool;

async function connectDatabase() {
  if (pool) return pool;

  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

  if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.warn('⚠️  La conexión a la base de datos no está configurada completamente. Se usará el modo de respaldo en memoria.');
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
    connectionTimeoutMillis: 2000
  });

  await pool.query('SELECT 1');
  return pool;
}

module.exports = { connectDatabase };
