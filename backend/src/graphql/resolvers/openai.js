// src/graphql/resolvers/openai.js
import openaiClient from "../../utils/openaiClient.js";

const openaiResolvers = {
  Query: {
    chatWithOpenAI: async (_, { prompt, history }, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }

      let messages =
        Array.isArray(history) && history.length > 0
          ? [...history]
          : [
              {
                role: "system",
                content:
                  "Como psicólogo experto, tu objetivo es analizar a los usuarios de una app de citas para generar perfiles psicológicos, creando así un sistema de compatibilidad. Para ello, realiza un cuestionario de no más de 15 a 20 preguntas para conocer a fondo su personalidad. Elige cuidadosamente las preguntas para obtener un análisis preciso. Una vez completado, elabora un perfil psicológico detallado. El usuario está listo, ¡puedes comenzar!",
              },
            ];

      messages.push({ role: "user", content: prompt });

      try {
        const response = await openaiClient.chat.completions.create({
          model: "gpt-4o-mini", // Modelo de chatGPT
          messages: messages,
          max_tokens: 200,
          temperature: 0.7,
        });

        console.log("Respuesta de OpenAI:", response.data);

        return response.data.choices[0].message.content;
      } catch (error) {
        if (error.response && error.response.data) {
          console.error("Error en OpenAI API:", error.response.data);
        } else {
          console.error("Error en OpenAI API:", error.message);
        }
        throw new Error("Error al comunicarse con la API de OpenAI");
      }
    },
  },
};

export default openaiResolvers;
