export const schema = gql`
  type Hint {
    id: String!
    help: String!
    questionId: String!
    hintLevelId: String!
    HintLevel: HintLevel!
    Question: Question!
  }

  type Query {
    hints: [Hint!]! @skipAuth
    hint(id: String!): Hint @skipAuth
  }

  input CreateHintInput {
    help: String!
    questionId: String!
    hintLevelId: String!
  }

  input UpdateHintInput {
    help: String
    questionId: String
    hintLevelId: String
  }

  type Mutation {
    createHint(input: CreateHintInput!): Hint! @requireAuth
    updateHint(id: String!, input: UpdateHintInput!): Hint! @requireAuth
    deleteHint(id: String!): Hint! @requireAuth
  }
`
