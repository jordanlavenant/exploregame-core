export const schema = gql`
  type Admin {
    id: String!
    role: String!
    idU: String!
    User: User!
  }

  type Query {
    admins: [Admin!]! @requireAuth
    admin(id: String!): Admin @requireAuth
  }

  input CreateAdminInput {
    role: String!
    idU: String!
  }

  input UpdateAdminInput {
    role: String
    idU: String
  }

  type Mutation {
    createAdmin(input: CreateAdminInput!): Admin! @requireAuth
    updateAdmin(id: String!, input: UpdateAdminInput!): Admin! @requireAuth
    deleteAdmin(id: String!): Admin! @requireAuth
  }
`
