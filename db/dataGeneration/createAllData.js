const gen = require('./generateFile.js')

for (let i = 1; i < 801; i++) {
  gen.generateAnswers(i)
}

for (let i = 1; i < 401; i++) {
  gen.generateQuestions(i)
}