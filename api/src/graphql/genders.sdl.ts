export const schema = gql`
  type Gender {
    id: String!
    gender: String!
    Player: [Player]!
  }

  type Query {
    genders: [Gender!]! @skipAuth
    gender(id: String!): Gender @skipAuth
  }

  input CreateGenderInput {
    gender: String!
  }

  input UpdateGenderInput {
    gender: String
  }

  type Mutation {
    createGender(input: CreateGenderInput!): Gender! @requireAuth
    updateGender(id: String!, input: UpdateGenderInput!): Gender! @requireAuth
    deleteGender(id: String!): Gender! @requireAuth
  }
`
