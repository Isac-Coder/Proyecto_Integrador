const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const dataRoutes = require('./routes/data.routes');
const { connectDatabase } = require('./config/database');

// Instancia principal de Express; aquí se centralizan middlewares y rutas.
const app = express();

// Habilita solicitudes desde el frontend y convierte cuerpos JSON/formulario.
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verifica que la API responda e informa si PostgreSQL está disponible.
app.get('/health', async (_req, res) => {
  try {
    const pool = await connectDatabase();
    res.json({
      success: true,
      message: 'Backend funcionando.',
      database: pool ? 'conectada' : 'modo respaldo'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error al verificar la base de datos.', error: error.message });
  }
});

// Agrupa las rutas según el recurso que gestionan.
app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

// Respuesta uniforme para cualquier ruta que no exista.
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

// Se exporta la aplicación para iniciar el servidor y para pruebas automatizadas.
module.exports = { app, connectDatabase };
