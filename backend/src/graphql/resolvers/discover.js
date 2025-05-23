// backend/src/graphql/resolvers/discover.js

import UserAIProfile from "../../models/UserAIProfile.js";
import User from "../../models/User.js";
import Swipe from "../../models/Swipe.js";
import { Op } from "sequelize";
import sequelize from "../../config/database.js";

function buildRandomWhere(currentUser, swipedUserIds) {
  const genderMap = { hombres: "hombre", mujeres: "mujer" };
  const myPlural = currentUser.gender === "hombre" ? "hombres" : "mujeres";

  const candidateGender =
    currentUser.searchGender !== "ambos"
      ? { gender: genderMap[currentUser.searchGender] }
      : {};

  const candidateSearchGender = {
    searchGender: { [Op.or]: ["ambos", myPlural] },
  };

  return {
    id: {
      [Op.ne]: currentUser.id,
      ...(swipedUserIds.length ? { [Op.notIn]: swipedUserIds } : {}),
    },
    ...candidateGender,
    ...candidateSearchGender,
  };
}

const toF32 = (buf) =>
  new Float32Array(
    buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength)
  );

const cosine = (a, b) => {
  let dot = 0,
    na = 0,
    nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] ** 2;
    nb += b[i] ** 2;
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
};

function compatScore(cos) {
  const y = 1 / (1 + Math.exp(-12 * (cos - 0.7)));
  return Math.round(y * 100);
}

const K = 20;
const pFallback = 0.3;

const discoverResolvers = {
  Query: {
    getCompatibleCandidate: async (_, __, { user }) => {
      if (!user) throw new Error("No autorizado");

      const currentUser = await User.findByPk(user.userId);
      const swipedIds = (
        await Swipe.findAll({
          attributes: ["targetUserId"],
          where: { userId: user.userId },
        })
      ).map((s) => s.targetUserId);

      const meProf = await UserAIProfile.findByPk(user.userId);
      if (meProf) {
        const meVec = toF32(meProf.embedding);

        const iaCands = await UserAIProfile.findAll({
          where: { userId: { [Op.notIn]: [user.userId, ...swipedIds] } },
          include: ["User"],
        });

        const picked = [];
        for (const c of iaCands.slice(0, K)) {
          const cos = cosine(meVec, toF32(c.embedding));
          if (cos > 0.05) picked.push({ prof: c, cos });
        }

        if (picked.length && Math.random() > pFallback) {
          const total = picked.reduce((s, p) => s + p.cos ** 2, 0);
          let r = Math.random() * total;
          let chosen = picked[0];
          for (const p of picked) {
            r -= p.cos ** 2;
            if (r <= 0) {
              chosen = p;
              break;
            }
          }
          return {
            user: chosen.prof.User,
            compat: compatScore(chosen.cos),
          };
        }
      }

      const whereClause = buildRandomWhere(currentUser, swipedIds);
      const random = await User.findOne({
        where: whereClause,
        order: sequelize.random(),
      });
      if (!random) return null;

      if (meProf) {
        const otherProf = await UserAIProfile.findByPk(random.id);
        if (otherProf) {
          const cos = cosine(
            toF32(meProf.embedding),
            toF32(otherProf.embedding)
          );
          const pct = compatScore(cos);
          return { user: random, compat: pct };
        }
      }

      return { user: random, compat: null };
    },
  },
};

export default discoverResolvers;
