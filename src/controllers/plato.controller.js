const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')
const atributos = 'id,nombre,descripcion,precio'

controller.getPlato = async(req,res) => {
    try{
        const respuesta = await pool.query(`SELECT ${atributos} FROM platos;`)
        if(respuesta.rows.length > 0){
            res.status(200).json(respuesta.rows);
        } else {
            res.status(404).json({error: 'No hay platos disponibles'})
        }
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

controller.getPlatoID = async(req,res) => {
    try{
        const id = req.params.id;

        if(!isNaN(id)){
            const respuesta = await pool.query(`SELECT ${atributos} FROM platos WHERE id=${id};`)
            if(respuesta.rows.length > 0)
                res.status(200).json(respuesta.rows);
            else
                res.status(404).json({error: 'El plato ingresado no existe'})
        } else
            res.status(400).json({error: 'El plato debe ser ingresado como un entero'})  
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

controller.getPlatoCategoria = async(req,res) => {
    try{
        const idCategoria = req.params.idCategoria;

        if(!isNaN(idCategoria)){
            const respuesta = await pool.query(`SELECT ${atributos} FROM platos WHERE id in (SELECT plato_id FROM categoria_plato where categoria_id=${idCategoria});`)
            if(respuesta.rows.length > 0)
                res.status(200).json(respuesta.rows);
            else
                res.status(404).json({error: 'La categoria ingresada no existe'})
        } else
            res.status(400).json({error: 'La categoria debe ser ingresada como un entero'})
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

controller.getPlatoRestriccion = async(req,res) => {
    try{
        const idRestriccion = req.params.idRestriccion;

        if(!isNaN(idRestriccion)){
            const respuesta = await pool.query(`SELECT ${atributos} FROM platos WHERE id in (SELECT plato_id FROM plato_restriccion where restriccion_id=${idRestriccion});`)
            if(respuesta.rows.length > 0)
                res.status(200).json(respuesta.rows);
            else
                res.status(404).json({error: 'La restriccion ingresada no existe'})
        } else
            res.status(400).json({error: 'La restriccion debe ser ingresada como un entero'})  
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

controller.getCategorias = async(req,res) => {
    try{
        const respuesta = await pool.query(`SELECT id,nombre,descripcion FROM categorias;`)
            if(respuesta.rows.length > 0)
                res.status(200).json(respuesta.rows);
            else
                res.status(404).json({error: 'No hay categorias disponibles'})
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

controller.getRestricciones = async(req,res) => {
    try{
        const respuesta = await pool.query(`SELECT id,nombre,descripcion FROM restricciones;`)
            if(respuesta.rows.length > 0)
                res.status(200).json(respuesta.rows);
            else
                res.status(404).json({error: 'No hay restricciones disponibles'})
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

controller.getOpcionales = async(req,res) => {
    try{
        const respuesta = await pool.query(`SELECT id,plato_id,nombre,descripcion,precio FROM opcionales;`)
        if(respuesta.rows.length > 0){
            res.status(200).json(respuesta.rows);
        } else {
            res.status(404).json({error: 'No hay opcionales disponibles'})
        }
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

controller.getOpcionalesPlato = async(req,res) => {
    try{
        const idPlato = req.params.idPlato;

        if(!isNaN(idPlato)){
            const respuesta = await pool.query(`SELECT id,nombre,descripcion,precio FROM opcionales WHERE plato_id=${idPlato};`)
            if(respuesta.rows.length > 0)
                res.status(200).json(respuesta.rows);
            else
                res.status(404).json({error: 'El plato ingresado no tiene opcionales'})
        } else
            res.status(400).json({error: 'El plato debe ser ingresado como un entero'})  
    } catch (err) {
        res.status(500).json({error: 'Error en el servidor'})
    }
}

module.exports = controller