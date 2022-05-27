const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')

controller.index = (req,res) => {
    {
        pool.query('SELECT * FROM platos WHERE id in (SELECT plato_id FROM categoria_plato where categoria_id=1)', (error, results) => { //Sentencia con filtrado sql
          if (error) {
            console.log(pool)
            throw error
          }
          res.status(200).json(results.rows)
        })
    }
}

module.exports = controller