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

router.get(prefix + '/questions', (req, res) => {
  let { qLimit, aLimit, product_id } = req.query;
  // GET /qa/:product_id

  let currentQuery = 'SELECT question_id, question_body, question_date, asker_name, question_helpfulness FROM questions WHERE product_id = $1 AND reported = false'
  console.log('Current product_id', product_id)

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
      answerQuery += `SELECT question_id, answer_id, body, date, answerer_name, helpfulness, photos FROM answers WHERE question_id = ${object.question_id}`
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
      // console.log('Response from the answerQuery', response.rows)

      // Filter through the answers and match them with the corresponding questions
      allQuestions.forEach(question => {
        // Convert date to correct format
        question.question_date = dateConvert(question.question_date)
        response.rows.forEach(answer => {
          // Convert date to correct format
          if (answer.date.length > 10) {
            answer.date = dateConvert(answer.date)
          }
          // Match the questions to answers
          if (question.question_id === answer.question_id) {
            if (question.answers === undefined) {
              question.answers = [answer]
            } else {
              question.answers.push(answer)
            }
          }
        })
      })
      // limits amount of questions displayed
      let questions = allQuestions.slice(0, qLimit);
      res.send({ questions, isMoreQuestions });
    })
  })
});

router.get(prefix + '/moreAnswers', (req, res) => {
  const { question_id } = req.query;
  const url = apiUrl + `qa/${question_id}/answers`;

  let currentQuery = `SELECT answer_id, body, date, answerer_name, helpfulness, photos FROM answers WHERE question_id = $1`
  // console.log('Current question_id', question_id)

  db.query(currentQuery, [question_id], (err, response) => {
    if (err) {
      console.log(err)
    }
    // DO THINGS WITH THE RESPONSE HERE
    let a = response.rows
    a.forEach(answer => {
      answer.date = dateConvert(answer.date)
    })
    let answers = {
      question: question_id,
      results: a
    }
    // let isMoreAnswers = false;
    // let result = { data: { answers, isMoreAnswers: false }}
    res.send({ answers, isMoreAnswers: false });
  })
});

router.put(prefix + '/answer/helpful', (req, res) => {
  let answer_id = req.body.answer_id;
  // let url = apiUrl + `qa/answer/${answer_id}/helpful`;
  // PUT /qa/answer/:answer_id/helpful
  // Updates an answer to show it was found helpful.
  res.sendStatus(204).end();
});

router.put(prefix + '/answer/report', (req, res) => {
  let answer_id = req.body.answer_id;
  // let url = apiUrl + `qa/answer/${answer_id}/report`;
  // PUT /qa/answer/:answer_id/report
  // Updates an answer to show it has been reported. Note, this action does not delete the answer,
  // but the answer will not be returned in the above GET request.
  res.sendStatus(204).end();
});

router.put(prefix + '/question/helpful', (req, res) => {
  let question_id = req.body.question_id;
  // let url = apiUrl + `qa/question/${question_id}/helpful`;
  // PUT /qa/question/:question_id/helpful
  // Updates a question to show it was found helpful.
  res.sendStatus(204).end()
});

router.put(prefix + '/question/report', (req, res) => {
  let question_id = req.body.question_id;
  // let url = apiUrl + `qa/question/${question_id}/report`;
  // PUT /qa/question/:question_id/report
  // Updates a question to show it was reported. Note, this action does not delete the question,
  // but the question will not be returned in the above GET request.
  res.sendStatus(204).end()
});

router.post(prefix + '/question/add', (req, res) => {
  let { product_id, ...questionSub } = req.body;
  // let url = apiUrl + `qa/${product_id}`;
  // POST /qa/:product_id
  // Input: product_id, body: body, name, email (questionSub)
  res.sendStatus(201).end()
});

router.post(prefix + '/answer/add', (req, res) => {
  let { question_id, ...answerSub } = req.body;
  // let url = apiUrl + `qa/${question_id}/answers`;
  // POST /qa/:question_id/answers
  // Input: question_id, body: body, name, email, photos
  res.sendStatus(201).end()
});

const port = 3002;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});