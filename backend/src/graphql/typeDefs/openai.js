// src/graphql/typeDefs/openai.js
import { gql } from "apollo-server-express";

const openaiTypeDefs = gql`
  input MessageInput {
    role: String!
    content: String!
  }

  type Query {
    chatWithOpenAI(prompt: String!, history: [MessageInput]): String!
  }
`;

export default openaiTypeDefs;
