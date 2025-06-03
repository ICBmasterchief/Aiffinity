// frontend/src/graphql/swipeQueries.js
import { gql } from "@apollo/client";

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
