// frontend/src/graphql/swipeQueries.js
import { gql } from "@apollo/client";

export const GET_RANDOM_USER = gql`
  query GetRandomUser {
    getRandomUser {
      id
      name
      description
      gender
      searchGender
      photoUrl
    }
  }
`;

export const LIKE_USER = gql`
  mutation LikeUser($targetUserId: ID!, $liked: Boolean!) {
    likeUser(targetUserId: $targetUserId, liked: $liked)
  }
`;
