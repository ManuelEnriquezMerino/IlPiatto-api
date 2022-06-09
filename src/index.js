const express = require('express')
const app = express()
const cors = require("cors");
app.use(cors());


//routes
const routesPedido = require('./routes/pedido.routes')
const routesPlato = require('./routes/plato.routes')
const routesUsuario = require('./routes/usuario.routes')

//swagger
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
const swaggerOptions = require('./swaggerOptions')
const specs = swaggerJsdoc(swaggerOptions);
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs)
);

app.use('/pedidos',routesPedido)
app.use('/platos',routesPlato)
app.use('/usuarios',routesUsuario)

app.all('*', function(req, res) {
    throw [400,"Ruta invalida"]
})
app.use(function(err, req, res, next) {
    res.status(err[0]).json({codigo:err[0], mensaje: err[1]});
})


app.listen(process.env.PORT, ()=>{
    console.log('Servidor a la espera de conexiones')
})