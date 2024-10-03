export const schema = gql`
  type Scenario {
    id: String!
    scenario: String!
    description: String!
    word: String!
  }

  type Query {
    scenarios: [Scenario!]! @requireAuth
    scenario(id: String!): Scenario @requireAuth
  }

  input CreateScenarioInput {
    scenario: String!
    description: String!
    word: String!
  }

  input UpdateScenarioInput {
    scenario: String
    description: String
    word: String
  }

  type Mutation {
    createScenario(input: CreateScenarioInput!): Scenario! @requireAuth
    updateScenario(id: String!, input: UpdateScenarioInput!): Scenario!
      @requireAuth
    deleteScenario(id: String!): Scenario! @requireAuth
  }
`
