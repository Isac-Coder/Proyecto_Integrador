const express = require('express');
const controller = require('../controllers/data.controller');

const router = express.Router();

router.get('/dashboard/:rol', controller.getDashboard);
router.get('/sections/:rol/:seccion', controller.getSection);
router.get('/profesionales', controller.getProfesionales);
router.get('/pacientes', controller.getPacientes);
router.get('/paciente/:id', controller.getPacienteDetalle);
router.get('/pacientes/:id/bitacora/plantillas', controller.getBitacoraPlantillas);
router.post('/pacientes/:id/bitacora/plantillas', controller.createBitacoraPlantilla);
router.get('/pacientes/:id/bitacora/registros', controller.getBitacoraRegistros);
router.post('/pacientes/:id/bitacora/registros', controller.createBitacoraRegistro);
router.post('/pacientes', controller.createPaciente);
router.put('/paciente/:id', controller.updatePaciente);
router.post('/pacientes/:id/relacionar-profesional', controller.assignPacienteProfesional);

module.exports = router;
