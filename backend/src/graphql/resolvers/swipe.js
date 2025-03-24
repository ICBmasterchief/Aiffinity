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

      // Ejemplo simple: obtener 10 usuarios aleatorios distintos al actual
      const users = await User.findAll({
        where: { id: { [Op.ne]: userId } },
        limit: 10,
        order: sequelize.random(), // "ORDER BY RAND()" en MySQL
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

      // Crear o actualizar el swipe
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
