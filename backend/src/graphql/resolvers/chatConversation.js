// backend/src/graphql/resolvers/chatConversation.js
import UserChatMessage from "../../models/UserChatMessage.js";

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

      const newMessage = await UserChatMessage.create({
        conversationId: matchId,
        senderId: context.user.userId,
        content,
      });
      return newMessage;
    },
  },
};

export default chatConversationResolvers;
