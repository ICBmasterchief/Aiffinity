import { gql } from "@apollo/client";

export const DELETE_MATCH = gql`
  mutation DeleteMatch($matchId: ID!) {
    deleteMatch(matchId: $matchId)
  }
`;
