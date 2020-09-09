const fs = require('fs');
const generate = require('./generateData.js');

let dataGen = {}

for (let i = 1; i < 1000001; i++) {
  dataGen[i] = generate.generateAnswerEntry()
}

let data = JSON.stringify(dataGen)

fs.writeFile('1MAnswers5.json', data, (err) => {
  if (err) {
    console.log('There was an error writing the file')
  } else {
    console.log('The file was written successfully')
  }
})