export const schema = gql`
  type Script {
    id: String!
    name: String!
    visible: Boolean!
    departmentId: String!
    Department: Department!
    ScriptStep: [ScriptStep]!
    PlayerScript: [PlayerScript]!
  }

  type Query {
    scripts: [Script!]! @skipAuth
    script(id: String!): Script @skipAuth
  }

  input CreateScriptInput {
    name: String!
    visible: Boolean!
    departmentId: String!
  }

  input UpdateScriptInput {
    name: String
    visible: Boolean
    departmentId: String
  }

  type Mutation {
    createScript(input: CreateScriptInput!): Script! @requireAuth
    updateScript(id: String!, input: UpdateScriptInput!): Script! @requireAuth
    deleteScript(id: String!): Script! @requireAuth
  }
`
