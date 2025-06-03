// backend/src/graphql/resolvers/aiProfile.js

import openai from "../../utils/openaiClient.js";
import UserAIProfile from "../../models/UserAIProfile.js";
import { GraphQLError } from "graphql";

const aiProfileResolvers = {
  Query: {
    hasAIProfile: async (_, __, { user }) => {
      if (!user) throw new GraphQLError("No autorizado");
      const prof = await UserAIProfile.findByPk(user.userId);
      return !!prof;
    },
    getAIProfile: async (_, __, { user }) => {
      if (!user) throw new GraphQLError("No autorizado");
      const prof = await UserAIProfile.findByPk(user.userId);
      if (!prof) return null;

      const elapsedH = (Date.now() - new Date(prof.updatedAt).getTime()) / 36e5;

      return {
        summary: prof.summary,
        updatedAt: prof.updatedAt.toISOString(),
        canRetry: elapsedH >= 24,
      };
    },
  },

  Mutation: {
    saveAIProfile: async (_, { answers }, { user }) => {
      if (!user) throw new GraphQLError("No autorizado");
      if (!answers?.length) throw new GraphQLError("Sin respuestas");

      const prev = await UserAIProfile.findByPk(user.userId);
      if (prev) {
        const hours = (Date.now() - prev.updatedAt.getTime()) / 36e5;
        if (hours < 24)
          throw new GraphQLError(
            `Ya actualizaste tu perfil hace ${hours.toFixed(
              1
            )} h. Vuelve en ${Math.ceil(24 - hours)} h`
          );
      }

      const MIN = 8;
      if (!answers.length || answers.some((a) => a.a.trim().length < MIN)) {
        throw new GraphQLError(
          "Responde todas las preguntas con al menos " + MIN + " caracteres"
        );
      }

      const prompt = `
        Eres un psicólogo experto en personalidad.
        Tu labor es generar un perfil psicológico de 120-150 palabras a partir de las respuestas del siguiente cuestionario.
        (IMPORTANTE - Si las respuestas son incompletas, aleatorias o sin ningún sentido, responde ÚNICAMENTE: "Perfil insuficiente".)
        Cuestionario:
        ${answers
          .map((x, i) => `${i + 1}. ${x.q}\nRespuesta: ${x.a}`)
          .join("\n")}
      `;

      const { choices } = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
      });

      const summary = choices[0].message.content.trim();

      if (/^perfil insuficiente/i.test(summary)) {
        throw new GraphQLError("perfil insuficiente");
      }

      const embRes = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: summary,
      });
      const embArr = Float32Array.from(embRes.data[0].embedding);
      const embBuf = Buffer.from(embArr.buffer);

      await UserAIProfile.upsert({
        userId: user.userId,
        summary,
        embedding: embBuf,
      });

      return true;
    },
  },
};

export default aiProfileResolvers;
