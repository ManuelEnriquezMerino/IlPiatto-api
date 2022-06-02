const express = require('express')
const router = express.Router()
const PedidoController = require('../controllers/pedido.controller')
const checkJwt = require('../auth')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()


/**
*  @swagger
*   components:
*     schemas:
*       Pedido:
*         type: object
*         properties:
*           id:
*             type: int
*             description: ID auto generado para el pedido.
*             example: 1
*           fecha:
*             type: date
*             description: Fecha y hora cuando se realizo el pedido.
*             example: 2022-06-02 12:39:47
*           direccion:
*             type: string
*             description: Direccion a la que se debe enviar el pedido.
*             example: Urquiza 154
*           precio:
*             type: int
*             description: precio del pedido, calculado en base a los platos y opcionales.
*             example: 5450
*           ciente_id:
*             type: int
*             description: ID del cliente que realizo el pedido, provista por el token de autenticacion.
*             example: 1
*/


/**
*  @swagger
*  tags:
*    name: Pedido
*    description: API para realizar y consultar pedidos.
*/

/**
*   @swagger
*   /pedidos/:
*       get:
*           summary: Obtener los pedidos previos del usuario.
*           tags: [Pedido]
*           security:
*               - bearerAuth: [] 
*           responses:
*               "200":
*                   description: Lista de pedidos del usuario.
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Pedido'
*               "400":
*                   description: Error de autenticacion.
*               "404":
*                   description: El usuario no cuenta con pedidos
*/
router.get('/',checkJwt,PedidoController.getPedidos,function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({error:"Error de autenticacion"})
})

/**
*   @swagger
*   /pedidos/{id}:
*       get:
*           summary: Obtener los datos de un dado pedidos.
*           tags: [Pedido]
*           parameters:
*             - in: path
*               name: id
*               schema:
*                   type: integer
*                   required: true
*                   description: Id del pedido
*           security:
*               - bearerAuth: [] 
*           responses:
*               "200":
*                   description: Datos del pedido.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                 fecha:
*                                     type: date
*                                     example: 2022-06-02 18:14:15
*                                 direccion:
*                                     type: string
*                                     example: Urquiza 154
*                                 precio:
*                                     type: int
*                                     example:  5450
*                                 platos:
*                                     type: object
*                                     properties:
*                                       id:
*                                           type: int
*                                           example:  1
*                                       opcional_id:
*                                           type: int
*                                           example:  1
*                                       pedido_id:
*                                           type: int
*                                           example:  1
*                                       plato_id:
*                                           type: int
*                                           example:  1
*                                       n_orden:
*                                           type: int
*                                           example:  1
*               "400":
*                   description: Error de autenticacion.
*               "401":
*                   description: No esta autorizado para ver este pedido.
*               "404":
*                   description: El pedido no existe
*               "500":
*                   description: No se pudo obtener los datos del pedido
*/
router.get('/:id',checkJwt,PedidoController.getPedidoID,function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({error:"Error de autenticacion"})
})

/**
*   @swagger
*   /pedidos/:
*       post:
*           summary: Crea un nuevo pedido.
*           tags: [Pedido]
*           requestBody:
*               required: true
*               content:
*                   application/json:
*                       schema:
*                           type: object
*                           properties:
*                               direccion:
*                                 type: string
*                                 example: San Andres 800
*                               pedido:
*                                 type: array
*                                 items:
*                                       type: object
*                                       properties:
*                                           plato:
*                                             type: integer
*                                             example: 3
*                                           opcionales:
*                                              type: array
*                                              items:
*                                                   type: integer
*                                                   example: 2
*           security:
*               - bearerAuth: [] 
*           responses:
*               "201":
*                   description: Se cargo exitosamente el pedido, se retorna su ID.
*                   content:
*                       application/json:
*                           schema:
*                              properties:
*                               id:
*                                   type: integer
*                                   example: 1
*               "400":
*                   description: <ul><li>Error de autenticacion.</li><li>JSON invalido.</li><li>Error en la cantidad de parametros enviados</li><li>La primer clave debe ser direccion.</li><li>La segunda clave debe ser pedido</li><li>La direccion debe ser una cadena de caracteres.</li><li>El pedido debe ser un arreglo</li><li>La primera clave de los pedidos debe ser plato.</li><li>La segunda clave de los pedidos debe ser opcionales</li><li>Los platos deben ser un entero.</li><li>Los opcionales deben estar dentro de arreglos</li><li>Los opcionales deben ser un entero.</li><li>Se ha ingresado un plato invalido</li><li>Se ha ingresado un opcional invalido</li></ul>
*               "404":
*                   description: <ul><li>Error al obtener datos del usuario.</li><li>Error al obtener los platos solicitados</li><li>Error al obtener los opcionales solicitados</li></ul>
*               "409":
*                   description: <ul><li>Error al almacenar el nuevo pedido.</li><li>Error al almacenar el nuevo pedido junto con sus platos y opcionales</li></ul>
*               "500":
*                   description: <ul><li>Error al validar platos.</li><li>Error al validar opcionales</li></ul>
*/
router.post('/',checkJwt,jsonParser,PedidoController.postPedido,function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({error:"Error de autenticacion"});
    else
        if(err.name=="SyntaxError")
            res.status(400).send({error:"JSON invalido"});
        else
            res.status(500).send({error:"Error al recibir pedido"});
})

module.exports = router