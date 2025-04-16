// frontend/src/graphql/chatConversationQueries.js
import { gql } from "@apollo/client";

export const GET_CONVERSATION = gql`
  query GetConversationMessages($matchId: ID!) {
    getConversationMessages(matchId: $matchId) {
      id
      conversationId
      senderId
      content
      createdAt
      updatedAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendConversationMessage($matchId: ID!, $content: String!) {
    sendConversationMessage(matchId: $matchId, content: $content) {
      id
      conversationId
      senderId
      content
      createdAt
      updatedAt
    }
  }
`;

export const CONVERSATION_MESSAGE_SUBSCRIPTION = gql`
  subscription OnConversationMessageAdded($matchId: ID!) {
    conversationMessageAdded(matchId: $matchId) {
      id
      conversationId
      senderId
      content
      createdAt
      updatedAt
    }
  }
`;
