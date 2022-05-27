const express =require('express')
const app = express()

//routes //VER ESTO
const routes = require('./routes/plato.routes')

app.use(routes)

app.listen(3000, ()=>{
    console.log('Servidor a la espera de conexiones')
})