// backend/src/graphql/resolvers/discover.js

import UserAIProfile from "../../models/UserAIProfile.js";
import { compatBetween } from "../../utils/compat.js";
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

  const candidateAge = {
    age: {
      [Op.between]: [currentUser.searchMinAge, currentUser.searchMaxAge],
    },
  };

  return {
    id: {
      [Op.ne]: currentUser.id,
      ...(swipedUserIds.length ? { [Op.notIn]: swipedUserIds } : {}),
    },
    ...candidateGender,
    ...candidateSearchGender,
    ...candidateAge,
  };
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
        const iaCands = await UserAIProfile.findAll({
          where: { userId: { [Op.notIn]: [user.userId, ...swipedIds] } },
          include: [
            {
              association: "User",
              where: {
                age: {
                  [Op.between]: [
                    currentUser.searchMinAge,
                    currentUser.searchMaxAge,
                  ],
                },
              },
            },
          ],
        });

        const picked = iaCands
          .slice(0, K)
          .map((prof) => ({
            prof,
            pct: compatBetween(meProf, prof),
          }))
          .filter((p) => p.pct !== null && p.pct > 5);

        if (picked.length && Math.random() > pFallback) {
          const total = picked.reduce((s, p) => s + p.pct ** 2, 0);
          let r = Math.random() * total;
          let chosen = picked[0];
          for (const p of picked) {
            r -= p.pct ** 2;
            if (r <= 0) {
              chosen = p;
              break;
            }
          }
          return {
            user: chosen.prof.User,
            compat: chosen.pct,
          };
        }
      }

      const random = await User.findOne({
        where: buildRandomWhere(currentUser, swipedIds),
        order: sequelize.random(),
      });
      if (!random) return null;

      if (meProf) {
        const otherProf = await UserAIProfile.findByPk(random.id);
        if (otherProf) {
          const pct = compatBetween(meProf, otherProf);
          return { user: random, compat: pct };
        }
      }

      return { user: random, compat: null };
    },
  },
};

export default discoverResolvers;
