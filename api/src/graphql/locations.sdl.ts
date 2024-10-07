export const schema = gql`
  type Location {
    id: String!
    name: String!
    description: String!
    Step: [Step]!
  }

  type Query {
    locations: [Location!]! @requireAuth
    location(id: String!): Location @requireAuth
  }

  input CreateLocationInput {
    name: String!
    description: String!
  }

  input UpdateLocationInput {
    name: String
    description: String
  }

  type Mutation {
    createLocation(input: CreateLocationInput!): Location! @requireAuth
    updateLocation(id: String!, input: UpdateLocationInput!): Location!
      @requireAuth
    deleteLocation(id: String!): Location! @requireAuth
  }
`
