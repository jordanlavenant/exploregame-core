export const schema = gql`
  type News {
    id: String!
    title: String!
    description: String!
    date: DateTime!
    tags: [Tag]!
  }

  type Query {
    newses: [News!]! @requireAuth
    news(id: String!): News @requireAuth
  }

  input CreateNewsInput {
    title: String!
    description: String!
    date: DateTime!
  }

  input UpdateNewsInput {
    title: String
    description: String
    date: DateTime
  }

  type Mutation {
    createNews(input: CreateNewsInput!): News! @requireAuth
    updateNews(id: String!, input: UpdateNewsInput!): News! @requireAuth
    deleteNews(id: String!): News! @requireAuth
  }
`
