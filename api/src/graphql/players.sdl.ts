export const schema = gql`
  type Player {
    id: String!
    email: String!
    genderId: String!
    firstName: String!
    lastName: String!
    hashedPassword: String!
    departmentId: String!
    profilePictureUrl: String
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
    departmentId: String!
    profilePictureUrl: String
  }

  input UpdatePlayerInput {
    email: String
    genderId: String
    firstName: String
    lastName: String
    hashedPassword: String
    departmentId: String
    profilePictureUrl: String
  }

  type Mutation {
    createPlayer(input: CreatePlayerInput!): Player! @skipAuth
    updatePlayer(id: String!, input: UpdatePlayerInput!): Player! @skipAuth
    deletePlayer(id: String!): Player! @requireAuth
  }
`
