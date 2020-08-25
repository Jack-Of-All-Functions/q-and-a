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

app.get(prefix + '/questions', async (req, res) => {
  let { qLimit, aLimit, product_id } = req.query;
  let url = apiUrl + 'qa/' + product_id;

  let allQuestions = [];
  let page = 0;

  // loops until the response result is empty
  // assumes that no page has more than 20 results
  do {
    let { data: response } = await axios.get(url, { params: { page: ++page, count: 20 } });
    if (response.results.length === 0) break;
    allQuestions = allQuestions.concat(response.results);
  } while (true)

  // checks if there is more than qLimit questions
  let isMoreQuestions = allQuestions.length > qLimit;

  // limits amount of questions displayed
  let questions = allQuestions.slice(0, qLimit);

  // limits amount of answers per question displayed
  for (let i = 0; i < questions.length; i++) {
    let limitedAnswers = {};

    let ids = Object.keys(questions[i].answers);
    let j = 0;
    while (Object.keys(limitedAnswers).length < aLimit && ids.length !== 0) {
      limitedAnswers[ids[j]] = questions[i].answers[ids[j]];
      j++;
    }

    let isMoreAnswers = aLimit < ids.length;
    limitedAnswers.isMoreAnswers = isMoreAnswers;

    questions[i].answers = limitedAnswers;
  }

  res.send({ questions, isMoreQuestions });
});

app.get(prefix + '/moreAnswers', (req, res) => {
  let { question_id } = req.query;
  let url = apiUrl + `qa/${question_id}/answers`;

  axios.get(url)
    .then((response) => {
      let answers = response.data.results;
      let isMoreAnswers = false;
      res.send({ answers, isMoreAnswers });
    })
    .catch((err) => {
      console.log(err);
    })
});

app.put(prefix + '/answer/helpful', (req, res) => {
  let answer_id = req.body.answer_id;
  let url = apiUrl + `qa/answer/${answer_id}/helpful`;

  axios.put(url)
    .then(() => {
      res.send();
    })
});

app.put(prefix + '/answer/report', (req, res) => {
  let answer_id = req.body.answer_id;
  let url = apiUrl + `qa/answer/${answer_id}/report`;

  axios.put(url)
    .then(() => {
      res.send();
    })
    .catch((err) => {
      console.log(err);
    })
});

app.put(prefix + '/question/helpful', (req, res) => {
  let question_id = req.body.question_id;
  let url = apiUrl + `qa/question/${question_id}/helpful`;

  axios.put(url)
    .then(() => {
      res.send();
    })
});

app.put(prefix + '/question/report', (req, res) => {
  let question_id = req.body.question_id;
  let url = apiUrl + `qa/question/${question_id}/report`;

  axios.put(url)
    .then(() => {
      res.send();
    })
});

app.post(prefix + '/question/add', (req, res) => {
  let { product_id, ...questionSub } = req.body;
  let url = apiUrl + `qa/${product_id}`;

  axios.post(url, questionSub)
    .then((response) => {
      res.send(response.data);
    })
});

app.post(prefix + '/answer/add', (req, res) => {
  let { question_id, ...answerSub } = req.body;
  let url = apiUrl + `qa/${question_id}/answers`;

  axios.post(url, answerSub)
    .then((response) => {
      res.send();
    })
    .catch((err) => {
      console.log(err);
    })
});

const port = 3002;

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});