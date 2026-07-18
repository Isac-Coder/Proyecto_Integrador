const express = require('express');
const controller = require('../controllers/auth.controller');

// Router dedicado a las operaciones de identidad y sesión.
const router = express.Router();

// Cada ruta delega la validación y la respuesta al controlador de autenticación.
router.post('/login', controller.login);
router.post('/register', controller.register);
router.get('/me', controller.me);

// Se monta desde app.js bajo el prefijo /api/auth.
module.exports = router;
