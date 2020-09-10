const fs = require('fs');
const generate = require('./generateData.js');


let generateAnswers = (number) => {
  let dataGen = {}

  for (let i = 1; i < 25001; i++) {
    dataGen[i] = generate.generateAnswerEntry()
  }

  let data = JSON.stringify(dataGen)

  if (fs.existsSync(`db/dataGeneration/data/answers/25KAnswer${number}.json`) === false) {
    fs.writeFile(`db/dataGeneration/data/answers/25KAnswer${number}.json`, data, (err) => {
      if (err) {
        console.log('There was an error writing the file')
      } else {
        console.log('The file was written successfully')
      }
    })
  }
}

let generateQuestions = (number) => {
  let dataGen = {}

  for (let i = 1; i < 25001; i++) {
    dataGen[i] = generate.generateQuestionEntry()
  }

  let data = JSON.stringify(dataGen)

  if (fs.existsSync(`db/dataGeneration/data/questions/25KQuestions${number}.json`) === false) {
    fs.writeFile(`db/dataGeneration/data/questions/25KQuestions${number}.json`, data, (err) => {
      if (err) {
        console.log('There was an error writing the file')
      } else {
        console.log('The file was written successfully')
      }
    })
  }
}

module.exports = {
  generateAnswers,
  generateQuestions
}