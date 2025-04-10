// backend/src/graphql/typeDefs/match.js
import { gql } from "apollo-server-express";

const matchTypeDefs = gql`
  extend type Query {
    getMatches: [User!]!
  }
`;

export default matchTypeDefs;
