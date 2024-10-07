export const schema = gql`
  type ScriptStep {
    id: String!
    scriptId: String!
    stepId: String!
    lettre: String!
    Script: Script!
    Step: Step!
  }

  type Query {
    scriptSteps: [ScriptStep!]! @requireAuth
    scriptStep(id: String!): ScriptStep @requireAuth
  }

  input CreateScriptStepInput {
    scriptId: String!
    stepId: String!
    lettre: String!
  }

  input UpdateScriptStepInput {
    scriptId: String
    stepId: String
    lettre: String
  }

  type Mutation {
    createScriptStep(input: CreateScriptStepInput!): ScriptStep! @requireAuth
    updateScriptStep(id: String!, input: UpdateScriptStepInput!): ScriptStep!
      @requireAuth
    deleteScriptStep(id: String!): ScriptStep! @requireAuth
  }
`
