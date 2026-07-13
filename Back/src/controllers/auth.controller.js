const crypto = require('crypto');

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
  return usuariosEnMemoria.find((usuario) => usuario.email.toLowerCase() === String(email).toLowerCase() && usuario.password === String(password));
}

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email y contraseña son obligatorios.' });
  }

  const usuario = encontrarUsuario(email, password);

  if (!usuario) {
    return res.status(401).json({ success: false, message: 'Credenciales inválidas.' });
  }

  const token = crearToken();
  tokens.set(token, usuario.id);

  return res.json({
    success: true,
    message: 'Inicio de sesión correcto.',
    user: limpiarUsuario(usuario),
    token
  });
};

exports.register = (req, res) => {
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
