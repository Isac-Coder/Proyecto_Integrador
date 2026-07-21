const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const dataRoutes = require('./routes/data.routes');
const { connectDatabase } = require('./config/database');

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    // Permite herramientas sin origen (health checks, curl y Postman).
    if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Origen no permitido por CORS.'));
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use('/api/auth', authRoutes);
app.use('/api/data', dataRoutes);

app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada.' });
});

module.exports = { app, connectDatabase };
