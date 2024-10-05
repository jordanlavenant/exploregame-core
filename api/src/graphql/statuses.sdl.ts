export const schema = gql`
  type Status {
    id: String!
    status: String!
  }

  type Query {
    statuses: [Status!]! @requireAuth
    status(id: String!): Status @requireAuth
  }

  input CreateStatusInput {
    status: String!
  }

  input UpdateStatusInput {
    status: String
  }

  type Mutation {
    createStatus(input: CreateStatusInput!): Status! @requireAuth
    updateStatus(id: String!, input: UpdateStatusInput!): Status! @requireAuth
    deleteStatus(id: String!): Status! @requireAuth
  }
`
