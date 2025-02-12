export const schema = gql`
  type Answer {
    id: String!
    answer: String!
    description: String!
    questionId: String!
    isCorrect: Boolean!
    Question: Question!
  }

  type Query {
    answers: [Answer!]! @skipAuth
    answer(id: String!): Answer @skipAuth
  }

  input CreateAnswerInput {
    answer: String!
    description: String!
    questionId: String!
    isCorrect: Boolean!
  }

  input UpdateAnswerInput {
    answer: String
    description: String
    questionId: String
    isCorrect: Boolean
  }

  input CheckAnswerInput {
    questionId: String!
    answer: String!
  }

  type CheckAnswerOutput {
    isCorrect: Boolean!
    correctAnswer: String
  }

  type Mutation {
    createAnswer(input: CreateAnswerInput!): Answer! @requireAuth
    updateAnswer(id: String!, input: UpdateAnswerInput!): Answer! @requireAuth
    deleteAnswer(id: String!): Answer! @requireAuth
    checkAnswer(input: CheckAnswerInput!): CheckAnswerOutput! @skipAuth
  }
`
