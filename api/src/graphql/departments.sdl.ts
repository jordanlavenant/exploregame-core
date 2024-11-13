export const schema = gql`
  type Department {
    id: String!
    name: String!
    description: String!
    Player: [Player]!
    Script: [Script]!
  }

  type Query {
    departments: [Department!]! @skipAuth
    department(id: String!): Department @skipAuth
  }

  input CreateDepartmentInput {
    name: String!
    description: String!
  }

  input UpdateDepartmentInput {
    name: String
    description: String
  }

  type Mutation {
    createDepartment(input: CreateDepartmentInput!): Department! @requireAuth
    updateDepartment(id: String!, input: UpdateDepartmentInput!): Department!
      @requireAuth
    deleteDepartment(id: String!): Department! @requireAuth
  }
`
