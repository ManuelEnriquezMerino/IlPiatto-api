const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/usuario.controller')
const checkJwt = require('../auth')

router.get('/',checkJwt,UsuarioController.getUsuario)

module.exports = router