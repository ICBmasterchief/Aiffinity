// frontend/src/graphql/swipeQueries.js
import { gql } from "@apollo/client";

export const GET_RANDOM_USER = gql`
  query GetRandomUser {
    getRandomUser {
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
  }
`;

export const LIKE_USER = gql`
  mutation LikeUser($targetUserId: ID!, $liked: Boolean!) {
    likeUser(targetUserId: $targetUserId, liked: $liked) {
      matchCreated
      matchedUser {
        id
        name
        mainPhoto
      }
      matchId
    }
  }
`;
