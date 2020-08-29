const { Pool } = require('pg')
const config = require('./config.json');
const schema = require('./schema.js');
const data = require('./dataGeneration/generateData.js');

const pool = new Pool(config)

const createTable = async (query) => {
  const client = await pool.connect()
  await client.query(query)
  client.release()
}

// let testParams = {
//   product_id: 10,
//   question_body: 'Est ea fugiat dolores.',
//   question_date: `2020-10-18T15:36:38.061Z`,
//   asker_name: 'Bradley Beahan',
//   question_helpfulness: 3,
//   reported: true
// }
// let keys = Object.keys(testParams).join(', ')
// let values = ``
// let valueArray = Object.values(testParams).forEach((value) => {
//   if (typeof value === 'string') {
//     values += `'${value}', `
//   } else {
//     values += `${value}, `
//   }
// })
// values = values.slice(0, -2)
// let testQuery = `INSERT INTO questions (${keys}) VALUES (${values});`;

// let testInsert = async (query) => {
//   const client = await pool.connect()
//   await client.query(query)
//   await console.log('query complete')
//   client.release()
// }

// testInsert(testQuery)
// console.log(keys)
// console.log(values)
// console.log(testQuery)
// console.log('config', config)
// console.log('schema', schema)
createTable(schema.pgSchema.questions)
createTable(schema.pgSchema.answers)