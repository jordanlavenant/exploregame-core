export const schema = gql`
  type Bde {
    id: String!
    name: String!
    description: String!
    logo: String!
    departmentId: String!
    Department: Department!
  }

  type Query {
    bdes: [Bde!]! @requireAuth
    bde(id: String!): Bde @requireAuth
  }

  input CreateBdeInput {
    name: String!
    description: String!
    logo: String!
    departmentId: String!
  }

  input UpdateBdeInput {
    name: String
    description: String
    logo: String
    departmentId: String
  }

  type Mutation {
    createBde(input: CreateBdeInput!): Bde! @requireAuth
    updateBde(id: String!, input: UpdateBdeInput!): Bde! @requireAuth
    deleteBde(id: String!): Bde! @requireAuth
  }
`
