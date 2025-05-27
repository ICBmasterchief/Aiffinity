// backend/src/graphql/resolvers/chatStarter.js

import { withFilter } from "graphql-subscriptions";
import UserChatMessage from "../../models/UserChatMessage.js";
import UserAIProfile from "../../models/UserAIProfile.js";
import Match from "../../models/Match.js";
import openai from "../../utils/openaiClient.js";
import redisPubSub from "../../redisPubSub.js";
import { Op } from "sequelize";
import {
  acquireStarterLock,
  releaseStarterLock,
} from "../../utils/starterLock.js";

const SYSTEM_TOPIC_ADDED = "SYSTEM_TOPIC_ADDED";

const chatStarterResolvers = {
  Query: {
    starterStatus: async (_, { matchId }, { user }) => {
      if (!user) throw new Error("No autorizado");

      const hasStarter =
        (await UserChatMessage.count({
          where: { conversationId: matchId, system: true },
        })) > 0;

      const match = await Match.findByPk(matchId);
      if (!match) throw new Error("Match no encontrado");

      const ids = [match.user1Id, match.user2Id];
      const profs = await UserAIProfile.count({
        where: { userId: { [Op.in]: ids } },
      });

      return { hasStarter, canGenerate: profs === 2 };
    },
  },

  Mutation: {
    generateStarter: async (_, { matchId }, { user }) => {
      if (!user) throw new Error("No autorizado");

      const gotLock = await acquireStarterLock(matchId);
      if (!gotLock) return false;

      try {
        const done = await UserChatMessage.count({
          where: { conversationId: matchId, system: true },
        });
        if (done) return true;

        const match = await Match.findByPk(matchId);
        if (!match) throw new Error("Match no encontrado");

        const [userA, userB] = [match.user1Id, match.user2Id];

        const profiles = await UserAIProfile.findAll({
          where: { userId: { [Op.in]: [userA, userB] } },
        });
        if (profiles.length < 2) return false;

        const me = profiles.find((p) => p.userId === user.userId);
        const them = profiles.find((p) => p.userId !== user.userId);

        const prompt = `
        Perfil A:
        ${me.summary}

        Perfil B:
        ${them.summary}

        - Tu rol:
        Eres psicólogo y consejero de citas en una app de citas. 
        Tu misión es ayudar a iniciar una conversación entre dos personas, basándote únicamente en sus perfiles. 
        Tu objetivo es redactar una única frase rompehielos que pueda servir como primer mensaje entre ellos, 
        y que esté cuidadosamente adaptada a lo que comparten realmente.

        - Directrices psicológicas obligatorias:

        1. Lee ambos perfiles con atención y detecta únicamente intersecciones reales.
        No mezcles intereses opuestos o incompatibles (por ejemplo, no combines fantasía con moda, o videojuegos con cenas de etiqueta).
        Si detectas que los intereses de una persona podrían generar rechazo o incomodidad en la otra, descarta completamente ese tema.

        2. Busca afinidades profundas o complementarias: 
        no tanto lo que hacen, sino cómo viven lo que hacen (sobre todo si tienen aficiones muy distintas o incompatibles).
        Pueden tener distintas formas de expresar lo mismo.

        3. El punto de conexión debe partir de una actitud vital, forma de observar el mundo, o necesidad emocional compartida,
        aunque se manifieste en ámbitos distintos.

        4. Piensa como lo haría una persona observadora, socialmente inteligente y con buena intuición.
        Tu rompehielos debe sonar natural, no como una frase de anuncio o una escena inventada.

        5. Apóyate en valores compartidos, actitudes vitales similares, o formas parecidas de disfrutar el tiempo libre,
        aunque no tengan exactamente el mismo hobby.

        6. No fuerces la creatividad ni inventes escenas. Si no encuentras un punto en común, es mejor no inventar uno.
        No mezcles elementos incompatibles por hacer algo original.

        - Sobre el rompehielos:

        Tu frase debe ser una apertura que se sienta humana, directa y auténtica.

        Debe ser una pregunta o comentario breve, realista, directo, con tono cotidiano y cercano.

        No uses "ustedes", siempre tutea, que no suene formal.

        No debe requerir respuestas largas o complejas.

        No debe mencionar directamente intereses concretos (como rol, moda, videojuegos, películas, viajes, etc.) si no están claramente compartidos sin conflicto.

        No deben parecer narraciones, anuncios románticos, ni frases prefabricadas.

        No uses frases genéricas como:
        “tu serie favorita” / “una noche ideal” / “imagina que…” / “si pudieras…” / “un plan perfecto sería…”

        - Tu objetivo:
        Detectar una forma de conectar que no genere rechazo en ninguno de los perfiles, sino que despierte curiosidad, complicidad o simpatía. 

        - Output:
        Devuelve una breve introducción en tono cercano (como asistente o guía emocional), que no supere las 110 palabras,
        indicando que has analizado los "perfiles AIffinity" y que propones una frase rompehielos basada en lo que comparten los usuarios.
        Hazlo de manera natural, como si estuvieras hablando directamente a ellos de forma cercana y con entusiasmo.
        Por favor, habla como se hace en España: usando 'vosotros' en vez de 'ustedes' y conjugaciones como 'sois' o 'usáis'. No quiero que uses formas latinoamericanas.
        Luego, escribe solo esa frase rompehielos destacada. No añadas contexto adicional ni explicaciones posteriores.
        Recuerda que debe ser una frase corta y sencilla.
        `;

        const { choices } = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
        });

        const text = choices[0].message.content.trim();

        const sysMsg = await UserChatMessage.create({
          conversationId: matchId,
          senderId: 0,
          content: text,
          system: true,
        });

        redisPubSub.publish(SYSTEM_TOPIC_ADDED, {
          systemTopicAdded: sysMsg.toJSON(),
          matchId,
        });

        return true;
      } finally {
        await releaseStarterLock(matchId);
      }
    },
  },

  Subscription: {
    systemTopicAdded: {
      subscribe: withFilter(
        () => redisPubSub.asyncIterator(SYSTEM_TOPIC_ADDED),
        (payload, variables) =>
          String(payload.matchId) === String(variables.matchId)
      ),
    },
  },
};

export default chatStarterResolvers;
