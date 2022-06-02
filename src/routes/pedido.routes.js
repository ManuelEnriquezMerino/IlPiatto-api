const express = require('express')
const router = express.Router()
const PedidoController = require('../controllers/pedido.controller')
const checkJwt = require('../auth')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

router.get('/',checkJwt,PedidoController.getPedido)
router.post('/',checkJwt,jsonParser,PedidoController.postPedido)

router.use(function(err, req, res, next) {
    res.status(400).send({error:"JSON invalido"});
})

module.exports = router