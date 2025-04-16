// frontend/src/graphql/matchQueries.js
import { gql } from "@apollo/client";

export const GET_MATCHES = gql`
  query GetMatches {
    getMatches {
      id
      user {
        id
        name
        photoUrl
      }
    }
  }
`;

export const GET_MATCH_INFO = gql`
  query GetMatchInfo($matchId: ID!) {
    getMatchInfo(matchId: $matchId) {
      id
      user {
        id
        name
        photoUrl
      }
    }
  }
`;
