// backend/src/graphql/resolvers/notification.js
import Notification from "../../models/Notification.js";
import { withFilter } from "graphql-subscriptions";
import redisPubSub from "../../redisPubSub.js";

const NOTIF_TOPIC = "NOTIFICATION_ADDED";

const notificationResolvers = {
  Query: {
    getNotifications: async (_, __, { user }) => {
      if (!user) throw new Error("No autorizado");
      return await Notification.findAll({
        where: { userId: user.userId, read: false },
        order: [["createdAt", "DESC"]],
      });
    },
  },
  Mutation: {
    markNotificationsRead: async (_, { matchId }, { user }) => {
      if (!user) throw new Error("No autorizado");

      const base = { userId: user.userId, read: false };

      const where = matchId
        ? { ...base, type: "message", payload: { matchId } }
        : { ...base, type: "match" };

      await Notification.update({ read: true }, { where });
      return true;
    },
  },
  Subscription: {
    notificationAdded: {
      subscribe: withFilter(
        () => redisPubSub.asyncIterator(NOTIF_TOPIC),
        (payload, _, { user }) =>
          String(payload.notificationAdded.userId) === String(user?.userId)
      ),
      resolve: (payload) => payload.notificationAdded,
    },
  },
};

export default notificationResolvers;
