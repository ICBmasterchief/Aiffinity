// frontend/src/graphql/chatStarter.js
import { gql } from "@apollo/client";

export const STARTER_STATUS = gql`
  query StarterStatus($matchId: ID!) {
    starterStatus(matchId: $matchId) {
      hasStarter
      canGenerate
    }
  }
`;

export const GENERATE_STARTER = gql`
  mutation GenerateStarter($matchId: ID!) {
    generateStarter(matchId: $matchId)
  }
`;

export const SYSTEM_TOPIC_ADDED = gql`
  subscription OnSystemTopicAdded($matchId: ID!) {
    systemTopicAdded(matchId: $matchId) {
      id
      conversationId
      content
      system
      createdAt
    }
  }
`;
