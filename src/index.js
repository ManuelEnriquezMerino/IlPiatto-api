const express =require('express')
const app = express()

//routes
const routes = require('./routes/index.routes')

app.use(routes)

app.listen(3000, ()=>{
    console.log('Servidor a la espera de conexiones')
})