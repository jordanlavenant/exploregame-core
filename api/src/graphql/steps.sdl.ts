export const schema = gql`
  type Step {
    id: String!
    name: String!
    locationId: String!
    ScriptStep: [ScriptStep]!
    Questions: [Question]!
    Location: Location!
    PlayerScript: [PlayerScript]!
    CharacterStep: [CharacterStep]!
  }

  type Query {
    steps: [Step!]! @skipAuth
    step(id: String!): Step @skipAuth
  }

  input CreateStepInput {
    name: String!
    locationId: String!
  }

  input UpdateStepInput {
    name: String
    locationId: String
  }

  type Mutation {
    createStep(input: CreateStepInput!): Step! @requireAuth
    updateStep(id: String!, input: UpdateStepInput!): Step! @requireAuth
    deleteStep(id: String!): Step! @requireAuth
  }
`
