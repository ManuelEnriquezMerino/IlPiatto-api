const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')

controller.getUsuario = async(req,res) => {
    const correo = req.auth.payload['https://ilpiatto.com/email']
    const respuesta = await pool.query('SELECT * FROM usuarios WHERE correo=$1;', [correo]) //Migracion no creada?
    if(respuesta.rows.length > 0){
        res.status(200).json(respuesta.rows);
    } else {
        //error res.status(codigo).json({error: 'texto del error'})
    }
}

module.exports = controller