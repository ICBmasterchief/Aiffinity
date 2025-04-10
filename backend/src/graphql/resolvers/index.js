// backend/src/graphql/resolvers/index.js
import userResolvers from "./user.js";
import openaiResolvers from "./openai.js";
import swipeResolvers from "./swipe.js";
import matchResolvers from "./match.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...openaiResolvers.Query,
    ...swipeResolvers.Query,
    ...matchResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...openaiResolvers.Mutation,
    ...swipeResolvers.Mutation,
    ...matchResolvers.Mutation,
  },
};

export default resolvers;
