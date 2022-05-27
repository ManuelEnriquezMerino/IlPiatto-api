const express = require('express')
const router = express.Router()
const PlatoController = require('../controllers/plato.controller')

//Prueba
router.get('/plato',PlatoController.getPlato)
router.get('/plato/:id',PlatoController.getPlatoID)
router.get('/plato/categoria/:idCategoria',PlatoController.getPlatoCategoria)
router.get('/plato/restriccion/:idRestriccion',PlatoController.getPlatoRestriccion)

module.exports = router