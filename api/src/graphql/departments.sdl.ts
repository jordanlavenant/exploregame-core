export const schema = gql`
  type Department {
    id: String!
    name: String!
    description: String!
    colorSetId: String!
    Player: [Player]!
    Script: [Script]!
    ColorSet: ColorSet!
  }

  type Query {
    departments: [Department!]! @requireAuth
    department(id: String!): Department @requireAuth
  }

  input CreateDepartmentInput {
    name: String!
    description: String!
    colorSetId: String!
  }

  input UpdateDepartmentInput {
    name: String
    description: String
    colorSetId: String
  }

  type Mutation {
    createDepartment(input: CreateDepartmentInput!): Department! @requireAuth
    updateDepartment(id: String!, input: UpdateDepartmentInput!): Department!
      @requireAuth
    deleteDepartment(id: String!): Department! @requireAuth
  }
`
