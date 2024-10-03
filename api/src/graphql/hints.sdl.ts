export const schema = gql`
  type Hint {
    id: String!
    hint: String!
    help: String!
    idQ: String!
    Question: Question!
  }

  type Query {
    hints: [Hint!]! @requireAuth
    hint(id: String!): Hint @requireAuth
  }

  input CreateHintInput {
    hint: String!
    help: String!
    idQ: String!
  }

  input UpdateHintInput {
    hint: String
    help: String
    idQ: String
  }

  type Mutation {
    createHint(input: CreateHintInput!): Hint! @requireAuth
    updateHint(id: String!, input: UpdateHintInput!): Hint! @requireAuth
    deleteHint(id: String!): Hint! @requireAuth
  }
`
