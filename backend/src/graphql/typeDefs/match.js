// backend/src/graphql/typeDefs/match.js
import { gql } from "apollo-server-express";

const matchTypeDefs = gql`
  type MatchSummary {
    id: ID!
    user: User!
    compat: Int
  }

  extend type Query {
    getMatches: [MatchSummary!]!
    getMatchInfo(matchId: ID!): MatchSummary
  }

  extend type Mutation {
    deleteMatch(matchId: ID!): Boolean!
  }
`;

export default matchTypeDefs;
