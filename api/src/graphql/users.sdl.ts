export const schema = gql`
  type User {
    id: String!
    lastname: String!
    firstname: String!
    mail: String!
    password: String!
    Player: [Player]!
    Admin: [Admin]!
  }

  type Query {
    users: [User!]! @requireAuth
    user(id: String!): User @requireAuth
  }

  input CreateUserInput {
    lastname: String!
    firstname: String!
    mail: String!
    password: String!
  }

  input UpdateUserInput {
    lastname: String
    firstname: String
    mail: String
    password: String
  }

  type Mutation {
    createUser(input: CreateUserInput!): User! @requireAuth
    updateUser(id: String!, input: UpdateUserInput!): User! @requireAuth
    deleteUser(id: String!): User! @requireAuth
  }
`
