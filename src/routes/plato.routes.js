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
*  tags:
*    name: Plato
*    description: API para acceder a los datos de los platos.
*/

/**
*   @swagger
*   /plato/:
*       get:
*           summary: Obtiene un listado de todos los platos.
*           tags: [Plato]
*           responses:
*               "200":
*                   description: Listado de platos.
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Plato'
*               "404":
*                   description: No hay platos disponibles
*               "500":
*                   description: Error en el servidor
*/
router.get('/',PlatoController.getPlato)

/**
*   @swagger
*   /plato/categoria/:
*       get:
*           summary: Obtiene un listado de todas las categorias.
*           tags: [Plato]
*           responses:
*               "200":
*                   description: Listado de categorias.
*                   content:
*                       application/json:
*                           schema:
*                                 type: object
*                                 properties:
*                                   id:
*                                       type: int
*                                       example: 1
*                                   nombre:
*                                       type: string
*                                       example: Pastas
*                                   descripcion:
*                                       type: string
*                                       example:  Platos basados en Pastas
*               "404":
*                   description: No hay categorias disponibles
*               "500":
*                   description: Error en el servidor
*/
router.get('/categoria',PlatoController.getCategorias)

/**
*   @swagger
*   /plato/restriccion/:
*       get:
*           summary: Obtiene un listado de todas las restricciones.
*           tags: [Plato]
*           responses:
*               "200":
*                   description: Listado de restricciones.
*                   content:
*                       application/json:
*                           schema:
*                                 type: object
*                                 properties:
*                                   id:
*                                       type: int
*                                       example: 1
*                                   nombre:
*                                       type: string
*                                       example: Celiaco
*                                   descripcion:
*                                       type: string
*                                       example: Platos que solo contienen alimentos sin TACC
*               "404":
*                   description: No hay restricciones disponibles
*               "500":
*                   description: Error en el servidor
*/
router.get('/restriccion',PlatoController.getRestricciones)

/**
*   @swagger
*   /plato/{id}:
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
*                               $ref: '#/components/schemas/Plato'
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
*   /plato/categoria/{id}:
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
*                   description: Listado de platos.
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Plato'
*               "400":
*                   description: La categoria debe ser ingresada como un entero.
*               "404":
*                   description: La categoria ingresada no existe. 
*               "500":
*                   description: Error en el servidor
*/
router.get('/categoria/:idCategoria',PlatoController.getPlatoCategoria)

/**
*   @swagger
*   /plato/restriccion/{id}:
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
*                   description: Listado de platos.
*                   content:
*                       application/json:
*                           schema:
*                               $ref: '#/components/schemas/Plato'
*               "400":
*                   description: La restriccion debe ser ingresada como un entero.
*               "404":
*                   description: La restriccion ingresada no existe. 
*               "500":
*                   description: Error en el servidor
*/
router.get('/restriccion/:idRestriccion',PlatoController.getPlatoRestriccion)

module.exports = router