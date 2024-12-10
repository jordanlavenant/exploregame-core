export const schema = gql`
  type CharacterStep {
    id: String!
    characterId: String!
    stepId: String!
    textOrder: Int!
    Character: Character!
    Step: Step!
  }

  type Query {
    characterSteps: [CharacterStep!]! @skipAuth
    characterStep(id: String!): CharacterStep @skipAuth
  }

  input CreateCharacterStepInput {
    characterId: String!
    stepId: String!
    textOrder: Int!
  }

  input UpdateCharacterStepInput {
    characterId: String
    stepId: String
    textOrder: Int
  }

  type Mutation {
    createCharacterStep(input: CreateCharacterStepInput!): CharacterStep!
      @requireAuth
    updateCharacterStep(
      id: String!
      input: UpdateCharacterStepInput!
    ): CharacterStep! @requireAuth
    deleteCharacterStep(id: String!): CharacterStep! @requireAuth
  }
`
