const controller = {}

controller.index = (req,res) => {
    res.send('La conexion ha sido correcta desde index.controller')
}

module.exports = controller