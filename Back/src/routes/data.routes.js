const express = require('express');
const controller = require('../controllers/data.controller');

// Router para la información que alimenta los paneles por rol.
const router = express.Router();

// :rol y :seccion identifican dinámicamente el contenido solicitado.
router.get('/dashboard/:rol', controller.getDashboard);
router.get('/sections/:rol/:seccion', controller.getSection);

// Se monta desde app.js bajo el prefijo /api/data.
module.exports = router;
