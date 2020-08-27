const { Pool } = require('pg')
const config = require('./config.json');
const schema = require('./schema.js');

const pool = new Pool(config)

const createTable = async (query) => {
  const client = await pool.connect()
  await client.query(query)
  client.release()
}

// console.log('config', config)
// console.log('schema', schema)
// createTable(schema.pgSchema.questions)
// createTable(schema.pgSchema.answers)