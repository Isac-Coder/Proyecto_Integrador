const express = require('express');
const controller = require('../controllers/data.controller');

const router = express.Router();

router.get('/dashboard/:rol', controller.getDashboard);
router.get('/sections/:rol/:seccion', controller.getSection);

module.exports = router;
