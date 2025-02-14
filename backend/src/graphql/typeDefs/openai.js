// src/graphql/typeDefs/openai.js
import { gql } from "apollo-server-express";

const openaiTypeDefs = gql`
  type Query {
    chatWithOpenAI(prompt: String!): String!
  }
`;

export default openaiTypeDefs;
