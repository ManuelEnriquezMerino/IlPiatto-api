const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/usuario.controller')
const checkJwt = require('../auth')

router.get('/',checkJwt,UsuarioController.getUsuario)

router.use(function(err, req, res, next) {
    if(err.name=="InvalidTokenError")
        res.status(400).send({error:"Error de autenticacion"});
    else
        res.status(500).send({error:"Error al recibir pedido"});
})

module.exports = router