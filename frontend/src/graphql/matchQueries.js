// frontend/src/graphql/matchQueries.js
import { gql } from "@apollo/client";

export const GET_MATCHES = gql`
  query GetMatches {
    getMatches {
      id
      name
      photoUrl
    }
  }
`;
