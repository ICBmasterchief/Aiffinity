// backend/src/graphql/typeDefs/aiProfile.js

import { gql } from "apollo-server-express";

const aiProfileTypeDefs = gql`
  input AIAnswerInput {
    q: String!
    a: String!
  }

  type Mutation {
    saveAIProfile(answers: [AIAnswerInput!]!): Boolean!
  }

  type Query {
    hasAIProfile: Boolean!
    getAIProfile: AIProfile
  }

  type AIProfile {
    summary: String!
    updatedAt: String!
    canRetry: Boolean! # true si han pasado ≥24 h
  }
`;

export default aiProfileTypeDefs;
