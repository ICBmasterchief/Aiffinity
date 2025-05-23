// backend/src/graphql/resolvers/swipe.js
import Swipe from "../../models/Swipe.js";
import User from "../../models/User.js";
import Match from "../../models/Match.js";
import { Op } from "sequelize";
import sequelize from "../../config/database.js";
import Notification from "../../models/Notification.js";
import redisPubSub from "../../redisPubSub.js";
import UserPhoto from "../../models/UserPhoto.js";

const NOTIF_TOPIC = "NOTIFICATION_ADDED";

const swipeResolvers = {
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
      let match = null;

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
          [match, matchCreated] = await Match.findOrCreate({
            where: { user1Id: id1, user2Id: id2 },
          }).then(([m, created]) => [m, created]);
        }
      }

      if (match) {
        const me = await User.findByPk(userId);
        const otherUser = await User.findByPk(targetUserId);

        const mainOf = async (uid) =>
          (
            await UserPhoto.findOne({
              where: { userId: uid },
              order: [["position", "ASC"]],
            })
          )?.filePath;

        const payloadForTarget = {
          matchId: match.id,
          name: me.name,
          photo: await mainOf(userId),
        };
        const payloadForMe = {
          matchId: match.id,
          name: otherUser.name,
          photo: await mainOf(targetUserId),
        };

        const notifTarget = await Notification.create({
          userId: targetUserId,
          type: "match",
          payload: payloadForTarget,
        });
        const notifMe = await Notification.create({
          userId: userId,
          type: "match",
          payload: payloadForMe,
        });

        await redisPubSub.publish(NOTIF_TOPIC, {
          notificationAdded: notifTarget.toJSON(),
        });
        await redisPubSub.publish(NOTIF_TOPIC, {
          notificationAdded: notifMe.toJSON(),
        });
      }

      const matchedUser = matchCreated
        ? await User.findByPk(targetUserId)
        : null;

      return {
        matchCreated,
        matchedUser,
        matchId: match ? match.id : null,
      };
    },
  },
};

export default swipeResolvers;
