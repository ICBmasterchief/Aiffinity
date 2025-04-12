// backend/src/graphql/typeDefs/chatConversation.js
import { gql } from "apollo-server-express";

const chatConversationTypeDefs = gql`
  type UserChatMessage {
    id: ID!
    conversationId: ID!
    senderId: Int!
    content: String!
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    getConversationMessages(matchId: ID!): [UserChatMessage!]!
  }

  extend type Mutation {
    sendConversationMessage(matchId: ID!, content: String!): UserChatMessage!
  }
`;

export default chatConversationTypeDefs;
