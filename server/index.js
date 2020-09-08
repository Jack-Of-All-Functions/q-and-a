const express = require("express");
const Router = require('express-promise-router');
const axios = require("axios");
const path = require("path");
const db = require('../db/db.js');
const apiUrl = 'http://52.26.193.201:3000/';
const prefix = '/qa';

const app = express();
const router = Router();

app.use(router);

app.use(express.static('public'));

app.use(express.json());

// should fix CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// should send bundle.js file
app.get('/qaModule', (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../public/dist/bundle.js'));
});

// function to convert date
const dateConvert = (date) => {
  let dateArray = date.split(' ')
  let monthObj = {Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06', Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'}
  return dateArray[3] + '-' + monthObj[dateArray[1]] + '-' + dateArray[2]
}

app.get(prefix + '/questions', (req, res) => {
  let { qLimit, aLimit, product_id } = req.query;
  // GET /qa/:product_id

  let currentQuery = 'SELECT question_id, question_body, question_date, asker_name, question_helpfulness FROM questions WHERE product_id = $1 AND reported = false'
  // console.log('Current product_id', product_id)

  db.query(currentQuery, [product_id], (err, response) => {
    if (err) {
      console.log(err)
    }

    let allQuestions = response.rows
    // checks if there is more than qLimit questions
    let isMoreQuestions = allQuestions.length > qLimit;

    // Get answers for the questions
    let answerQuery = ``
    allQuestions.forEach((object, i) => {
      answerQuery += `SELECT question_id, answer_id, body, date, answerer_name, helpfulness, photos FROM answers WHERE question_id = ${object.question_id} AND reported = false`
      if (response.rows[i + 1] !== undefined) {
        answerQuery += ` UNION `
      } else {
        answerQuery += `;`
      }
    })
    // console.log('Current answerQuery', answerQuery)

    // Query for the answers
    db.query(answerQuery, null, (err, response) => {
      if (err) {
        console.log(err)
      }

      // Filter through the answers and match them with the corresponding questions
      allQuestions.forEach(question => {
        // Convert date to correct format
        if (question.question_date.length !== 24) {
          question.question_date = dateConvert(question.question_date)
        }
        response.rows.forEach(answer => {
          // Convert date to correct format
          if (answer.date.length > 10 && answer.date.length !== 24) {
            answer.date = dateConvert(answer.date)
          }
          if (answer.id === undefined) {
            answer.id = answer.answer_id
          }
          // Match the questions to answers
          if (question.question_id === answer.question_id) {
            if (question.answers === undefined) {
              question.answers = {[answer.answer_id]: answer}
            } else {
              question.answers[answer.id] = answer
            }
          }
        })
        if (question.answers === undefined) {
          question.answers = {}
        }
      })
      // limits amount of questions displayed
      let questions = allQuestions.slice(0, qLimit);
      res.send({ questions, isMoreQuestions });
    })
  })
});

app.get(prefix + '/moreAnswers', (req, res) => {
  const { question_id } = req.query;

  let currentQuery = `SELECT answer_id, body, date, answerer_name, helpfulness, photos FROM answers WHERE question_id = $1 AND reported = false`

  db.query(currentQuery, [question_id], (err, response) => {
    if (err) {
      console.log(err)
    }
    let a = response.rows
    a.forEach(answer => {
      if (answer.date.length > 10 && answer.date.length !== 24) {
        answer.date = dateConvert(answer.date)
      }
      answer.id = answer.answer_id
    })
    let answers = a
    let isMoreAnswers = false;
    res.send({ answers, isMoreAnswers});
  })
});

app.put(prefix + '/answer/helpful', (req, res) => {
  let answer_id = req.body.answer_id;

  let currentQuery = `UPDATE answers SET helpfulness = helpfulness + 1 WHERE answer_id = ${answer_id}`
  db.query(currentQuery, null, (err, response) => {
    if (err) {
      console.log(err)
    }
    res.sendStatus(204).end();
  })
});

app.put(prefix + '/answer/report', (req, res) => {
  let answer_id = req.body.answer_id;

  let currentQuery = `UPDATE answers SET reported = true WHERE answer_id = ${answer_id}`
  db.query(currentQuery, null, (err, response) => {
    if (err) {
      console.log(err)
    }
    res.sendStatus(204).end();
  })
});

app.put(prefix + '/question/helpful', (req, res) => {
  let question_id = req.body.question_id;

  let currentQuery = `UPDATE questions SET question_helpfulness = question_helpfulness + 1 WHERE question_id = ${question_id}`
  db.query(currentQuery, null, (err, response) => {
    if (err) {
      console.log(err)
    }
    res.sendStatus(204).end()
  })
});

app.put(prefix + '/question/report', (req, res) => {
  let question_id = req.body.question_id;

  let currentQuery = `UPDATE questions SET reported = true WHERE question_id = ${question_id}`
  db.query(currentQuery, null, (err, response) => {
    if (err) {
      console.log(err)
    }
    res.sendStatus(204).end()
  })
});

app.post(prefix + '/question/add', (req, res) => {
  let { product_id, ...questionSub } = req.body;
  let timestamp = new Date().toJSON()
  let questionObj = {question_body: questionSub.body, question_date: timestamp, asker_name: questionSub.name, question_helpfulness: 0, reported: false}

  let currentQuery = `INSERT INTO questions(product_id, question_body, question_date, asker_name, question_helpfulness, reported) VALUES (${product_id}, '${questionObj.question_body}', '${questionObj.question_date}', '${questionObj.asker_name}', ${questionObj.question_helpfulness}, ${questionObj.reported})`

  db.query(currentQuery, null, (err, response) => {
    if (err) {
      console.log(err)
    }
    res.sendStatus(201).end()
  })
});

app.post(prefix + '/answer/add', (req, res) => {
  let { question_id, ...answerSub } = req.body;
  let timestamp = new Date().toJSON()
  let photos = ``
  answerSub.photos.forEach((photo, i, array) => {
    photos += `"${photo}"`
    if (array[i + 1] !== undefined) {
      photos += ', '
    }
  })
  let answerObj = {body: answerSub.body, date: timestamp, answerer_name: answerSub.name, helpfulness: 0, photos: photos, reported: false}

  let currentQuery = `INSERT INTO answers(question_id, body, date, answerer_name, helpfulness, photos, reported) VALUES (${question_id}, '${answerObj.body}', '${answerObj.date}', '${answerObj.answerer_name}', ${answerObj.helpfulness}, '{${answerObj.photos}}', ${answerObj.reported})`

  db.query(currentQuery, null, (err, response) => {
    if (err) {
      console.log(err)
    }
    res.sendStatus(201).end()
  })
});

const port = 3002;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});