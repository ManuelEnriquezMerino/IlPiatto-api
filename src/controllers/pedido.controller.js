const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')
const atributos = '*' //Ver que atributos traer

controller.getPedido = async(req,res) => {
    const correo = req.auth.payload['https://ilpiatto.com/email']
    const idUsuario = await pool.query('SELECT id FROM usuarios WHERE correo=$1;', [correo]) //Migracion no creada?
    const respuesta = await pool.query(`SELECT ${atributos} FROM pedidos WHERE cliente_id;`) //Falta cliente_id en la tabla de pedidos
    if(respuesta.rows.length > 0){
        res.status(200).json(respuesta.rows);
    } else {
        //error res.status(codigo).json({error: 'texto del error'})
    }
}

controller.postPedido = async(req,res) => {
    var precio = 0
    //const correo = req.auth.payload['https://ilpiatto.com/email']
    //const idUsuario = await pool.query('SELECT id FROM usuarios WHERE correo=$1;', [correo]) //Migracion no creada?
    var body = req.body
    var obtenerPrecios = 'SELECT precio FROM platos WHERE id IN ('
    var obtenerPreciosOpcionales = 'SELECT precio FROM opcionales WHERE id IN ('
    var insertar = 'INSERT INTO opcional_pedido_plato (plato_id, opcional_id, pedido_id, N_orden) values '

    for(var i=1; i<req.body.length; i++){
        obtenerPrecios+=req.body[i].plato+','
        console.log(req.body[i].opcionales)
        if(req.body[i].opcionales.length>0)
            for(var j=0; j<req.body[i].opcionales.length; j++){
                obtenerPreciosOpcionales+=req.body[i].opcionales[j]+','
                insertar+=`(${req.body[i].plato} , ${req.body[i].opcionales[j]}, IDPEDIDO, ${i}), `
            }
        else
            insertar+=`(${req.body[i].plato} , NULL, IDPEDIDO, ${i}), `
    }
    
    obtenerPrecios = obtenerPrecios.slice(0,-1) + ')'
    obtenerPreciosOpcionales = obtenerPreciosOpcionales.slice(0,-1) + ')'
    insertar = insertar.slice(0,-2) + ';'

    idPedido=32

    insertar = insertar.replaceAll('IDPEDIDO',`${idPedido}`)

    

    console.log(insertar)

    var respuestaPrecios = await pool.query(obtenerPrecios)

    if(respuestaPrecios.rows.length > 0){
        for(var k=0; k<respuestaPrecios.rows.length; k++)
            precio += respuestaPrecios.rows[k].precio
        var respuestaPreciosOpcionales = await pool.query(obtenerPreciosOpcionales)
        if(respuestaPreciosOpcionales.rows.length > 0){
            for(var l=0; l<respuestaPreciosOpcionales.rows.length; l++)
                precio += respuestaPreciosOpcionales.rows[l].precio
            console.log(precio)
        } else {
            //error res.status(codigo).json({error: 'texto del error'})
        }
    } else {
        //error res.status(codigo).json({error: 'texto del error'})
    }
    //const respuesta = await pool.query('SELECT * FROM pedidos WHERE cliente_id;') //Falta cliente_id en la tabla de pedidos
    //if(respuesta.rows.length > 0){
        //res.status(200).json(respuesta.rows);
    //} else {
        //error res.status(codigo).json({error: 'texto del error'})
    //}
    res.send("ok")
}

module.exports = controller