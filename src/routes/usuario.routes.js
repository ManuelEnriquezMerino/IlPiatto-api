const express = require('express')
const router = express.Router()
const UsuarioController = require('../controllers/usuario.controller')
const checkJwt = require('../auth')

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

/**
*  @swagger
*   components:
*     schemas:
*       Usuario:
*         type: object
*         properties:
*          id:
*            type: int
*            description: ID auto generado para el usuario.
*            example: 1
*          usuario:
*            type: string
*            description: Nombre de la cuenta del usuario.
*            example: manuelem
*          nombre:
*            type: string
*            description: Nombre del usuario.
*            example: Manuel
*          apellido:
*            type: string
*            description: Apellido del usuario.
*            example: Enriquez
*          email:
*            type: string
*            description: Correo electronico del usuario.
*            example: manuel_em7@hotmail.com
*          nacimiento:
*            type: string
*            description: Fecha de nacimiento del usuario.
*            example: 1998-05-07
*          direccion:
*            type: string
*            description: direccion del usuario.
*            example: Urquiza 154
*/


/**
*  @swagger
*  tags:
*    name: Usuario
*    description: API para acceder a los datos del usuario.
*/

/**
*   @swagger
*   /usuario/:
*       get:
*           summary: Obtiene los datos del usuario actualmente logueado.
*           tags: [Usuario]
*           security:
*               - bearerAuth: [] 
*           responses:
*               "200":
*                   description: Datos del usuario.
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Usuario'
*               "400":
*                   description: Error de autenticacion.
*               "500":
*                   description: Error al solicitar datos de usuario
*/
router.get('/',checkJwt,UsuarioController.getUsuario,function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({error:"Error de autenticacion"});
    else
        res.status(500).send({error:"Error al crear usuario"});
})

router.post('/',jsonParser,UsuarioController.postUsuario,function(err, req, res, next) {
    if(err.name=="SyntaxError")
        res.status(400).send({error:"JSON invalido"});
    else
        res.status(500).send({error:"Error al crear usuario"});
})

router.put('/:id',checkJwt,jsonParser,UsuarioController.putUsuario,function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({error:"Error de autenticacion"});
    else
        if(err.name=="SyntaxError")
            res.status(400).send({error:"JSON invalido"});
        else
            res.status(500).send({error:"Error al recibir pedido"});
})

module.exports = router