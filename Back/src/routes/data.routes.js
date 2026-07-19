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
router.get('/pacientes/:id/medicamentos', controller.getMedicamentosPaciente);
router.post('/pacientes/:id/medicamentos', controller.createMedicamentoPaciente);
router.put('/pacientes/:id/medicamentos/:medicamentoId', controller.updateMedicamentoPaciente);
router.get('/pacientes/:id/citas', controller.getCitasPaciente);
router.post('/pacientes/:id/citas', controller.createCitaPaciente);
router.put('/pacientes/:id/citas/:citaId', controller.updateCitaPaciente);
router.delete('/pacientes/:id/citas/:citaId', controller.deleteCitaPaciente);
router.post('/pacientes', controller.createPaciente);
router.put('/paciente/:id', controller.updatePaciente);
router.post('/pacientes/:id/relacionar-profesional', controller.assignPacienteProfesional);

module.exports = router;