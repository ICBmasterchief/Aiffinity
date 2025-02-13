// src/graphql/resolvers/index.js
import userResolvers from "./user.js";
import openaiResolvers from "./openai.js";

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...openaiResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...openaiResolvers.Mutation,
  },
};

export default resolvers;
