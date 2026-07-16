const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

(async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.usuarios_sistema (
        id_usuario SERIAL PRIMARY KEY,
        correo_electronico TEXT NOT NULL UNIQUE,
        contrasena_hash TEXT NOT NULL,
        rol VARCHAR(30) NOT NULL,
        id_profecional INTEGER,
        ultimo_acceso DATE
      )
    `);

    const res = await client.query(
      'INSERT INTO public.usuarios_sistema (correo_electronico, contrasena_hash, rol, ultimo_acceso) VALUES ($1, $2, $3, CURRENT_DATE) RETURNING id_usuario, correo_electronico, rol',
      ['anual@zoecare.com', 'hash', 'Cuidador']
    );
    console.log(JSON.stringify(res.rows));
  } catch (err) {
    console.error(err.message);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
})();
