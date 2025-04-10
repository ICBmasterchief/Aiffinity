// backend/src/graphql/typeDefs/index.js
import { gql } from "apollo-server-express";
import userTypeDefs from "./user.js";
import openaiTypeDefs from "./openai.js";
import swipeTypeDefs from "./swipe.js";
import matchTypeDefs from "./match.js";

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export default [
  baseTypeDefs,
  userTypeDefs,
  openaiTypeDefs,
  swipeTypeDefs,
  matchTypeDefs,
];
