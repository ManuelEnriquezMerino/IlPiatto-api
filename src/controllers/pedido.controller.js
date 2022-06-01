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


function generarInsertOpcionalPedidoPlato(body){
    var insertarPedido = 'INSERT INTO opcional_pedido_plato (plato_id, opcional_id, pedido_id, n_orden) values '
    for(var i=0; i<body.length; i++){
        if(body[i].opcionales.length==0)
            insertarPedido+=`(${body[i].plato} , NULL, IDPEDIDO, ${i}), `
        else
            for(var j=0; j<body[i].opcionales.length; j++)
                insertarPedido+=`(${body[i].plato} , ${body[i].opcionales[j]}, IDPEDIDO, ${i}), `
                
    }
    insertarPedido = insertarPedido.slice(0,-2) + ';'
    return insertarPedido
}

function generarSelectPrecioOpcionales(body){ //VERIFICAR QUE LOS OPCIONALES PERTENECEN AL PLATO
    var obtenerPreciosOpcionales = 'SELECT precio FROM opcionales WHERE id IN ('
    for(var i=0; i<body.length; i++){
        for(var j=0; j<body[i].opcionales.length; j++)
            obtenerPreciosOpcionales+=body[i].opcionales[j]+','
    }
    obtenerPreciosOpcionales = obtenerPreciosOpcionales.slice(0,-1) + ')'
    return obtenerPreciosOpcionales
}

function generarSelectPrecio(body){
    var obtenerPrecios = 'SELECT precio FROM platos WHERE id IN ('
    for(var i=0; i<body.length; i++){
        obtenerPrecios+=body[i].plato+','
    }
    obtenerPrecios = obtenerPrecios.slice(0,-1) + ')'
    return obtenerPrecios
}

async function calcularPrecioOpcionales(obtenerPrecioOpcionales){
    var precioOpcionales = 0
    var respuestaPreciosOpcionales = await pool.query(obtenerPrecioOpcionales)
        if(respuestaPreciosOpcionales.rows.length > 0){
            for(var i=0; i<respuestaPreciosOpcionales.rows.length; i++)
                precioOpcionales += respuestaPreciosOpcionales.rows[i].precio
        } 
    return precioOpcionales
}

async function calcularPrecio(obtenerPrecio, obtenerPrecioOpcionales){
    var precio = 0
    var respuestaPrecios = await pool.query(obtenerPrecio)
    if(respuestaPrecios.rows.length > 0){
        for(var i=0; i<respuestaPrecios.rows.length; i++){
            precio += respuestaPrecios.rows[i].precio
        }
        precio += await calcularPrecioOpcionales(obtenerPrecioOpcionales)
    } else {
        //error res.status(codigo).json({error: 'texto del error'})
    }
    return precio
}

controller.postPedido = async(req,res) => {
    const email = req.auth.payload['https://ilpiatto.com/email']
    const queryIDUsuario = await pool.query(`SELECT id FROM clientes WHERE email='${email}';`)

    if(queryIDUsuario.rows.length > 0)
        var idUsuario = queryIDUsuario.rows[0].id

    var body = req.body

    var obtenerPrecios = generarSelectPrecio(body.pedido)
    var obtenerPreciosOpcionales = generarSelectPrecioOpcionales(body.pedido)
    var insertarOpcionalPedidoPlato = generarInsertOpcionalPedidoPlato(body.pedido)

    var precio = await calcularPrecio(obtenerPrecios,obtenerPreciosOpcionales)

    const resultadoQuery = await pool.query(`INSERT INTO pedidos 
                        (fecha,direccion,precio,cliente_id,created_at,updated_at)
                    VALUES
                        (current_timestamp,'${body.direccion}',${precio},${idUsuario},current_timestamp,current_timestamp)
                    RETURNING id;`)

    var idPedido = resultadoQuery.rows[0].id;

    insertarOpcionalPedidoPlato = insertarOpcionalPedidoPlato.replaceAll('IDPEDIDO',`${idPedido}`)
    
    await pool.query(insertarOpcionalPedidoPlato)

    res.send("ok")
}




module.exports = controller
