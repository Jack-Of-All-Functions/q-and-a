const { Pool } = require('pg')
const config = require('./config.json');
const fs = require('fs');

const pool = new Pool(config)

let getData = (file, callback) => {
  let dataInsert;
  let start = Date.now()
  return new Promise ((resolve, reject) => {
    fs.readFile(file, async (err, data) => {
      if (err) {
        reject(err)
      } else {
        dataInsert = JSON.parse(data)
        // console.log('File was successfully read')
        await insertData(dataInsert, (number) => {
          console.log(`Current entry: ${number}`)
        }, callback, start)
        resolve()
      }
    })
  })
}

let insertFunction = async (query, callback, time, i) => {
  const client = await pool.connect()
  await client.query(query)
  if (i % 25000 === 0) {
    console.log('Inserted', i)
  }
  callback(time)
  client.release()
}

let insertData = async (data, callback, callback2, timeStart) => {
  console.log('Data was received')
  let keyDataInsert = data[1]
  let keys = Object.keys(keyDataInsert).join(', ')
  // console.log('Current Keys', keys)
  let valueList = ''

  let position = 1

  for (let i = 1; i < 25001; i++) {
    let currentDataInsert = data[i]
    // console.log('current data insert', currentDataInsert)
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
    values = `(${values.slice(0, -2)})`

    valueList += `${values}, `

  }
  valueList = valueList.slice(0, -2)

  let currentQuery = `INSERT INTO questions (${keys}) VALUES ${valueList};`
  // console.log('query', currentQuery)
  valueList = ''
  await insertFunction(currentQuery, callback2, timeStart)
  currentQuery = ''
}

let insertQuestions = async () => {
  for (let i = 1; i < 401; i++) {
    await getData(`./db/dataGeneration/data/questions/25KQuestions${i}.json`, (start) => {
      let end = Date.now()
      let elapsed = (end - start) / 1000
      console.log(`Inserted 25KQuestions${i}.json in ${elapsed} seconds`)
    })
  }
}

insertQuestions()

module.exports = {
  insertQuestions,
}
