// PostgreSQL
const pgSchema = {
  //Question Table
  questions: `CREATE TABLE IF NOT EXISTS questions (
    question_id SERIAL Primary Key,
    // Using "question_" for these fields is redundant. Since they are columns in the "questions" table it is assumed that they belong to a question unless otherwise specified (like product_id)
    product_id INT UNIQUE not NULL,
    question_body VARCHAR(255) not NULL,
    question_date TIMESTAMP not NULL,
    asker_name VARCHAR(50) not NULL,
    question_helpfulness INT not NULL,
    reported BOOLEAN,
  );`,

  //Answers Table
  answers: `CREATE TABLE IF NOT EXISTS answers (
    answer_id SERIAL Primary Key,
    // same note as above about "answer_"
    question_id INT UNIQUE not NULL,
    answer_body VARCHAR(255) not NULL,
    answer_date TIMESTAMP not NULL,
    answerer_name VARCHAR(50) not NULL,
    answer_helpfulness INT not NULL,
    answer_photos TEXT [],
    // While this might work I typically do this with a separate table. Up to you if you want to try this approach or make a table to hold photos with a reference to an answer. I've never done it this way so I won't steer you away if you want to try this approach
    FOREIGN KEY (question_id)
    REFERENCES questions (question_id)
    // Perfect. This eliminates the need for an "answers" column in your questions table
  );`
}

const mgSchema = {
  // I would name this QuestionsSchema and remove "question_" like in postgres
  question_id: mongoose.ObjectId,
  product_id: Number,
  question_body: String,
  question_date: Date,
  asker_name: String,
  question_helpfulness: Number,
  reported: Boolean,
  answers: [{
    answer_id: Number,
    // I could see this helping with clarity but I would consider taking "answer_" off here as well since it should be clear since they are in the "answers" property. Either way is fine here I think
    question_id: mongoose.ObjectId,
    answer_body: String,
    answer_date: Date,
    answerer_name: String,
    answer_helpfulness: Number,
    answer_photos: [String]
  }]
}

module.exports = {
  pgSchema,
}
