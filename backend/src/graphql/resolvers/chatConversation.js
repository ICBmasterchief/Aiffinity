// backend/src/graphql/resolvers/chatConversation.js
import UserChatMessage from "../../models/UserChatMessage.js";
import redisPubSub from "../../redisPubSub.js";
import { withFilter } from "graphql-subscriptions";
import Notification from "../../models/Notification.js";
import Match from "../../models/Match.js";

const CONVERSATION_MESSAGE_ADDED = "CONVERSATION_MESSAGE_ADDED";
const NOTIF_TOPIC = "NOTIFICATION_ADDED";

const chatConversationResolvers = {
  Query: {
    getConversationMessages: async (_, { matchId }, { user }) => {
      if (!user) throw new Error("No autorizado");
      return await UserChatMessage.findAll({
        where: { conversationId: matchId },
        order: [["createdAt", "ASC"]],
      }).then((msgs) =>
        msgs.map((m) => ({ ...m.toJSON(), system: !!m.system }))
      );
    },
  },
  Mutation: {
    sendConversationMessage: async (_, { matchId, content }, { user }) => {
      if (!user) throw new Error("No autorizado");
      const newMessageInstance = await UserChatMessage.create({
        conversationId: matchId,
        senderId: user.userId,
        content,
      });
      if (!newMessageInstance) throw new Error("Error al crear el mensaje");

      const newMessage = newMessageInstance.toJSON();

      await redisPubSub.publish(CONVERSATION_MESSAGE_ADDED, {
        conversationMessageAdded: newMessage,
      });

      const { user1Id, user2Id } = await Match.findByPk(matchId);
      const receiverId = user.userId === user1Id ? user2Id : user1Id;

      const notif = await Notification.create({
        userId: receiverId,
        type: "message",
        payload: { matchId },
      });

      await redisPubSub.publish(NOTIF_TOPIC, {
        notificationAdded: notif.toJSON(),
      });

      return newMessage;
    },
  },
  Subscription: {
    conversationMessageAdded: {
      subscribe: withFilter(
        () => redisPubSub.asyncIterator(CONVERSATION_MESSAGE_ADDED),
        (payload, variables) => {
          if (!payload || !payload.conversationMessageAdded) return false;

          const pubConversationId = String(
            payload.conversationMessageAdded.conversationId
          );
          const varMatchId = String(variables.matchId);
          return pubConversationId === varMatchId;
        }
      ),
      resolve: (payload) => payload.conversationMessageAdded,
    },
  },
};

export default chatConversationResolvers;
