// backend/src/graphql/typeDefs/user.js
import { gql } from "apollo-server-express";

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    description: String
    age: Int
    gender: String
    searchGender: String
    photoUrl: String
  }

  extend type Query {
    getUsers: [User!]!
    getUser(id: ID!): User
  }

  extend type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String!
    updateProfile(
      description: String
      age: Int
      gender: String
      searchGender: String
      photoUrl: String
    ): User!
  }
`;

export default userTypeDefs;
