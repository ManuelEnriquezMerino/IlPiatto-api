const express = require('express')

//routes
const routesPedido = require('./routes/pedido.routes')
const routesPlato = require('./routes/plato.routes')
const routesUsuario = require('./routes/usuario.routes')
 
const app = express()

app.use('/pedido',routesPedido)
app.use('/plato',routesPlato)
app.use('/usuario',routesUsuario)

app.listen(3000, ()=>{
    console.log('Servidor a la espera de conexiones')
})