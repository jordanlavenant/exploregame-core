export const schema = gql`
  type Asset {
    id: String!
    filename: String
    Player: [Player]!
  }

  type Query {
    assets: [Asset!]! @skipAuth
    asset(id: String!): Asset @skipAuth
  }

  input CreateAssetInput {
    filename: String
  }

  input UpdateAssetInput {
    filename: String
  }

  type Mutation {
    createAsset(input: CreateAssetInput!): Asset! @skipAuth
    updateAsset(id: String!, input: UpdateAssetInput!): Asset! @skipAuth
    deleteAsset(id: String!): Asset! @skipAuth
  }
`
