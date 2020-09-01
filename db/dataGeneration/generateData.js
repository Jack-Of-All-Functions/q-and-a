const fs = require('fs');
const faker = require('faker');

// Helper functions to generate random data
let randomName = () => {
  return faker.name.findName()
}
let randomDate = () => {
  return faker.date.between("2020-08-26T23:26:05.932Z", "2020-11-26T23:26:05.932Z")
}
let randomBody = () => {
  return faker.lorem.sentence()
}
let randomNum = (max) => {
  return Math.floor(Math.random() * max) + 1
}
let randomBool = () => {
  if (randomNum(11) > 10) {
    return true
  } else {
    return false
  }
}
let randomImg = () => {
  let array = []
  for (let i = 0; i < (randomNum(2) - 1); i++) {
    array.push(faker.image.image())
  }
  return array
}

// Generate the entries
let generateQuestionEntry = () => {
  return {
    product_id: randomNum(1000000),
    question_body: randomBody(),
    question_date: `${randomDate()}`,
    asker_name: randomName(),
    question_helpfulness: randomNum(10),
    reported: randomBool()
  }
}

let generateAnswerEntry = () => {
  return {
    question_id: randomNum(1000000),
    body: randomBody(),
    date: `${randomDate()}`,
    answerer_name: randomName(),
    helpfulness: randomNum(10),
    photos: randomImg()
  }
}

// console.log(generateQuestionEntry())
// console.log(generateAnswerEntry())
module.exports ={
  generateAnswerEntry,
  generateQuestionEntry,
}