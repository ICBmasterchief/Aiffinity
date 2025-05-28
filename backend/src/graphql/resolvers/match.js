// backend/src/graphql/resolvers/match.js
import Match from "../../models/Match.js";
import User from "../../models/User.js";
import { Op } from "sequelize";
import Swipe from "../../models/Swipe.js";
import UserChatMessage from "../../models/UserChatMessage.js";
import Notification from "../../models/Notification.js";
import sequelize from "../../config/database.js";

const matchResolvers = {
  Query: {
    getMatches: async (_, __, context) => {
      if (!context.user) throw new Error("No autorizado");
      const userId = context.user.userId;

      const matches = await Match.findAll({
        where: {
          [Op.or]: [{ user1Id: userId }, { user2Id: userId }],
        },
      });

      const matchSummaries = await Promise.all(
        matches.map(async (match) => {
          const otherUserId =
            match.user1Id === userId ? match.user2Id : match.user1Id;
          const otherUser = await User.findByPk(otherUserId);
          return {
            id: match.id,
            user: otherUser,
          };
        })
      );
      return matchSummaries;
    },
    getMatchInfo: async (_, { matchId }, context) => {
      if (!context.user) throw new Error("No autorizado");

      const match = await Match.findByPk(matchId);
      if (!match) throw new Error("Match no encontrado");

      const userId = context.user.userId;
      const otherUserId =
        match.user1Id === userId ? match.user2Id : match.user1Id;
      const otherUser = await User.findByPk(otherUserId);

      if (!otherUser) throw new Error("Usuario no encontrado");

      return {
        id: match.id,
        user: otherUser,
        compat: match.compat,
      };
    },
  },
  Mutation: {
    deleteMatch: async (_, { matchId }, { user }) => {
      if (!user) throw new Error("No autorizado");

      const match = await Match.findByPk(matchId);
      if (!match) throw new Error("Match no encontrado");

      const userId = user.userId;
      if (![match.user1Id, match.user2Id].includes(userId))
        throw new Error("No permitido");

      await sequelize.transaction(async (t) => {
        await UserChatMessage.destroy({
          where: { conversationId: matchId },
          transaction: t,
        });

        await Notification.destroy({
          where: {
            type: { [Op.in]: ["message", "match"] },
            payload: { matchId },
          },
          transaction: t,
        });

        await Swipe.destroy({
          where: {
            [Op.or]: [
              { userId: match.user1Id, targetUserId: match.user2Id },
              { userId: match.user2Id, targetUserId: match.user1Id },
            ],
          },
          transaction: t,
        });

        await match.destroy({ transaction: t });
      });

      return true;
    },
  },
};

export default matchResolvers;
