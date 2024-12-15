export const schema = gql`
  type Player {
    id: String!
    email: String!
    genderId: String!
    firstName: String!
    lastName: String!
    hashedPassword: String!
    departmentId: String!
    picture: Asset
    pictureAssetId: String
    Gender: Gender!
    Department: Department!
    PlayerScript: [PlayerScript]!
  }

  type Query {
    players: [Player!]! @skipAuth
    player(id: String!): Player @skipAuth
  }

  input CreatePlayerInput {
    email: String!
    genderId: String!
    firstName: String!
    lastName: String!
    hashedPassword: String!
    departmentId: String!
    pictureAssetId: String
  }

  input UpdatePlayerInput {
    email: String
    genderId: String
    firstName: String
    lastName: String
    hashedPassword: String
    departmentId: String
    pictureAssetId: String
  }

  type Mutation {
    createPlayer(input: CreatePlayerInput!): Player! @skipAuth
    updatePlayer(id: String!, input: UpdatePlayerInput!): Player! @skipAuth
    deletePlayer(id: String!): Player! @requireAuth
  }
`
