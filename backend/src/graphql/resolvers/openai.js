// src/graphql/resolvers/openai.js
import openaiClient from "../../utils/openaiClient.js";
import ChatMessage from "../../models/ChatMessage.js";

const openaiResolvers = {
  Query: {
    chatWithOpenAI: async (_, { prompt }, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }

      const userId = context.user.userId;

      // 1. Guardar el mensaje del usuario en la BD
      await ChatMessage.create({
        userId,
        role: "user",
        content: prompt,
      });

      // 2. Recuperar todos los mensajes anteriores de este usuario
      const messages = await ChatMessage.findAll({
        where: { userId },
        order: [["createdAt", "ASC"]], // Mantener orden cronológico
      });

      // 3. Convertirlos al formato que espera OpenAI
      const openAIMessages = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      // 4. Llamar a la API de OpenAI con TODO el historial
      const response = await openaiClient.chat.completions.create({
        model: "gpt-4o-mini", // o el modelo que uses
        messages: openAIMessages,
        max_tokens: 200,
        temperature: 0.7,
      });

      const assistantContent = response.choices[0].message.content;

      // 5. Guardar la respuesta del asistente en la BD
      await ChatMessage.create({
        userId,
        role: "assistant",
        content: assistantContent,
      });

      // 6. Devolver la respuesta al frontend
      return assistantContent;
    },

    getUserMessages: async (_, __, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      const userId = context.user.userId;
      // Retorna todos los mensajes de este usuario
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
