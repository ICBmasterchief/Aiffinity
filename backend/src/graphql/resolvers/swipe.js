// backend/src/graphql/resolvers/swipe.js
import Swipe from "../../models/Swipe.js";
import User from "../../models/User.js";
import { Op } from "sequelize";
import sequelize from "../../config/database.js";

const swipeResolvers = {
  Query: {
    getRandomUsers: async (_, __, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      const userId = context.user.userId;

      const currentUser = await User.findByPk(userId);
      if (!currentUser || !currentUser.gender || !currentUser.searchGender) {
        throw new Error("Perfil incompleto");
      }

      const genderMapping = {
        hombres: "hombre",
        mujeres: "mujer",
      };

      let candidateGenderCondition = {};
      if (currentUser.searchGender !== "ambos") {
        candidateGenderCondition = {
          gender: genderMapping[currentUser.searchGender],
        };
      }

      const myPluralGender =
        currentUser.gender === "hombre" ? "hombres" : "mujeres";

      const candidateSearchGenderCondition = {
        [Op.or]: [{ searchGender: "ambos" }, { searchGender: myPluralGender }],
      };

      const whereClause = {
        id: { [Op.ne]: userId },
        ...candidateGenderCondition,
        [Op.and]: [candidateSearchGenderCondition],
      };

      const users = await User.findAll({
        where: whereClause,
        limit: 10,
        order: sequelize.random(),
      });
      return users;
    },
  },
  Mutation: {
    likeUser: async (_, { targetUserId, liked }, context) => {
      if (!context.user) {
        throw new Error("No autorizado");
      }
      const userId = context.user.userId;

      await Swipe.upsert({
        userId,
        targetUserId: parseInt(targetUserId),
        liked,
      });

      return liked ? "Le diste Like al usuario" : "Le diste Dislike al usuario";
    },
  },
};

export default swipeResolvers;
