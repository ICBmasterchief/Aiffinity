// backend/src/graphql/resolvers/index.js
import userResolvers from "./user.js";
import openaiResolvers from "./openai.js";
import swipeResolvers from "./swipe.js";
import matchResolvers from "./match.js";
import chatConversationResolvers from "./chatConversation.js";
import notificationResolvers from "./notification.js";
import userPhotoResolvers from "./userPhoto.js";
import aiProfileResolvers from "./aiProfile.js";
import discoverResolvers from "./discover.js";
import chatStarterResolvers from "./chatStarter.js";

const resolvers = {
  Upload: userPhotoResolvers.Upload,

  Query: {
    ...userResolvers.Query,
    ...openaiResolvers.Query,
    ...matchResolvers.Query,
    ...chatConversationResolvers.Query,
    ...notificationResolvers.Query,
    ...aiProfileResolvers.Query,
    ...discoverResolvers.Query,
    ...chatStarterResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...openaiResolvers.Mutation,
    ...swipeResolvers.Mutation,
    ...matchResolvers.Mutation,
    ...chatConversationResolvers.Mutation,
    ...notificationResolvers.Mutation,
    ...userPhotoResolvers.Mutation,
    ...aiProfileResolvers.Mutation,
    ...chatStarterResolvers.Mutation,
  },
  Subscription: {
    ...chatConversationResolvers.Subscription,
    ...notificationResolvers.Subscription,
    ...chatStarterResolvers.Subscription,
  },
  User: {
    ...userPhotoResolvers.User,
    ...userResolvers.User,
  },
};

export default resolvers;
