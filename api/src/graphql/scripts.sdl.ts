export const schema = gql`
  type Script {
    id: String!
    script: String!
    description: String!
    word: String!
  }

  type Query {
    scripts: [Script!]! @requireAuth
    script(id: String!): Script @requireAuth
  }

  input CreateScriptInput {
    script: String!
    description: String!
    word: String!
  }

  input UpdateScriptInput {
    script: String
    description: String
    word: String
  }

  type Mutation {
    createScript(input: CreateScriptInput!): Script! @requireAuth
    updateScript(id: String!, input: UpdateScriptInput!): Script! @requireAuth
    deleteScript(id: String!): Script! @requireAuth
  }
`
