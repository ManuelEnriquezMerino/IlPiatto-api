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
*   /usuarios/:
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
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   usuario:
*                                       $ref: '#/components/schemas/Usuario'
*               "400":
*                   description: Error de autenticacion.
*               "500":
*                   description: Error al solicitar datos de usuario
*/
router.get('/',checkJwt,UsuarioController.getUsuario,function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({codigo:400,error:"Error de autenticacion"});
    else
        res.status(500).send({codigo:400,error:"Error al crear usuario"});
})

/**
*   @swagger
*   /usuarios/:
*       post:
*           summary: Crea un nuevo usuario, el correo debe ser el mismo que en Auth0.
*           tags: [Usuario]
*           requestBody:
*               required: true
*               content:
*                   application/json:
*                       schema:
*                           type: object
*                           properties:
*                               usuario:
*                                   type: string
*                                   example: manuelem
*                               email:
*                                   type: string
*                                   example: manuel_em7@hotmail.com
*           responses:
*               "201":
*                   description: Se cargo exitosamente el usuario, se retorna su ID.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 201
*                                   id:
*                                       type: int
*                                       example: 1
*               "400":
*                   description: <ul><li>JSON invalido.</li><li>Error en la cantidad de parametros enviados.</li><li>La primer clave debe ser usuario</li><li>La segunda clave debe ser email.</li><li>El usuario debe ser una cadena de caracteres</li><li>El email debe ser una cadena de caracteres.</li><li>Los datos del usuario ingresado ya existen</li></ul>
*               "500":
*                   description: <ul><li>Error al crear usuario.</li></ul>
*/
router.post('/',jsonParser,UsuarioController.postUsuario,function(err, req, res, next) {
    if(err.name=="SyntaxError")
        res.status(400).send({codigo:400,error:"JSON invalido"});
    else
        res.status(500).send({codigo:400,error:"Error al crear usuario"});
})

/**
*   @swagger
*   /usuarios/{id}:
*       put:
*           summary: Modificar informacion de un usuario.
*           tags: [Usuario]
*           parameters:
*             - in: path
*               name: id
*           requestBody:
*               required: true
*               content:
*                   application/json:
*                       schema:
*                           type: object
*                           properties:
*                             nombre:
*                                 type: string
*                                 example: Manuel
*                             apellido:
*                                 type: string
*                                 example: Enriquez
*                             nacimiento:
*                                 type: string
*                                 example: 1998-7-5
*                             direccion:
*                                 type: string
*                                 example: urquiza 154
*           security:
*               - bearerAuth: [] 
*           responses:
*               "204":
*                   description: Se modifico exitosamente el usuario.
*                   content:
*                       application/json:
*                           schema:
*                              properties:
*                               codigo:
*                                   type: integer
*                                   example: 204
*               "400":
*                   description: <ul><li>Error en la cantidad de parametros enviados.</li><li>La primer clave debe ser nombre.</li><li>La segunda clave debe ser apellido.</li><li>La tercera clave debe ser nacimiento.</li><li>La cuarta clave debe ser direccion.</li><li>El nombre debe ser nulo o una cadena de caracteres.</li><li>El apellido debe ser nulo o una cadena de caracteres.</li><li>El nacimiento debe ser nulo o una fecha.</li><li>El direccion debe ser nula o una cadena de caracteres.</li></ul>
*               "500":
*                   description: <ul><li>Error al modificar usuario.</li></ul>
*/
router.put('/:id',checkJwt,jsonParser,UsuarioController.putUsuario,function(err, req, res, next) {
    if(err.name=="InvalidTokenError" || err.name=="UnauthorizedError")
        res.status(400).send({codigo:400,error:"Error de autenticacion"});
    else
        if(err.name=="SyntaxError")
            res.status(400).send({codigo:400,error:"JSON invalido"});
        else
            res.status(500).send({codigo:400,error:"Error al modificar usuario"});
})

module.exports = router