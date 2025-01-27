export const schema = gql`
  type Question {
    id: String!
    question: String!
    description: String!
    questionTypeId: String!
    stepId: String!
    order: Int!
    Step: Step!
    QuestionType: QuestionType!
    Answer: [Answer]!
    Hint: [Hint]!
    PlayerScript: [PlayerScript]!
  }

  type Query {
    questions: [Question!]! @requireAuth
    question(id: String!): Question @requireAuth
  }

  input CreateQuestionInput {
    question: String!
    description: String!
    questionTypeId: String!
    stepId: String!
    order: Int!
  }

  input UpdateQuestionInput {
    question: String
    description: String
    questionTypeId: String
    stepId: String
    order: Int
  }

  type Mutation {
    createQuestion(input: CreateQuestionInput!): Question! @requireAuth
    updateQuestion(id: String!, input: UpdateQuestionInput!): Question!
      @requireAuth
    deleteQuestion(id: String!): Question! @requireAuth
  }
`
