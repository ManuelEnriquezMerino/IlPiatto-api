const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')
const atributos = 'id,nombre,descripcion,precio'

controller.getPlato = async(req,res) => {
    const respuesta = await pool.query(`SELECT ${atributos} FROM platos;`) //Enviar fecha de creacion y actualizacion??
    if(respuesta.rows.length > 0){
        res.status(200).json(respuesta.rows);
    } else {
        res.status(404).json({error: 'No hay platos disponibles'})
    }
}

controller.getPlatoID = async(req,res) => {
    const id = req.params.id;

    if(!isNaN(id)){
        const respuesta = await pool.query(`SELECT ${atributos} FROM platos WHERE id=${id};`)
        if(respuesta.rows.length > 0)
            res.status(200).json(respuesta.rows);
        else
            res.status(404).json({error: 'El plato ingresado no existe'})
    } else
        res.status(404).json({error: 'El plato debe ser ingresado como un entero'})  
    
}

controller.getPlatoCategoria = async(req,res) => {
    const idCategoria = req.params.idCategoria;

    if(!isNaN(idCategoria)){
        const respuesta = await pool.query(`SELECT ${atributos} FROM platos WHERE id in (SELECT plato_id FROM categoria_plato where categoria_id=${idCategoria})`)
        if(respuesta.rows.length > 0)
            res.status(200).json(respuesta.rows);
        else
            res.status(404).json({error: 'La categoria ingresada no existe'})
    } else
        res.status(404).json({error: 'La categoria debe ser ingresada como un entero'})
}

controller.getPlatoRestriccion = async(req,res) => {
    const idRestriccion = req.params.idRestriccion;

    if(!isNaN(idRestriccion)){
        const respuesta = await pool.query(`SELECT ${atributos} FROM platos WHERE id in (SELECT plato_id FROM plato_restriccion where restriccion_id=${idRestriccion})`)
        if(respuesta.rows.length > 0)
            res.status(200).json(respuesta.rows);
        else
            res.status(404).json({error: 'La restriccion ingresada no existe'})
    } else
        res.status(404).json({error: 'La restriccion debe ser ingresada como un entero'})  
}

module.exports = controller