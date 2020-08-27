const { Pool } = require('pg')
const config = require('./config.json');

const pool = new Pool(config)

// Sample use:
// app.get('/:id', (req, res, next) => {
  // db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, res) => {

module.exports = {
  query: (text, params, callback) => {
    let start = Date.now()
    return pool.query(text, params, (err, res) => {
      let duration = Date.now() - start
      console.log('executed query', { text, duration, rows: res.rowCount })
      callback(err, res)
    })
  }
}