const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')

controller.getPlato = async(req,res) => {
    const respuesta = await pool.query('SELECT * FROM platos;')
    if(respuesta.rows.length > 0){
        res.status(200).json(respuesta.rows);
    } else {
        //error res.status(codigo).json({error: 'texto del error'})
    }
}

controller.getPlatoID = async(req,res) => {
    const id = req.params.id;

    if(!isNaN(id)){
        const respuesta = await pool.query('SELECT * FROM platos WHERE id=$1;', [id])
        if(respuesta.rows.length > 0){
            res.status(200).json(respuesta.rows);
        } else {
            //error res.status(codigo).json({error: 'texto del error'})
        }
    } else {
        //error res.status(codigo).json({error: 'texto del error'})  
    }
}

controller.getPlatoCategoria = async(req,res) => {
    const idCategoria = req.params.idCategoria;

    if(!isNaN(idCategoria)){
        const respuesta = await pool.query('SELECT * FROM platos WHERE id in (SELECT plato_id FROM categoria_plato where categoria_id=$1)', [idCategoria])
        if(respuesta.rows.length > 0){
            res.status(200).json(respuesta.rows);
        } else {
            //error res.status(codigo).json({error: 'texto del error'})
        }
    } else {
        //error res.status(codigo).json({error: 'texto del error'})
    }
}

controller.getPlatoRestriccion = async(req,res) => {
    const idRestriccion = req.params.idRestriccion;

    if(!isNaN(idRestriccion)){
        const respuesta = await pool.query('SELECT * FROM platos WHERE id in (SELECT plato_id FROM plato_restriccion where restriccion_id=$1)', [idRestriccion])
        if(respuesta.rows.length > 0){
            res.status(200).json(respuesta.rows);
        } else {
            //error
            res.status(500).json({error: 'error'})
        }
    } else {
        //error
        res.status(500).json({error: 'error'})    
    }
}

module.exports = controller