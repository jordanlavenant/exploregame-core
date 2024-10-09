export const schema = gql`
  type Question {
    id: String!
    question: String!
    description: String!
    questionTypeId: String!
    stepId: String!
    Step: Step!
    QuestionType: QuestionType!
    Answer: [Answer]!
    Hint: [Hint]!
  }

  type Query {
    questions: [Question!]! @skipAuth
    question(id: String!): Question @skipAuth
  }

  input CreateQuestionInput {
    question: String!
    description: String!
    questionTypeId: String!
    stepId: String!
  }

  input UpdateQuestionInput {
    question: String
    description: String
    questionTypeId: String
    stepId: String
  }

  type Mutation {
    createQuestion(input: CreateQuestionInput!): Question! @requireAuth
    updateQuestion(id: String!, input: UpdateQuestionInput!): Question!
      @requireAuth
    deleteQuestion(id: String!): Question! @requireAuth
  }
`
