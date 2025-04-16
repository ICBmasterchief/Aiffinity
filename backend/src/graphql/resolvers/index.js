// backend/src/graphql/resolvers/index.js
import userResolvers from "./user.js";
import openaiResolvers from "./openai.js";
import swipeResolvers from "./swipe.js";
import matchResolvers from "./match.js";
import chatConversationResolvers from "./chatConversation.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...openaiResolvers.Query,
    ...swipeResolvers.Query,
    ...matchResolvers.Query,
    ...chatConversationResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...openaiResolvers.Mutation,
    ...swipeResolvers.Mutation,
    ...matchResolvers.Mutation,
    ...chatConversationResolvers.Mutation,
  },
  Subscription: {
    ...chatConversationResolvers.Subscription,
  },
};

export default resolvers;
