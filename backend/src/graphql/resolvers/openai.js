// src/graphql/resolvers/openai.js
import openaiClient from "../../utils/openaiClient.js";

const openaiResolvers = {
  Query: {
    chatWithOpenAI: async (_, { prompt }, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      try {
        const response = await openaiClient.chat.completions.create({
          model: "gpt-4o-mini", // Modelo de chatGPT
          messages: [{ role: "user", content: prompt }],
          max_tokens: 200,
          temperature: 0.7,
        });

        return response.choices[0].message.content;
      } catch (error) {
        console.error("Error en OpenAI API:", error);
        throw new Error("Error al comunicarse con OpenAI API");
      }
    },
  },
};

export default openaiResolvers;
