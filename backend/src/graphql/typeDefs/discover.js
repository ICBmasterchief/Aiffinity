// backend/src/graphql/typeDefs/discover.js

import { gql } from "apollo-server-express";

const discoverTypeDefs = gql`
  type MatchCandidate {
    user: User!
    compat: Int # null si es candidato random
  }

  extend type Query {
    getCompatibleCandidate: MatchCandidate
  }
`;

export default discoverTypeDefs;
