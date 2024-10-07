export const schema = gql`
  type Gender {
    id: String!
    gender: String!
    Player: [Player]!
  }

  type Query {
    genders: [Gender!]! @requireAuth
    gender(id: String!): Gender @requireAuth
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
