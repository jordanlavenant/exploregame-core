export const schema = gql`
  type QuestionType {
    id: String!
    type: String!
    Question: [Question]!
  }

  type Query {
    questionTypes: [QuestionType!]! @requireAuth
    questionType(id: String!): QuestionType @requireAuth
  }

  input CreateQuestionTypeInput {
    type: String!
  }

  input UpdateQuestionTypeInput {
    type: String
  }

  type Mutation {
    createQuestionType(input: CreateQuestionTypeInput!): QuestionType!
      @requireAuth
    updateQuestionType(
      id: String!
      input: UpdateQuestionTypeInput!
    ): QuestionType! @requireAuth
    deleteQuestionType(id: String!): QuestionType! @requireAuth
  }
`
