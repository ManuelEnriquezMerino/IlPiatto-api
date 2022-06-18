const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')
const atributos = 'id,fecha,direccion,precio,cliente_id' //Ver que atributos traer

async function obtenerIDUsuario(email){
    const queryIDUsuario = await pool.query(`SELECT id FROM clientes WHERE email='${email}';`)
    if(queryIDUsuario.rows.length > 0)
        return queryIDUsuario.rows[0].id
    else
       throw [404,"Error al obtener datos del usuario"]
}

controller.getPedidos = async(req,res) => {
    try {
        const idUsuario = await obtenerIDUsuario(req.auth.payload['https://ilpiatto.com/email'])
        const respuesta = await pool.query(`SELECT ${atributos} FROM pedidos WHERE cliente_id=${idUsuario};`)
        if(respuesta.rows.length > 0){
            res.status(200).json({codigo:200,pedidos:respuesta.rows});
        } else {
            res.status(404).json({codigo:404,error: 'El usuario no cuenta con pedidos'})
        }
    } catch(error) {
        res.status(error[0]).json({codigo:error[0],error: error[1]})
    }
}

controller.getPedidoID = async(req,res) => {
    try {
        const idPedido = req.params.id
        const pedido = await pool.query(`SELECT id,fecha,direccion,precio,cliente_id FROM pedidos WHERE id=${idPedido};`)
        if(pedido.rows.length == 0)
            res.status(404).json({codigo:404,error: 'El pedido no existe'})

        const idUsuario = await obtenerIDUsuario(req.auth.payload['https://ilpiatto.com/email'])
        
        if(pedido.rows[0].cliente_id!=idUsuario)
            res.status(401).json({codigo:401,error: 'No esta autorizado para ver este pedido'})

        const informacionPedido = await pool.query(`SELECT id,opcional_id,pedido_id,plato_id,n_orden FROM opcional_pedido_plato WHERE pedido_id=${idPedido};`)
        if(informacionPedido.rows.length > 0)
            res.status(200).json({codigo:200,
                                    "fecha": pedido.rows[0].fecha,
                                    "direccion": pedido.rows[0].direccion,
                                    "precio": pedido.rows[0].precio,
                                    "platos":informacionPedido.rows
                                })
        else
            res.status(500).json({codigo:500,error: 'No se pudo obtener los datos del pedido'})
    } catch(error) {
        res.status(error[0]).json({codigo:error[0],error: error[1]})
    }
}

async function validarNuevoPedido(body){

    var claves = Object.keys(body)

    if(claves.length!=2)
        throw [400,"Error en la cantidad de parametros enviados"]
    if(claves[0]!="direccion")
        throw [400,"La primer clave debe ser direccion"]
    if(claves[1]!="pedido")
        throw [400,"La segunda clave debe ser pedido"]
    if(typeof body.direccion!='string')
        throw [400,"La direccion debe ser una cadena de caracteres"]
    if(!Array.isArray(body.pedido))
        throw [400,"El pedido debe ser un arreglo"]
    
    var selectPlatos = "SELECT ("
    var selectPreciosOpcionales = 'SELECT ('
    var tieneOpcionales = false
    var pedido = body.pedido
    for(var i=0; i<pedido.length; i++){
        claves = Object.keys(pedido[i])
        if(claves[0]!="plato")
            throw [400,"La primera clave de los pedidos debe ser plato"]
        if(claves[1]!="opcionales")
            throw [400,"La segunda clave de los pedidos debe ser opcionales"]
        if(isNaN(pedido[i].plato))
            throw [400,"Los platos deben ser un entero"]
        if(!Array.isArray(pedido[i].opcionales))
            throw [400,"Los opcionales deben estar dentro de arreglos"]
        selectPlatos+=`exists (select * from platos where id=${pedido[i].plato}) and `
        for(var j=0; j<pedido[i].opcionales.length; j++){
            selectPreciosOpcionales+=`exists (select * from opcionales where id=${pedido[i].opcionales[j]} and plato_id=${pedido[i].plato}) and `
            tieneOpcionales = true
            if(isNaN(pedido[i].opcionales[j]))
                throw [400,"Los opcionales deben ser un entero"]
        }
    }
    selectPlatos = selectPlatos.slice(0,-5) + ') as platosvalidos;'

    var respuestaPlatos = await pool.query(selectPlatos)
    if(respuestaPlatos.rows.length > 0){
        if(respuestaPlatos.rows[0].platosvalidos==false)
            throw [400,"Se ha ingresado un plato invalido"]
    } else
        throw [500,"Error al validar platos"]

    if(tieneOpcionales){
        selectPreciosOpcionales = selectPreciosOpcionales.slice(0,-5) + ') as opcionalesvalidos;'
        var respuestaPlatosOpcionales = await pool.query(selectPreciosOpcionales)
        if(respuestaPlatosOpcionales.rows.length > 0){
            if(respuestaPlatosOpcionales.rows[0].opcionalesvalidos==false)
                throw [400,"Se ha ingresado un opcional invalido"]
        } else
            throw [500,"Error al validar opcionales"]
    }

    return tieneOpcionales;
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
    insertarPedido = insertarPedido.slice(0,-2) + ' RETURNING id;'
    return insertarPedido
}

