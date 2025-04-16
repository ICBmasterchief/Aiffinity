// backend/src/graphql/resolvers/chatConversation.js
import UserChatMessage from "../../models/UserChatMessage.js";
import redisPubSub from "../../redisPubSub.js";
import { withFilter } from "graphql-subscriptions";

const CONVERSATION_MESSAGE_ADDED = "CONVERSATION_MESSAGE_ADDED";

const chatConversationResolvers = {
  Query: {
    getConversationMessages: async (_, { matchId }, context) => {
      if (!context.user) throw new Error("No autorizado");
      const messages = await UserChatMessage.findAll({
        where: { conversationId: matchId },
        order: [["createdAt", "ASC"]],
      });
      return messages;
    },
  },
  Mutation: {
    sendConversationMessage: async (_, { matchId, content }, context) => {
      if (!context.user) throw new Error("No autorizado");
      const newMessageInstance = await UserChatMessage.create({
        conversationId: matchId,
        senderId: context.user.userId,
        content,
      });
      if (!newMessageInstance) throw new Error("Error al crear el mensaje");

      const newMessage = newMessageInstance.toJSON();

      await redisPubSub.publish(CONVERSATION_MESSAGE_ADDED, {
        conversationMessageAdded: newMessage,
      });
      return newMessage;
    },
  },
  Subscription: {
    conversationMessageAdded: {
      subscribe: withFilter(
        () => {
          const asyncIter = redisPubSub.asyncIterator(
            CONVERSATION_MESSAGE_ADDED
          );
          return asyncIter;
        },
        (payload, variables) => {
          if (!payload || !payload.conversationMessageAdded) return false;

          const pubConversationId = String(
            payload.conversationMessageAdded.conversationId
          );
          const varMatchId = String(variables.matchId);
          return pubConversationId === varMatchId;
        }
      ),

      resolve: (payload) => {
        return payload.conversationMessageAdded;
      },
    },
  },
};

export default chatConversationResolvers;
