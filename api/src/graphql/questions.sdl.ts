export const schema = gql`
  type Question {
    id: String!
    question: String!
    description: String!
    idTQ: String!
    idL: String!
    QuestionType: QuestionType!
    Location: Location!
    Answer: [Answer]!
    Hint: [Hint]!
  }

  type Query {
    questions: [Question!]! @requireAuth
    question(id: String!): Question @requireAuth
  }

  input CreateQuestionInput {
    question: String!
    description: String!
    idTQ: String!
    idL: String!
  }

  input UpdateQuestionInput {
    question: String
    description: String
    idTQ: String
    idL: String
  }

  type Mutation {
    createQuestion(input: CreateQuestionInput!): Question! @requireAuth
    updateQuestion(id: String!, input: UpdateQuestionInput!): Question!
      @requireAuth
    deleteQuestion(id: String!): Question! @requireAuth
  }
`
