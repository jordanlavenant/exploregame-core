export const schema = gql`
  type Tag {
    id: String!
    titre: String!
    news: [News]!
  }

  type Query {
    tags: [Tag!]! @requireAuth
    tag(id: String!): Tag @requireAuth
  }

  input CreateTagInput {
    titre: String!
  }

  input UpdateTagInput {
    titre: String
  }

  type Mutation {
    createTag(input: CreateTagInput!): Tag! @requireAuth
    updateTag(id: String!, input: UpdateTagInput!): Tag! @requireAuth
    deleteTag(id: String!): Tag! @requireAuth
  }
`
