export const schema = gql`
  type Character {
    id: String!
    nomPerso: String!
    descriptionL: String
    image: String
    CharacterStep: [CharacterStep]!
  }

  type Query {
    characters: [Character!]! @skipAuth
    character(id: String!): Character @skipAuth
  }

  input CreateCharacterInput {
    nomPerso: String!
    descriptionL: String
    image: String
  }

  input UpdateCharacterInput {
    nomPerso: String
    descriptionL: String
    image: String
  }

  type Mutation {
    createCharacter(input: CreateCharacterInput!): Character! @requireAuth
    updateCharacter(id: String!, input: UpdateCharacterInput!): Character!
      @requireAuth
    deleteCharacter(id: String!): Character! @requireAuth
  }
`
