export const schema = gql`
  type Department {
    id: String!
    name: String!
    description: String!
    colorSetId: String!
    latitude: Float!
    longitude: Float!
    Player: [Player]!
    Script: [Script]!
    ColorSet: ColorSet!
    Bde: [Bde]!
  }

  type Query {
    departments: [Department!]! @requireAuth
    department(id: String!): Department @requireAuth
  }

  input CreateDepartmentInput {
    name: String!
    description: String!
    colorSetId: String!
    latitude: Float!
    longitude: Float!
  }

  input UpdateDepartmentInput {
    name: String
    description: String
    colorSetId: String
    latitude: Float
    longitude: Float
  }

  type Mutation {
    createDepartment(input: CreateDepartmentInput!): Department! @requireAuth
    updateDepartment(id: String!, input: UpdateDepartmentInput!): Department!
      @requireAuth
    deleteDepartment(id: String!): Department! @requireAuth
  }
`
