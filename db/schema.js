// PostgreSQL
const pgSchema = {
  //Question Table
  questions: `CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL Primary Key,
    product_id INT not NULL,
    question_body VARCHAR(255) not NULL,
    question_date VARCHAR(100) not NULL,
    asker_name VARCHAR(100) not NULL,
    question_helpfulness INT not NULL,
    reported BOOLEAN
  );`,

  //Answers Table
  answers: `CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL Primary Key,
    question_id INT not NULL,
    answer_body VARCHAR(255) not NULL,
    answer_date VARCHAR(100) not NULL,
    answerer_name VARCHAR(100) not NULL,
    answer_helpfulness INT not NULL,
    answer_photos TEXT [],
    FOREIGN KEY (question_id)
    REFERENCES questions (question_id)
  );`
}

// const mgSchema = {
//   question_id: mongoose.ObjectId,
//   product_id: Number,
//   question_body: String,
//   question_date: Date,
//   asker_name: String,
//   question_helpfulness: Number,
//   reported: Boolean,
//   answers: [{
//     answer_id: Number,
//     question_id: mongoose.ObjectId,
//     answer_body: String,
//     answer_date: Date,
//     answerer_name: String,
//     answer_helpfulness: Number,
//     answer_photos: [String]
//   }]
// }

module.exports = {
  pgSchema,
}