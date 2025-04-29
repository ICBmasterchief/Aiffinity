// frontend/src/graphql/notificationQueries.js
import { gql } from "@apollo/client";

export const GET_NOTIFS = gql`
  query GetNotifications {
    getNotifications {
      id
      type
      payload
      read
      createdAt
    }
  }
`;

export const NOTIF_SUBS = gql`
  subscription OnNotificationAdded {
    notificationAdded {
      id
      type
      payload
      read
      createdAt
    }
  }
`;

export const MARK_NOTIFS_READ = gql`
  mutation MarkNotificationsRead($matchId: ID) {
    markNotificationsRead(matchId: $matchId)
  }
`;
