// backend/src/graphql/typeDefs/swipe.js
import { gql } from "apollo-server-express";

const swipeTypeDefs = gql`
  extend type Mutation {
    likeUser(targetUserId: ID!, liked: Boolean!): String!
  }

  extend type Query {
    getRandomUser: User
  }
`;

export default swipeTypeDefs;
