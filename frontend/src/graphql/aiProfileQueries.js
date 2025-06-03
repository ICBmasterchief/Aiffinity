// frontend/src/graphql/aiProfile.js

import { gql } from "@apollo/client";

export const SAVE_AI_PROFILE = gql`
  mutation SaveProfile($answers: [AIAnswerInput!]!) {
    saveAIProfile(answers: $answers)
  }
`;

export const HAS_AI_PROFILE = gql`
  query HasAI {
    hasAIProfile
  }
`;

export const GET_AI_PROFILE = gql`
  query GetAIProfile {
    getAIProfile {
      summary
      updatedAt
      canRetry
    }
  }
`;
