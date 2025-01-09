export const schema = gql`
  type HintLevel {
    id: String!
    type: String!
    Hint: [Hint]!
  }

  type Query {
    hintLevels: [HintLevel!]! @skipAuth
    hintLevel(id: String!): HintLevel @skipAuth
  }

  input CreateHintLevelInput {
    type: String!
  }

  input UpdateHintLevelInput {
    type: String
  }

  type Mutation {
    createHintLevel(input: CreateHintLevelInput!): HintLevel! @requireAuth
    updateHintLevel(id: String!, input: UpdateHintLevelInput!): HintLevel!
      @requireAuth
    deleteHintLevel(id: String!): HintLevel! @requireAuth
  }
`
