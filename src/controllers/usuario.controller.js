const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')
const atributos = 'id,usuario,nombre,apellido,email,nacimiento,direccion'

controller.getUsuario = async(req,res) => {
    const email = req.auth.payload['https://ilpiatto.com/email']
    const respuesta = await pool.query(`SELECT ${atributos} FROM clientes WHERE email='${email}';`) //Migracion no creada?
    if(respuesta.rows.length > 0){
        res.status(200).json(respuesta.rows);
    } else {
        res.status(500).json({error:'Error al solicitar datos de usuario'})
    }
}

controller.getUsuario = async(req,res) => {
    const email = req.auth.payload['https://ilpiatto.com/email']
    const respuesta = await pool.query(`SELECT ${atributos} FROM clientes WHERE email='${email}';`) //Migracion no creada?
    if(respuesta.rows.length > 0){
        res.status(200).json(respuesta.rows);
    } else {
        res.status(500).json({error:'Error al solicitar datos de usuario'})
    }
}

async function validarNuevoUsuario(body){
    var claves = Object.keys(body)

    if(claves.length!=2)
        throw [400,"Error en la cantidad de parametros enviados"]
    if(claves[0]!="usuario")
        throw [400,"La primer clave debe ser usuario"]
    if(claves[1]!="email")
        throw [400,"La segunda clave debe ser email"]
    if(typeof body.usuario!='string')
        throw [400,"El usuario debe ser una cadena de caracteres"]
    if(typeof body.email!='string')
        throw [400,"El email debe ser una cadena de caracteres"]

    const consultaUsuario = `SELECT (EXISTS (SELECT * FROM clientes WHERE usuario='${body.usuario}') AND EXISTS (SELECT * FROM clientes WHERE email='${body.email}')) AS existeusuario;`
    
    var respuestaUsuario = await pool.query(consultaUsuario)

    if(respuestaUsuario.rows.length > 0){
        if(respuestaUsuario.rows[0].existeusuario==true)
            throw [400,"Los datos del usuario ingresado ya existen"]
    } else
        throw [500,"Error al crear usuario"]
}

controller.postUsuario = async(req,res) => {
    try{
        var body = req.body

        await validarNuevoUsuario(body)

        const respuesta = await pool.query(`INSERT INTO clientes (usuario,email,created_at,updated_at) VALUES ('${body.usuario}','${body.email}',current_timestamp,current_timestamp) RETURNING id;`)
        if(respuesta.rows.length > 0){
            res.status(200).json(respuesta.rows[0]);
        } else {
            res.status(500).json({error:'Error al crear usuario'})
        }
    } catch (error){
        res.status(error[0]).json({error: error[1]})
    }
}

module.exports = controller