const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')
const atributos = 'id,usuario,nombre,apellido,email,nacimiento,direccion'

controller.getUsuario = async(req,res) => {
    const email = req.auth.payload['https://ilpiatto.com/email']
    const respuesta = await pool.query(`SELECT ${atributos} FROM clientes WHERE email=${email};`) //Migracion no creada?
    if(respuesta.rows.length > 0){
        res.status(200).json(respuesta.rows);
    } else {
        //error res.status(codigo).json({error: 'texto del error'})
    }
}

module.exports = controller