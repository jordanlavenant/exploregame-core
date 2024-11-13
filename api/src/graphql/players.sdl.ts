export const schema = gql`
  type Player {
    id: String!
    email: String!
    genderId: String!
    firstName: String!
    lastName: String!
    hashedPassword: String!
    salt: String!
    departmentId: String!
    Gender: Gender!
    Department: Department!
    PlayerScript: [PlayerScript]!
  }

  type Query {
    players: [Player!]! @requireAuth
    player(id: String!): Player @requireAuth
  }

  input CreatePlayerInput {
    email: String!
    genderId: String!
    firstName: String!
    lastName: String!
    hashedPassword: String!
    salt: String!
    departmentId: String!
  }

  input UpdatePlayerInput {
    email: String
    genderId: String
    firstName: String
    lastName: String
    hashedPassword: String
    salt: String
    departmentId: String
  }

  type Mutation {
    createPlayer(input: CreatePlayerInput!): Player! @requireAuth
    updatePlayer(id: String!, input: UpdatePlayerInput!): Player! @requireAuth
    deletePlayer(id: String!): Player! @requireAuth
  }
`
