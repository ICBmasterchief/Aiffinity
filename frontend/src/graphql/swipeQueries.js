// frontend/src/graphql/swipeQueries.js
import { gql } from "@apollo/client";

export const GET_RANDOM_USERS = gql`
  query GetRandomUsers {
    getRandomUsers {
      id
      name
      description
      photoUrl
    }
  }
`;

export const LIKE_USER = gql`
  mutation LikeUser($targetUserId: ID!, $liked: Boolean!) {
    likeUser(targetUserId: $targetUserId, liked: $liked)
  }
`;
