export const schema = gql`
  type ScriptStep {
    id: String!
    scriptId: String!
    stepId: String!
    lettre: String!
    order: Int!
    Script: Script!
    Step: Step!
  }

  type Query {
    scriptSteps: [ScriptStep!]! @skipAuth
    scriptStep(id: String!): ScriptStep @skipAuth
  }

  input CreateScriptStepInput {
    scriptId: String!
    stepId: String!
    lettre: String!
    order: Int!
  }

  input UpdateScriptStepInput {
    scriptId: String
    stepId: String
    lettre: String
    order: Int
  }

  type Mutation {
    createScriptStep(input: CreateScriptStepInput!): ScriptStep! @requireAuth
    updateScriptStep(id: String!, input: UpdateScriptStepInput!): ScriptStep!
      @requireAuth
    deleteScriptStep(id: String!): ScriptStep! @requireAuth
  }
`
