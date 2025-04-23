// backend/src/graphql/resolvers/swipe.js
import Swipe from "../../models/Swipe.js";
import User from "../../models/User.js";
import Match from "../../models/Match.js";
import { Op } from "sequelize";
import sequelize from "../../config/database.js";

const swipeResolvers = {
  Query: {
    getRandomUser: async (_, __, context) => {
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
        searchGender: {
          [Op.or]: ["ambos", myPluralGender],
        },
      };

      const swipedRecords = await Swipe.findAll({
        attributes: ["targetUserId"],
        where: { userId },
      });
      const swipedUserIds = swipedRecords.map((record) => record.targetUserId);

      const whereClause = {
        id: {
          [Op.ne]: userId,
          ...(swipedUserIds.length ? { [Op.notIn]: swipedUserIds } : {}),
        },
        ...candidateGenderCondition,
        ...candidateSearchGenderCondition,
      };

      const candidate = await User.findOne({
        where: whereClause,
        order: sequelize.random(),
      });
      return candidate;
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

      let matchCreated = false;
      let matchId = null;

      if (liked) {
        const reciprocalSwipe = await Swipe.findOne({
          where: {
            userId: targetUserId,
            targetUserId: userId,
            liked: true,
          },
        });
        if (reciprocalSwipe) {
          const [id1, id2] = [userId, targetUserId]
            .map(Number)
            .sort((a, b) => a - b);
          let match = await Match.findOne({
            where: {
              user1Id: id1,
              user2Id: id2,
            },
          });
          if (!match) {
            match = await Match.create({
              user1Id: id1,
              user2Id: id2,
            });
            matchCreated = true;
            matchId = match.id;
          }
        }
      }

      const matchedUser = matchCreated
        ? await User.findByPk(targetUserId)
        : null;

      return { matchCreated, matchedUser, matchId };
    },
  },
};

export default swipeResolvers;
