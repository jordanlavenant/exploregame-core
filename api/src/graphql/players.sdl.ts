export const schema = gql`
  type Player {
    id: String!
    gender: String!
    idU: String!
    idF: String!
    User: User!
    Course: Course!
  }

  type Query {
    players: [Player!]! @requireAuth
    player(id: String!): Player @requireAuth
  }

  input CreatePlayerInput {
    gender: String!
    idU: String!
    idF: String!
  }

  input UpdatePlayerInput {
    gender: String
    idU: String
    idF: String
  }

  type Mutation {
    createPlayer(input: CreatePlayerInput!): Player! @requireAuth
    updatePlayer(id: String!, input: UpdatePlayerInput!): Player! @requireAuth
    deletePlayer(id: String!): Player! @requireAuth
  }
`
