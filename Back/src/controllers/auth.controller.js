const crypto = require('crypto');
const { connectDatabase } = require('../config/database');

const usuariosEnMemoria = [
  {
    id: 1,
    nombre: 'Jack (Especialista)',
    email: 'profesional@zoecare.com',
    password: '1234',
    rol: 'profesional'
  },
  {
    id: 2,
    nombre: 'Juana Pérez',
    email: 'cuidador@zoecare.com',
    password: '1234',
    rol: 'cuidador'
  }
];

const tokens = new Map();

function crearToken() {
  return crypto.randomBytes(20).toString('hex');
}

function limpiarUsuario(usuario) {
  const { password, ...resto } = usuario;
  return resto;
}

function encontrarUsuario(email, password) {
  const passwordHash = hashPassword(password);
  return usuariosEnMemoria.find((usuario) => usuario.email.toLowerCase() === String(email).toLowerCase() && hashPassword(usuario.password) === passwordHash);
}

function normalizarRolParaBaseDatos(rol) {
  const valor = String(rol || '').trim().toLowerCase();

  switch (valor) {
    case 'administrador':
      return 'Administrador';
    case 'profesional':
      return 'Profesional';
    case 'cuidador':
      return 'Cuidador';
    default:
      return 'Cuidador';
  }
}

function normalizarRolParaFrontend(rol) {
  const valor = String(rol || '').trim().toLowerCase();

  switch (valor) {
    case 'administrador':
      return 'administrador';
    case 'profesional':
      return 'profesional';
    case 'cuidador':
      return 'cuidador';
    default:
      return 'cuidador';
  }
}

function hashPassword(password) {
  return crypto.createHash('sha256').update(String(password)).digest('hex');
}

