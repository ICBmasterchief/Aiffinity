// src/graphql/chatQueries.js
import { gql } from "@apollo/client";

export const CHAT_WITH_OPENAI = gql`
  query ChatWithOpenAI($prompt: String!) {
    chatWithOpenAI(prompt: $prompt)
  }
`;
