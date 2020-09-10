const gen = require('./generateFile.js')

for (let i = 1; i < 201; i++) {
  gen.generateAnswers(i)
}

for (let i = 1; i < 101; i++) {
  gen.generateQuestions(i)
}