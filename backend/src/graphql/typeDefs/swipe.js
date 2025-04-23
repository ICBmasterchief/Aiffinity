// backend/src/graphql/typeDefs/swipe.js
import { gql } from "apollo-server-express";

const swipeTypeDefs = gql`
  type LikeUserResponse {
    matchCreated: Boolean!
    matchedUser: User
    matchId: ID
  }

  extend type Mutation {
    likeUser(targetUserId: ID!, liked: Boolean!): LikeUserResponse!
  }

  extend type Query {
    getRandomUser: User
  }
`;

export default swipeTypeDefs;
