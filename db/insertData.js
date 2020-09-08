const { Pool } = require('pg')
const config = require('./config.json');
const fs = require('fs');

const pool = new Pool(config)

let getData = (file, callback) => {
  let dataInsert;
  let start = Date.now()
  fs.readFile(file, (err, data) => {
    if (err) {
      console.log('There was an error reading the file')
    } else {
      dataInsert = JSON.parse(data)
      console.log('File was successfully read')
      insertData(dataInsert, (number) => {
        console.log(`Current entry: ${number}`)
      }, callback, start)
    }
  })
}

let insertFunction = async (query, callback, time, i) => {
  const client = await pool.connect()
  await client.query(query)
  if (i % 100000 === 0) {
    console.log('Inserted', i)
    callback(time)
  }
  client.release()
}

let insertData = (data, callback, callback2, timeStart) => {
  console.log('Data was received')
  for (let i = 1; i < 1000001; i++) {
    let currentDataInsert = data[i]
    let keys = Object.keys(currentDataInsert).join(', ')
    let values = ``
    let valueArray = Object.values(currentDataInsert).forEach((value) => {
      // console.log('value: ', value)
      // console.log('type of: ', typeof value)
      if (typeof value === 'string') {
        if (value.indexOf("'") !== -1) {
          let badCharIdx = value.indexOf("'")
          value = value.substring(0, badCharIdx) + value.substring(badCharIdx + 1, value.length)
        }
        values += `'${value}', `
      } else {
        if (typeof value === 'object') {
          values += `ARRAY [ '${value}' ], `
        } else {
          values += `${value}, `
        }
      }
    })
    values = values.slice(0, -2)

    let currentQuery = `INSERT INTO answers (${keys}) VALUES (${values});`

    // console.log('query', currentQuery)

    insertFunction(currentQuery, callback2, timeStart, i)
  }
}

getData('./db/dataGeneration/data/1MAnswers20.json', (start) => {
  let end = Date.now()
  let elapsed = (end - start) / 1000
  console.log(`Time elapsed ${elapsed} seconds`)
})