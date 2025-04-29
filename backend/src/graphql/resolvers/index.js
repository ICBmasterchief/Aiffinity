// backend/src/graphql/resolvers/index.js
import userResolvers from "./user.js";
import openaiResolvers from "./openai.js";
import swipeResolvers from "./swipe.js";
import matchResolvers from "./match.js";
import chatConversationResolvers from "./chatConversation.js";
import notificationResolvers from "./notification.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...openaiResolvers.Query,
    ...swipeResolvers.Query,
    ...matchResolvers.Query,
    ...chatConversationResolvers.Query,
    ...notificationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...openaiResolvers.Mutation,
    ...swipeResolvers.Mutation,
    ...matchResolvers.Mutation,
    ...chatConversationResolvers.Mutation,
    ...notificationResolvers.Mutation,
  },
  Subscription: {
    ...chatConversationResolvers.Subscription,
    ...notificationResolvers.Subscription,
  },
};

export default resolvers;
