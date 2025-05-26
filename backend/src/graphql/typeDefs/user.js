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
    searchMinAge: Int
    searchMaxAge: Int
    mainPhoto: String
    photos: [Photo!]!
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
      searchMinAge: Int
      searchMaxAge: Int
    ): User!
  }
`;

export default userTypeDefs;
