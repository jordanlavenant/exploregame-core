  export const schema = gql`
  type Player {
    id: String!
    username: String!
    hashedPassword: String!
    departmentId: String!
    Department: Department!
    PlayerScript: [PlayerScript]!
  }

  type Query {
    players: [Player!]! @skipAuth
    player(id: String!): Player @skipAuth
  }

  input CreatePlayerInput {
    username: String!
    hashedPassword: String!
    departmentId: String!
  }

  input UpdatePlayerInput {
    username: String
    hashedPassword: String
    departmentId: String
  }
  input LoginPlayerInput {
    username: String!
    password: String!
  }

  type Mutation {
    createPlayer(input: CreatePlayerInput!): Player! @skipAuth
    updatePlayer(id: String!, input: UpdatePlayerInput!): Player! @skipAuth
    deletePlayer(id: String!): Player! @requireAuth
    loginPlayer(input: LoginPlayerInput!): AuthPayload! @skipAuth
  }

  type AuthPayload {
    token: String!
    player: Player!
  }
`