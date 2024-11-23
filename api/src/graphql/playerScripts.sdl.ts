export const schema = gql`
  type PlayerScript {
    id: String!
    playerId: String!
    scriptId: String!
    stepId: String!
    score: Int!
    remainingTime: Int!
    Player: Player!
    Script: Script!
    Step: Step!
  }

  type Query {
    playerScripts: [PlayerScript!]! @skipAuth
    playerScript(id: String!): PlayerScript @skipAuth
  }

  input CreatePlayerScriptInput {
    playerId: String!
    scriptId: String!
    stepId: String!
    score: Int!
    remainingTime: Int!
  }

  input UpdatePlayerScriptInput {
    playerId: String
    scriptId: String
    stepId: String
    score: Int
    remainingTime: Int
  }

  type Mutation {
    createPlayerScript(input: CreatePlayerScriptInput!): PlayerScript!
      @skipAuth
    updatePlayerScript(
      id: String!
      input: UpdatePlayerScriptInput!
    ): PlayerScript! @skipAuth
    deletePlayerScript(id: String!): PlayerScript! @skipAuth
  }
`
