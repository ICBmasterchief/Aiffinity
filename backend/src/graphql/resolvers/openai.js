// backend/src/graphql/resolvers/openai.js
import openaiClient from "../../utils/openaiClient.js";
import ChatMessage from "../../models/ChatMessage.js";

const openaiResolvers = {
  Query: {
    chatWithOpenAI: async (_, { prompt }, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }

      const userId = context.user.userId;

      await ChatMessage.create({
        userId,
        role: "user",
        content: prompt,
      });

      const messages = await ChatMessage.findAll({
        where: { userId },
        order: [["createdAt", "ASC"]],
      });

      const openAIMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini", // Modelo de ChatGPT
        messages: openAIMessages,
        max_tokens: 200,
        temperature: 0.7,
      });

      const assistantContent = response.choices[0].message.content;

      await ChatMessage.create({
        userId,
        role: "assistant",
        content: assistantContent,
      });

      return assistantContent;
    },

    getUserMessages: async (_, __, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      const userId = context.user.userId;
      return await ChatMessage.findAll({
        where: { userId },
        order: [["createdAt", "ASC"]],
      });
    },
  },

  Mutation: {
    resetChat: async (_, __, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      const userId = context.user.userId;
      await ChatMessage.destroy({ where: { userId } });
      return "Historial de chat reseteado";
    },
  },
};

export default openaiResolvers;
