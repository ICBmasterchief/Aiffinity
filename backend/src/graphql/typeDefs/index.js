// backend/src/graphql/typeDefs/index.js
import { gql } from "apollo-server-express";
import userTypeDefs from "./user.js";
import openaiTypeDefs from "./openai.js";
import swipeTypeDefs from "./swipe.js";
import matchTypeDefs from "./match.js";
import chatConversationTypeDefs from "./chatConversation.js";
import notificationTypeDefs from "./notification.js";
import userPhotoTypeDefs from "./userPhoto.js";
import aiProfileTypeDefs from "./aiProfile.js";
import discoverTypeDefs from "./discover.js";
import chatStarterTypeDefs from "./chatStarter.js";

const baseTypeDefs = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }

  type Subscription {
    _empty: String
  }
`;

export default [
  baseTypeDefs,
  userTypeDefs,
  openaiTypeDefs,
  swipeTypeDefs,
  matchTypeDefs,
  chatConversationTypeDefs,
  notificationTypeDefs,
  userPhotoTypeDefs,
  aiProfileTypeDefs,
  discoverTypeDefs,
  chatStarterTypeDefs,
];
