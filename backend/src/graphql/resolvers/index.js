// backend/src/graphql/resolvers/index.js
import userResolvers from "./user.js";
import openaiResolvers from "./openai.js";
import swipeResolvers from "./swipe.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...openaiResolvers.Query,
    ...swipeResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...openaiResolvers.Mutation,
    ...swipeResolvers.Mutation,
  },
};

export default resolvers;
