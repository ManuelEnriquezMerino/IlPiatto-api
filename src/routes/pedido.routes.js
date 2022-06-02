const express = require('express')
const router = express.Router()
const PedidoController = require('../controllers/pedido.controller')
const checkJwt = require('../auth')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

router.get('/',checkJwt,PedidoController.getPedido)
router.post('/',checkJwt,jsonParser,PedidoController.postPedido)

router.use(function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({error:"Error de autenticacion"});
    else
        if(err.name=="SyntaxError")
            res.status(400).send({error:"JSON invalido"});
        else
            res.status(500).send({error:"Error al recibir pedido"});
})

module.exports = router