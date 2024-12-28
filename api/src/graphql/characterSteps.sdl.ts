export const schema = gql`
  type CharacterStep {
    id: String!
    characterId: String!
    stepId: String!
    text: String!
    Character: Character!
    Step: Step!
  }

  type Query {
    characterSteps: [CharacterStep!]! @requireAuth
    characterStep(id: String!): CharacterStep @requireAuth
  }

  input CreateCharacterStepInput {
    characterId: String!
    stepId: String!
    text: String!
  }

  input UpdateCharacterStepInput {
    characterId: String
    stepId: String
    text: String
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
