// backend/src/graphql/typeDefs/match.js
import { gql } from "apollo-server-express";

const matchTypeDefs = gql`
  type MatchSummary {
    id: ID!
    user: User!
  }

  extend type Query {
    getMatches: [MatchSummary!]!
    getMatchInfo(matchId: ID!): MatchSummary
  }
`;

export default matchTypeDefs;
