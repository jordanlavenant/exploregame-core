export const schema = gql`
  type ColorSet {
    id: String!
    primary: String!
    secondary: String!
    tertiary: String!
    Department: [Department]!
  }

  type Query {
    colorSets: [ColorSet!]! @skipAuth
    colorSet(id: String!): ColorSet @skipAuth
  }

  input CreateColorSetInput {
    primary: String!
    secondary: String!
    tertiary: String!
  }

  input UpdateColorSetInput {
    primary: String
    secondary: String
    tertiary: String
  }

  type Mutation {
    createColorSet(input: CreateColorSetInput!): ColorSet! @requireAuth
    updateColorSet(id: String!, input: UpdateColorSetInput!): ColorSet!
      @requireAuth
    deleteColorSet(id: String!): ColorSet! @requireAuth
  }
`
