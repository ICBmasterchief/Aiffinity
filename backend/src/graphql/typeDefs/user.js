// src/graphql/typeDefs/user.js
import { gql } from "apollo-server-express";

const userTypeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type Query {
    getUsers: [User!]!
    getUser(id: ID!): User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User!
    login(email: String!, password: String!): String! # Retorna un token JWT
  }
`;

export default userTypeDefs;
