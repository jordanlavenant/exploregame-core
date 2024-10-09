export const schema = gql`
  type PlayerScript {
    id: String!
    playerId: String!
    scriptId: String!
    score: Int!
    remainingTime: Int!
    Player: Player!
    Script: Script!
  }

  type Query {
    playerScripts: [PlayerScript!]! @skipAuth
    playerScript(id: String!): PlayerScript @skipAuth
  }

  input CreatePlayerScriptInput {
    playerId: String!
    scriptId: String!
    score: Int!
    remainingTime: Int!
  }

  input UpdatePlayerScriptInput {
    playerId: String
    scriptId: String
    score: Int
    remainingTime: Int
  }

  type Mutation {
    createPlayerScript(input: CreatePlayerScriptInput!): PlayerScript!
      @requireAuth
    updatePlayerScript(
      id: String!
      input: UpdatePlayerScriptInput!
    ): PlayerScript! @requireAuth
    deletePlayerScript(id: String!): PlayerScript! @requireAuth
  }
`
