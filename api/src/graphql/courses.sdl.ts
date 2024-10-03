export const schema = gql`
  type Course {
    id: String!
    name: String!
    description: String!
    Player: [Player]!
  }

  type Query {
    courses: [Course!]! @requireAuth
    course(id: String!): Course @requireAuth
  }

  input CreateCourseInput {
    name: String!
    description: String!
  }

  input UpdateCourseInput {
    name: String
    description: String
  }

  type Mutation {
    createCourse(input: CreateCourseInput!): Course! @requireAuth
    updateCourse(id: String!, input: UpdateCourseInput!): Course! @requireAuth
    deleteCourse(id: String!): Course! @requireAuth
  }
`
