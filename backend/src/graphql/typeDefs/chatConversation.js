// backend/src/graphql/typeDefs/chatConversation.js
import { gql } from "apollo-server-express";

const chatConversationTypeDefs = gql`
  type UserChatMessage {
    id: ID!
    conversationId: ID!
    senderId: Int!
    content: String!
    system: Boolean
    createdAt: String
    updatedAt: String
  }

  extend type Query {
    getConversationMessages(matchId: ID!): [UserChatMessage!]!
  }

  extend type Mutation {
    sendConversationMessage(matchId: ID!, content: String!): UserChatMessage!
  }

  extend type Subscription {
    conversationMessageAdded(matchId: ID!): UserChatMessage!
  }
`;

export default chatConversationTypeDefs;
