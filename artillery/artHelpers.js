const data = require('/Users/sid/Documents/SEI/Senior Phase/SDC/q+a/q_and_a_module/db/dataGeneration/generateData.js');

function getProductId(context, ee, next) {
  context.vars.productId = random(1, 1000000)
  return next()
}

function getQuestionId(context, ee, next) {
  context.vars.questionId = random(1, 10000000);
  return next()
}

function getAnswerId(context, ee, next) {
  context.vars.answerId = random(1, 5)
  return next()
}

function prepAnswerPost(requestParams, context, ee, next) {
  let answerData = data.generateAnswerEntry()
  requestParams.json.question_id = answerData.question_id
  requestParams.json.body = answerData.body
  requestParams.json.date = answerData.date
  requestParams.json.answerer_name = answerData.answerer_name
  requestParams.json.helpfulness = answerData.helpfulness
  requestParams.json.reported = answerData.reported
  requestParams.json.photos = answerData.photos

  return next()
}

function prepQuestionPost(requestParams, context, ee, next) {
  let questionData = data.generateQuestionEntry()
  requestParams.json.product_id = questionData.product_id
  requestParams.json.question_body = questionData.question_body
  requestParams.json.question_date = questionData.question_date
  requestParams.json.asker_name = questionData.asker_name
  requestParams.json.question_helpfulness = questionData.question_helpfulness
  requestParams.json.reported = questionData.reported

  return next()
}
// Helper functions

function random(start, end) {
  return Math.floor(Math.random() * (end - start + 1))
}

module.exports = {
  getProductId,
  getQuestionId,
  getAnswerId,
  prepAnswerPost,
  prepQuestionPost
}