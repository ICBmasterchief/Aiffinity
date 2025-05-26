// frontend/src/graphql/userQueries.js

import { gql } from "@apollo/client";

export const GET_USER = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      description
      age
      gender
      searchGender
      searchMinAge
      searchMaxAge
      mainPhoto
      photos {
        id
        filePath
        position
      }
    }
  }
`;
