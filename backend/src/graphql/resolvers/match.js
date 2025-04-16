// backend/src/graphql/resolvers/match.js
import Match from "../../models/Match.js";
import User from "../../models/User.js";
import { Op } from "sequelize";

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
      };
    },
  },
};

export default matchResolvers;
