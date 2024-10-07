export const schema = gql`
  type Script {
    id: String!
    name: String!
    visible: Boolean!
    ScriptStep: [ScriptStep]!
    PlayerScript: [PlayerScript]!
  }

  type Query {
    scripts: [Script!]! @requireAuth
    script(id: String!): Script @requireAuth
  }

  input CreateScriptInput {
    name: String!
    visible: Boolean!
  }

  input UpdateScriptInput {
    name: String
    visible: Boolean
  }

  type Mutation {
    createScript(input: CreateScriptInput!): Script! @requireAuth
    updateScript(id: String!, input: UpdateScriptInput!): Script! @requireAuth
    deleteScript(id: String!): Script! @requireAuth
  }
`
