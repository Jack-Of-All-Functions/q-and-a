const { Pool } = require('pg')
const config = require('./config.json');
const schema = require('./schema.js');
const data = require('./dataGeneration/generateData.js');

const pool = new Pool(config)

const queryDb = async (query) => {
  const client = await pool.connect()
  await client.query(query)
  client.release()
}

queryDb(schema.pgSchema.questions)
queryDb(schema.pgSchema.answers)

module.exports = {
  query: (text, params, callback) => {
    // let start = Date.now()
    return pool.query(text, params, (err, res) => {
      // let timeTaken = Date.now() - start
      // console.log('executed query', { text, timeTaken })
      callback(err, res)
    })
  }
}