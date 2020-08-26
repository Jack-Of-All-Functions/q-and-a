# q_and_a_module

> This repo includes the code needed for the Questions and Answers module of an item description page.

## Related Projects

  - https://github.com/kwrnFec/related_items_module
  - https://github.com/kwrnFec/overview_module
  - https://github.com/kwrnFec/ratings_and_reviews_module
  - https://github.com/kwrnFec/noah_proxy

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Server](#server)
1. [Development](#development)

## Usage

> To run the app locally, run "npm run server" on the terminal, then
  navigate to localhost:3001 in your web browser.

## Requirements

- Node 6.13.0
- etc

## Server

> CRUD Routes
  - GET /qa/questions
  - GET /qa/moreAnswers
  - POST /qa/question/add
  - POST /qa/answer/add
  - PUT /qa/question/helpful
  - PUT /qa/question/report
  - PUT /qa/answer/helpful
  - PUT /qa/answer/report

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