async function asegurarUsuariosDemoEnBaseDeDatos(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.usuarios_sistema (
      id_usuario SERIAL PRIMARY KEY,
      nombre TEXT,
      correo_electronico TEXT NOT NULL UNIQUE,
      contrasena_hash TEXT NOT NULL,
      rol VARCHAR(30) NOT NULL,
      id_profecional INTEGER,
      ultimo_acceso DATE
    )
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS usuarios_sistema_correo_electronico_key
    ON public.usuarios_sistema (correo_electronico)
  `);

  await pool.query(`
    ALTER TABLE public.usuarios_sistema
    ADD COLUMN IF NOT EXISTS nombre TEXT
  `);

  await pool.query(`
    ALTER TABLE public.usuarios_sistema
    DROP CONSTRAINT IF EXISTS usuarios_sistema_rol_check
  `);

  await pool.query(`
    ALTER TABLE public.usuarios_sistema
    ADD CONSTRAINT usuarios_sistema_rol_check CHECK ((rol)::text = ANY ((ARRAY['Administrador'::character varying, 'Profesional'::character varying, 'Cuidador'::character varying])::text[]))
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.profecionales (
      id_profecional SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      especialidad TEXT,
      numero_licencia VARCHAR(50) NOT NULL UNIQUE,
      turno VARCHAR(30),
      email TEXT UNIQUE
    )
  `);

  await pool.query(`
    ALTER TABLE public.profecionales
    ADD COLUMN IF NOT EXISTS email TEXT UNIQUE
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS profecionales_numero_licencia_key
    ON public.profecionales (numero_licencia)
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.encargados_o_cuidadores (
      id_cuidador SERIAL PRIMARY KEY,
      nombre TEXT NOT NULL,
      telefono VARCHAR(20) NOT NULL,
      email TEXT UNIQUE,
      relacion_paciente TEXT NOT NULL
    )
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS encargados_o_cuidadores_email_key
    ON public.encargados_o_cuidadores (email)
  `);

  const usuariosDemo = [
    {
      nombre: 'Jack (Especialista)',
      email: 'profesional@zoecare.com',
      password: '1234',
      rol: 'profesional'
    },
    {
      nombre: 'Juana Pérez',
      email: 'cuidador@zoecare.com',
      password: '1234',
      rol: 'cuidador'
    },
    {
      nombre: 'Usuario de Prueba',
      email: 'registro-test-1784093368342@zoecare.com',
      password: 'prueba123',
      rol: 'profesional'
    }
  ];

  for (const usuario of usuariosDemo) {
    await pool.query(
      'INSERT INTO public.usuarios_sistema (nombre, correo_electronico, contrasena_hash, rol, ultimo_acceso) VALUES ($1, $2, $3, $4, CURRENT_DATE) ON CONFLICT (correo_electronico) DO NOTHING',
      [String(usuario.nombre || '').trim(), String(usuario.email).trim(), hashPassword(usuario.password), normalizarRolParaBaseDatos(usuario.rol)]
    );
  }

  await pool.query(
    'INSERT INTO public.profecionales (nombre, especialidad, numero_licencia, turno, email) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (numero_licencia) DO NOTHING',
    ['Jack (Especialista)', 'General', 'demo-profesional-001', 'Mañana', 'profesional@zoecare.com']
  );

  await pool.query(
    'INSERT INTO public.encargados_o_cuidadores (nombre, telefono, email, relacion_paciente) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
    ['Juana Pérez', '0000000000', 'cuidador@zoecare.com', 'Cuidador']
  );
}

async function buscarUsuarioEnBaseDeDatos(email, password) {
  const pool = await connectDatabase();
  if (!pool) {
    return null;
  }

  await asegurarUsuariosDemoEnBaseDeDatos(pool);

  const passwordHash = hashPassword(password);
  const resultado = await pool.query(
    'SELECT id_usuario AS id, nombre, correo_electronico AS email, contrasena_hash AS password_hash, rol FROM public.usuarios_sistema WHERE correo_electronico = $1',
    [String(email).trim()]
  );

  if (resultado.rows.length === 0) {
    return null;
  }

  const usuario = resultado.rows[0];
  if (usuario.password_hash !== passwordHash) {
    return null;
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre || usuario.email,
    email: usuario.email,
    password: usuario.password_hash,
    rol: normalizarRolParaFrontend(usuario.rol)
  };
}

function normalizarUsuarioParaRespuesta(usuario) {
  return {
    id: usuario.id,
    nombre: usuario.nombre || usuario.email,
    email: usuario.email,
    rol: normalizarRolParaFrontend(usuario.rol),
    token: usuario.token
  };
}

async function insertarUsuarioEnBaseDeDatos(usuario) {
  const pool = await connectDatabase();
  if (!pool) {
    return null;
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS public.usuarios_sistema (
      id_usuario SERIAL PRIMARY KEY,
      nombre TEXT,
      correo_electronico TEXT NOT NULL UNIQUE,
      contrasena_hash TEXT NOT NULL,
      rol VARCHAR(30) NOT NULL,
      id_profecional INTEGER,
      ultimo_acceso DATE
    )
  `);

  await pool.query(`
    CREATE UNIQUE INDEX IF NOT EXISTS usuarios_sistema_correo_electronico_key
    ON public.usuarios_sistema (correo_electronico)
  `);

  await pool.query(`
    ALTER TABLE public.usuarios_sistema
    ADD COLUMN IF NOT EXISTS nombre TEXT
  `);

  await pool.query(`
    ALTER TABLE public.usuarios_sistema
    DROP CONSTRAINT IF EXISTS usuarios_sistema_rol_check
  `);

  await pool.query(`
    ALTER TABLE public.usuarios_sistema
    ADD CONSTRAINT usuarios_sistema_rol_check CHECK ((rol)::text = ANY ((ARRAY['Administrador'::character varying, 'Profesional'::character varying, 'Cuidador'::character varying])::text[]))
  `);

  const resultado = await pool.query(
    'INSERT INTO public.usuarios_sistema (nombre, correo_electronico, contrasena_hash, rol, ultimo_acceso) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING id_usuario AS id, nombre, correo_electronico AS email, rol',
    [String(usuario.nombre || '').trim(), String(usuario.email).trim(), hashPassword(usuario.password), normalizarRolParaBaseDatos(usuario.rol)]
  );

  const rol = normalizarRolParaFrontend(usuario.rol);
  if (rol === 'profesional') {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.profecionales (
        id_profecional SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        especialidad TEXT,
        numero_licencia VARCHAR(50) NOT NULL UNIQUE,
        turno VARCHAR(30)
      )
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS profecionales_numero_licencia_key
      ON public.profecionales (numero_licencia)
    `);

    await pool.query(
      'INSERT INTO public.profecionales (nombre, especialidad, numero_licencia, turno, email) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (numero_licencia) DO NOTHING',
      [String(usuario.nombre || '').trim(), 'General', `${Date.now()}`, 'Mañana', String(usuario.email).trim()]
    );
  } else if (rol === 'cuidador') {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS public.encargados_o_cuidadores (
        id_cuidador SERIAL PRIMARY KEY,
        nombre TEXT NOT NULL,
        telefono VARCHAR(20) NOT NULL,
        email TEXT UNIQUE,
        relacion_paciente TEXT NOT NULL
      )
    `);

    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS encargados_o_cuidadores_email_key
      ON public.encargados_o_cuidadores (email)
    `);

    await pool.query(
      'INSERT INTO public.encargados_o_cuidadores (nombre, telefono, email, relacion_paciente) VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING',
      [String(usuario.nombre || '').trim(), '0000000000', String(usuario.email).trim(), 'Cuidador']
    );
  }

  return resultado.rows[0];
}

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios.' });
  }

  let usuario = await buscarUsuarioEnBaseDeDatos(email, password);

  if (!usuario) {
    usuario = encontrarUsuario(email, password);
  }

  if (!usuario) {
    return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
  }

  const token = crearToken();
  tokens.set(token, usuario.id);

  const usuarioRespuesta = normalizarUsuarioParaRespuesta({ ...usuario, token });

  return res.json({
    success: true,
    message: 'Inicio de sesión correcto.',
    user: limpiarUsuario(usuarioRespuesta),
    token
  });
};

exports.register = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password || !rol) {
    return res.status(400).json({ success: false, message: 'Nombre, email, contraseña y rol son obligatorios.' });
  }

  const existe = usuariosEnMemoria.some((usuario) => usuario.email.toLowerCase() === String(email).toLowerCase());
  if (existe) {
    return res.status(409).json({ success: false, message: 'El usuario ya existe.' });
  }

  const nuevoUsuario = {
    id: usuariosEnMemoria.length + 1,
    nombre,
    email,
    password,
    rol
  };

  try {
    const usuarioDb = await insertarUsuarioEnBaseDeDatos(nuevoUsuario);
    if (usuarioDb) {
      nuevoUsuario.id = usuarioDb.id;
      nuevoUsuario.nombre = usuarioDb.nombre || nuevoUsuario.nombre;
      nuevoUsuario.rol = normalizarRolParaFrontend(usuarioDb.rol);
    }
  } catch (error) {
    console.error('No se pudo insertar el usuario en PostgreSQL:', error.message);
  }

  usuariosEnMemoria.push(nuevoUsuario);

  const token = crearToken();
  tokens.set(token, nuevoUsuario.id);

  return res.status(201).json({
    success: true,
    message: 'Usuario registrado correctamente.',
    user: limpiarUsuario(nuevoUsuario),
    token
  });
};

exports.me = (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token no proporcionado.' });
  }

  const usuarioId = tokens.get(token);
  if (!usuarioId) {
    return res.status(401).json({ success: false, message: 'Token inválido.' });
  }

  const usuario = usuariosEnMemoria.find((item) => item.id === usuarioId);
  if (!usuario) {
    return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
  }

  return res.json({ success: true, user: limpiarUsuario(usuario) });
};
