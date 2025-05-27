// backend/src/graphql/typeDefs/notification.js
import { gql } from "apollo-server-express";

const notificationTypeDefs = gql`
  scalar JSON

  type Notification {
    id: ID!
    userId: ID!
    type: String!
    payload: JSON!
    read: Boolean!
    createdAt: String
  }

  extend type Query {
    getNotifications: [Notification!]!
  }

  extend type Mutation {
    markNotificationsRead(matchId: ID): Boolean!
  }

  extend type Subscription {
    notificationAdded: Notification!
  }
`;

export default notificationTypeDefs;
