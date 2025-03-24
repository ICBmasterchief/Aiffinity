// backend/src/graphql/typeDefs/openai.js
import { gql } from "apollo-server-express";

const openaiTypeDefs = gql`
  type ChatMessage {
    id: ID!
    userId: Int!
    role: String!
    content: String!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    chatWithOpenAI(prompt: String!): String!
    getUserMessages: [ChatMessage!]!
  }

  extend type Mutation {
    resetChat: String!
  }
`;

export default openaiTypeDefs;
