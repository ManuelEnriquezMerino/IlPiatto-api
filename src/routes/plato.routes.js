const express = require('express')
const router = express.Router()
const PlatoController = require('../controllers/plato.controller')

//Prueba
router.get('/',PlatoController.getPlato)
router.get('/:id',PlatoController.getPlatoID)
router.get('/categoria/:idCategoria',PlatoController.getPlatoCategoria)
router.get('/restriccion/:idRestriccion',PlatoController.getPlatoRestriccion)

module.exports = router