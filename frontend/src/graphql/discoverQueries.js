import { gql } from "@apollo/client";

export const GET_COMPATIBLE = gql`
  query GetCompatible {
    getCompatibleCandidate {
      user {
        id
        name
        age
        description
        gender
        searchGender
        mainPhoto
        photos {
          id
          filePath
          position
        }
      }
      compat
    }
  }
`;
