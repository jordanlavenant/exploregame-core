export const schema = gql`
  type Answer {
    id: String!
    answer: String!
    description: String!
    questionId: String!
    Question: Question!
  }

  type Query {
    answers: [Answer!]! @requireAuth
    answer(id: String!): Answer @requireAuth
  }

  input CreateAnswerInput {
    answer: String!
    description: String!
    questionId: String!
  }

  input UpdateAnswerInput {
    answer: String
    description: String
    questionId: String
  }

  type Mutation {
    createAnswer(input: CreateAnswerInput!): Answer! @requireAuth
    updateAnswer(id: String!, input: UpdateAnswerInput!): Answer! @requireAuth
    deleteAnswer(id: String!): Answer! @requireAuth
  }
`
