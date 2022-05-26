const controller = {}
const { Pool } = require('pg/lib')
const pool = require('../database')

controller.index = (req,res) => {
    {
        pool.query('SELECT * FROM platos;', (error, results) => {
          if (error) {
            console.log(pool)
            throw error
          }
          res.status(200).json(results.rows)
        })
    }
}

module.exports = controller