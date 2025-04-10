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

      const matchUsers = await Promise.all(
        matches.map(async (match) => {
          const otherUserId =
            match.user1Id === userId ? match.user2Id : match.user1Id;
          return await User.findByPk(otherUserId);
        })
      );
      return matchUsers;
    },
  },
};

export default matchResolvers;
