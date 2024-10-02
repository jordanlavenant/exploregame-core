export const schema = gql`
  type Filiere {
    idF: String!
    nomF: String!
    descriptionF: String!
  }

  type Query {
    filieres: [Filiere!]! @requireAuth
    filiere(idF: String!): Filiere @requireAuth
  }

  input CreateFiliereInput {
    nomF: String!
    descriptionF: String!
  }

  input UpdateFiliereInput {
    nomF: String
    descriptionF: String
  }

  type Mutation {
    createFiliere(input: CreateFiliereInput!): Filiere! @requireAuth
    updateFiliere(idF: String!, input: UpdateFiliereInput!): Filiere!
      @requireAuth
    deleteFiliere(idF: String!): Filiere! @requireAuth
  }
`
