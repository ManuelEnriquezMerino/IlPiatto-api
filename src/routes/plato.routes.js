const express = require('express')
const router = express.Router()
const PlatoController = require('../controllers/plato.controller')

/**
*  @swagger
*   components:
*     schemas:
*       Plato:
*         type: object
*         properties:
*          id:
*            type: int
*            description: ID auto generado para el usuario.
*            example: 1
*          nombre:
*            type: string
*            description: Nombre del plato.
*            example: Tallarines con salsa bolognesa
*          descripcion:
*            type: string
*            description: Descripcion del plato.
*            example: Tallarines hechos a mano con salsa bolognesa a base de ingredientes organicos
*          precio:
*            type: int
*            description: Precio del plato.
*            example: 1500
*/

/**
*  @swagger
*   components:
*     schemas:
*       Categoria:
*         type: object
*         properties:
*          id:
*            type: int
*            description: ID auto generado para la categoria.
*            example: 1
*          nombre:
*            type: string
*            description: Nombre de la categoria.
*            example: Pastas
*          descripcion:
*            type: string
*            description: Descripcion de la categoria.
*            example: Platos basados en Pastas
*/

/**
*  @swagger
*   components:
*     schemas:
*       Restriccion:
*         type: object
*         properties:
*          id:
*            type: int
*            description: ID auto generado para la restriccion.
*            example: 1
*          nombre:
*            type: string
*            description: Nombre de la restriccion.
*            example: Celiaco
*          descripcion:
*            type: string
*            description: Descripcion de la restriccion.
*            example: Platos que solo contienen alimentos sin TACC
*/

/**
*  @swagger
*   components:
*     schemas:
*       Opcional:
*         type: object
*         properties:
*          id:
*            type: int
*            description: ID auto generado para el usuario.
*            example: 1
*          nombre:
*            type: string
*            description: Nombre del plato.
*            example: Tallarines con salsa bolognesa
*          descripcion:
*            type: string
*            description: Descripcion del plato.
*            example: Tallarines hechos a mano con salsa bolognesa a base de ingredientes organicos
*          precio:
*            type: int
*            description: Precio del plato.
*            example: 1500
*/

/**
*  @swagger
*  tags:
*    name: Plato
*    description: API para acceder a los datos de los platos.
*/

/**
*   @swagger
*   /platos/:
*       get:
*           summary: Obtiene un listado de todos los platos.
*           tags: [Plato]
*           responses:
*               "200":
*                   description: Listado de platos.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   platos:
*                                       type: array
*                                       items:
*                                           $ref: '#/components/schemas/Plato'
*               "404":
*                   description: No hay platos disponibles
*               "500":
*                   description: Error en el servidor
*/
router.get('/',PlatoController.getPlato)

/**
*   @swagger
*   /platos/categorias/:
*       get:
*           summary: Obtiene un listado de todas las categorias.
*           tags: [Plato]
*           responses:
*               "200":
*                   description: Listado de categorias.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   categorias:
*                                       type: array
*                                       items:
*                                           $ref: '#/components/schemas/Categoria'
*               "404":
*                   description: No hay categorias disponibles
*               "500":
*                   description: Error en el servidor
*/
router.get('/categorias',PlatoController.getCategorias)

/**
*   @swagger
*   /platos/restricciones/:
*       get:
*           summary: Obtiene un listado de todas las restricciones.
*           tags: [Plato]
*           responses:
*               "200":
*                   description: Listado de restricciones.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   restricciones:
*                                       type: array
*                                       items:
*                                           $ref: '#/components/schemas/Restriccion'
*               "404":
*                   description: No hay restricciones disponibles
*               "500":
*                   description: Error en el servidor
*/
router.get('/restricciones',PlatoController.getRestricciones)

/**
*   @swagger
*   /platos/opcionales/:
*       get:
*           summary: Obtiene un listado de todos los opcionales.
*           tags: [Plato]
*           responses:
*               "200":
*                   description: Listado de opcionales.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   opcionales:
*                                       type: array
*                                       items:
*                                           $ref: '#/components/schemas/Opcional'
*               "404":
*                   description: No hay opcionales disponibles
*               "500":
*                   description: Error en el servidor
*/
router.get('/opcionales',PlatoController.getOpcionales)

/**
*   @swagger
*   /platos/{id}:
*       get:
*           summary: Obtiene los datos de un dado plato.
*           tags: [Plato]
*           parameters:
*             - in: path
*               name: id
*               schema:
*                   type: integer
*                   required: true
*                   description: Id del plato
*           responses:
*               "200":
*                   description: Datos del platos.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   plato:
*                                       $ref: '#/components/schemas/Plato'
*               "400":
*                   description: El plato debe ser ingresado como un entero.
*               "404":
*                   description: El plato ingresado no existe. 
*               "500":
*                   description: Error en el servidor
*/
router.get('/:id',PlatoController.getPlatoID)

/**
*   @swagger
*   /platos/categorias/{id}:
*       get:
*           summary: Obtiene un listado de los platos que pertenecen a una dada categoria.
*           tags: [Plato]
*           parameters:
*             - in: path
*               name: id
*               schema:
*                   type: integer
*                   required: true
*                   description: Id de la categoria
*           responses:
*               "200":
*                   description: Listado de platos que pertenecen a la categoria.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   platos:
*                                       type: array
*                                       items:
*                                           $ref: '#/components/schemas/Plato'
*               "400":
*                   description: La categoria debe ser ingresada como un entero.
*               "404":
*                   description: La categoria ingresada no existe. 
*               "500":
*                   description: Error en el servidor
*/
router.get('/categorias/:idCategoria',PlatoController.getPlatoCategoria)

/**
*   @swagger
*   /platos/restricciones/{id}:
*       get:
*           summary: Obtiene un listado de los platos que siguen una dada restriccion.
*           tags: [Plato]
*           parameters:
*             - in: path
*               name: id
*               schema:
*                   type: integer
*                   required: true
*                   description: Id de la restriccion
*           responses:
*               "200":
*                   description: Listado de platos que siguen la restriccion.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   platos:
*                                       type: array
*                                       items:
*                                           $ref: '#/components/schemas/Plato'
*               "400":
*                   description: La restriccion debe ser ingresada como un entero.
*               "404":
*                   description: La restriccion ingresada no existe. 
*               "500":
*                   description: Error en el servidor
*/
router.get('/restricciones/:idRestriccion',PlatoController.getPlatoRestriccion)

/**
*   @swagger
*   /platos/opcionales/{id}:
*       get:
*           summary: Obtiene un listado de los opcionales para un platos.
*           tags: [Plato]
*           parameters:
*             - in: path
*               name: id
*               schema:
*                   type: integer
*                   required: true
*                   description: Id del plato
*           responses:
*               "200":
*                   description: Listado de opcionales para un plato.
*                   content:
*                       application/json:
*                           schema:
*                               type: object
*                               properties:
*                                   codigo:
*                                       type: int
*                                       example: 200
*                                   opcionales:
*                                       type: array
*                                       items:
*                                           $ref: '#/components/schemas/Opcional'
*               "400":
*                   description: El plato debe ser ingresado como un entero.
*               "404":
*                   description: No hay opcionales disponibles. 
*               "500":
*                   description: Error en el servidor
*/
router.get('/opcionales/:idPlato',PlatoController.getOpcionalesPlato)

module.exports = router