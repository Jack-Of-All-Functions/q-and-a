const express = require("express");
const axios = require("axios");
const path = require("path");
const apiUrl = 'http://52.26.193.201:3000/';
const prefix = '/qa';

let app = express();

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

app.get(prefix + '/questions', (req, res) => {
  let { qLimit, aLimit, product_id } = req.query;
  // GET /qa/:product_id
  // Takes in product_id, page, count?
  // Outputs response

  let response = {
    "product_id": "5",
    "results": [{
          "question_id": 37,
          "question_body": "Why is this product cheaper here than other sites?",
          "question_date": "2018-10-18T00:00:00.000Z",
          "asker_name": "williamsmith",
          "question_helpfulness": 4,
          "reported": 0,
          "answers": {
            68: {
              "id": 68,
              "body": "We are selling it here without any markup from the middleman!",
              "date": "2018-08-18T00:00:00.000Z",
              "answerer_name": "Seller",
              "helpfulness": 4,
              "photos": []
            }
          }
        },
        {
          "question_id": 38,
          "question_body": "How long does it last?",
          "question_date": "2019-06-28T00:00:00.000Z",
          "asker_name": "funnygirl",
          "question_helpfulness": 2,
          "reported": 0,
          "answers": {
            70: {
              "id": 70,
              "body": "Some of the seams started splitting the first time I wore it!",
              "date": "2019-11-28T00:00:00.000Z",
              "answerer_name": "sillyguy",
              "helpfulness": 6,
              "photos": [],
            },
            78: {
              "id": 78,
              "body": "9 lives",
              "date": "2019-11-12T00:00:00.000Z",
              "answerer_name": "iluvdogz",
              "helpfulness": 31,
              "photos": [],
            }
          }
        },
    ]
  }


  // let allQuestions = [];
  // checks if there is more than qLimit questions
  // let isMoreQuestions = allQuestions.length > qLimit;
  // limits amount of questions displayed
  // let questions = allQuestions.slice(0, qLimit);
  // res.send({ questions, isMoreQuestions });
  res.send({ response.results, false })
});

app.get(prefix + '/moreAnswers', (req, res) => {
  let { question_id } = req.query;
  let url = apiUrl + `qa/${question_id}/answers`;
  // GET /qa/:question_id/answers
  // Input question_id, page, count
  // Output response

  let response = {
    "question": "1",
    "page": 0,
    "count": 5,
    "results": [
      {
        "answer_id": 8,
        "body": "What a great question!",
        "date": "2018-01-04T00:00:00.000Z",
        "answerer_name": "metslover",
        "helpfulness": 8,
        "photos": [],
      },
      {
        "answer_id": 5,
        "body": "Something pretty durable but I can't be sure",
        "date": "2018-01-04T00:00:00.000Z",
        "answerer_name": "metslover",
        "helpfulness": 5,
        "photos": [{
            "id": 1,
            "url": "urlplaceholder/answer_5_photo_number_1.jpg"
          },
          {
            "id": 2,
            "url": "urlplaceholder/answer_5_photo_number_2.jpg"
          },
        ]
      },
    ]
  }

  // let answers = response.data.results;
  // let isMoreAnswers = false;
  // res.send({ answers, isMoreAnswers });
  res.send({ response.results, false })
});

app.put(prefix + '/answer/helpful', (req, res) => {
  let answer_id = req.body.answer_id;
  // let url = apiUrl + `qa/answer/${answer_id}/helpful`;
  // PUT /qa/answer/:answer_id/helpful
  // Updates an answer to show it was found helpful.
  res.sendStatus(204).end();
});

app.put(prefix + '/answer/report', (req, res) => {
  let answer_id = req.body.answer_id;
  // let url = apiUrl + `qa/answer/${answer_id}/report`;
  // PUT /qa/answer/:answer_id/report
  // Updates an answer to show it has been reported. Note, this action does not delete the answer,
  // but the answer will not be returned in the above GET request.
  res.sendStatus(204).end();
});

app.put(prefix + '/question/helpful', (req, res) => {
  let question_id = req.body.question_id;
  // let url = apiUrl + `qa/question/${question_id}/helpful`;
  // PUT /qa/question/:question_id/helpful
  // Updates a question to show it was found helpful.
  res.sendStatus(204).end()
});

app.put(prefix + '/question/report', (req, res) => {
  let question_id = req.body.question_id;
  // let url = apiUrl + `qa/question/${question_id}/report`;
  // PUT /qa/question/:question_id/report
  // Updates a question to show it was reported. Note, this action does not delete the question,
  // but the question will not be returned in the above GET request.
  res.sendStatus(204).end()
});

app.post(prefix + '/question/add', (req, res) => {
  let { product_id, ...questionSub } = req.body;
  // let url = apiUrl + `qa/${product_id}`;
  // POST /qa/:product_id
  // Input: product_id, body: body, name, email (questionSub)
  res.sendStatus(201).end()
});

app.post(prefix + '/answer/add', (req, res) => {
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