function generarSelectPrecioOpcionales(body){
    var obtenerPreciosOpcionales = ""
    for(var i=0; i<body.length; i++){
        for(var j=0; j<body[i].opcionales.length; j++)
            obtenerPreciosOpcionales+=`(SELECT precio FROM opcionales WHERE id=${body[i].opcionales[j]}) UNION ALL`
    }
    obtenerPreciosOpcionales = obtenerPreciosOpcionales.slice(0,-10) + ';'
    return obtenerPreciosOpcionales
}

function generarSelectPrecio(body){
    var obtenerPrecios = ""
    for(var i=0; i<body.length; i++){
        obtenerPrecios+=`(SELECT precio FROM platos WHERE id=${body[i].plato}) UNION ALL`
    }
    obtenerPrecios = obtenerPrecios.slice(0,-10) + ';'
    return obtenerPrecios
}

async function calcularPrecioOpcionales(obtenerPrecioOpcionales){
    var precioOpcionales = 0
    var respuestaPreciosOpcionales = await pool.query(obtenerPrecioOpcionales)
        if(respuestaPreciosOpcionales.rows.length > 0)
            for(var i=0; i<respuestaPreciosOpcionales.rows.length; i++)
                precioOpcionales += respuestaPreciosOpcionales.rows[i].precio
        else
            throw [404,"Error al obtener los opcionales solicitados"]
    return precioOpcionales
}

async function calcularPrecio(obtenerPrecio){
    var precio = 0
    var respuestaPrecios = await pool.query(obtenerPrecio)
    if(respuestaPrecios.rows.length > 0){
        for(var i=0; i<respuestaPrecios.rows.length; i++)
            precio += respuestaPrecios.rows[i].precio
    } else 
        throw [404,"Error al obtener los platos solicitados"]
    return precio
}

controller.postPedido = async(req,res) => {
    try {
        var body = req.body

        const tieneOpcionales = await validarNuevoPedido(body)

        const idUsuario = await obtenerIDUsuario(req.auth.payload['https://ilpiatto.com/email'])

        var obtenerPrecios = generarSelectPrecio(body.pedido)
        
        var precio = await calcularPrecio(obtenerPrecios)

        if(tieneOpcionales){
            var obtenerPreciosOpcionales = generarSelectPrecioOpcionales(body.pedido)
            precio += await calcularPrecioOpcionales(obtenerPreciosOpcionales)
        }

        var insertarOpcionalPedidoPlato = generarInsertOpcionalPedidoPlato(body.pedido)

        const resultadoInsertPedido = await pool.query(`INSERT INTO pedidos 
                            (fecha,direccion,precio,cliente_id,created_at,updated_at)
                        VALUES
                            (current_timestamp,'${body.direccion}',${precio},${idUsuario},current_timestamp,current_timestamp)
                        RETURNING id;`)

        if(resultadoInsertPedido.rows.length > 0)
            var idPedido = resultadoInsertPedido.rows[0].id;
        else
            res.status(409).json({codigo:409,error: "Error al almacenar el nuevo pedido"})

        insertarOpcionalPedidoPlato = insertarOpcionalPedidoPlato.replaceAll('IDPEDIDO',`${idPedido}`)
        const resultadoInsertOpcionalPedidoPlato = await pool.query(insertarOpcionalPedidoPlato)
        if(resultadoInsertOpcionalPedidoPlato.rows.length == 0){
            await pool.query(`DELETE FROM pedidos WHERE id=${idPedido}`)
            res.status(409).json({codigo:409,error: "Error al almacenar el nuevo pedido junto con sus platos y opcionales"})
        }

        res.status(201).json({codigo:201,id: idPedido})
    } catch(error) {
        res.status(error[0]).json({codigo:error[0],error: error[1]})
    }
}

module.exports = controller