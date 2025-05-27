// backend/src/graphql/typeDefs/chatStarter.js
import { gql } from "apollo-server-express";

const chatStarterTypeDefs = gql`
  type UserChatMessage {
    id: ID!
    conversationId: ID!
    senderId: Int!
    content: String!
    system: Boolean
    createdAt: String
    updatedAt: String
  }

  type StarterInfo {
    hasStarter: Boolean!
    canGenerate: Boolean!
  }

  extend type Query {
    starterStatus(matchId: ID!): StarterInfo!
  }
  extend type Mutation {
    generateStarter(matchId: ID!): Boolean!
  }
  extend type Subscription {
    systemTopicAdded(matchId: ID!): UserChatMessage!
  }
`;

export default chatStarterTypeDefs;
