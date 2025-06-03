// backend/src/graphql/resolvers/userPhoto.js

import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";
import UserPhoto from "../../models/UserPhoto.js";
import sequelize from "../../config/database.js";
import { Op } from "sequelize";
import { GraphQLError } from "graphql";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../../utils/cloudinary.js";

const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
};

const saveFile = async (createReadStream, userId, mimetype) => {
  const extFromMime = ALLOWED[mimetype];
  if (!extFromMime) {
    throw new GraphQLError("Tipo de archivo no permitido", {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }

  const stream = createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const buffer = Buffer.concat(chunks);

  const folder = `uploads/${userId}`;
  const url = await uploadToCloudinary(buffer, folder);
  return url;
};

const userPhotoResolvers = {
  Upload: GraphQLUpload,

  Mutation: {
    uploadUserPhotos: async (_, { files }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const existingCount = await UserPhoto.count({
        where: { userId: user.userId },
      });
      if (existingCount + files.length > 10)
        throw new GraphQLError("Máximo 10 fotos", {
          extensions: { code: "BAD_USER_INPUT" },
        });

      const existingMax = await UserPhoto.max("position", {
        where: { userId: user.userId },
      });
      const startPos = Number.isFinite(existingMax) ? existingMax + 1 : 0;

      const saved = [];
      for (const filePromise of files) {
        const { createReadStream, mimetype } = await filePromise;
        const filePath = await saveFile(
          createReadStream,
          user.userId,
          mimetype
        );

        const photo = await UserPhoto.create({
          userId: user.userId,
          filePath,
          position: startPos + saved.length,
        });
        saved.push(photo);
      }
      return saved;
    },

    deleteUserPhoto: async (_, { photoId }, { user }) => {
      const photo = await UserPhoto.findByPk(photoId);
      if (!photo || photo.userId !== user.userId)
        throw new Error("No permitido");

      try {
        const url = new URL(photo.filePath);
        let after = url.pathname.split("/upload/")[1];
        after = after.replace(/^v\d+\//, "");
        const publicId = after.replace(/\.[^/.]+$/, "");
        await deleteFromCloudinary(publicId);
      } catch (err) {
        console.warn("⚠️ No se pudo borrar de Cloudinary:", err);
      }

      const deletedPos = photo.position;
      await photo.destroy();

      await UserPhoto.increment(
        { position: -1 },
        {
          where: {
            userId: user.userId,
            position: { [Op.gt]: deletedPos },
          },
        }
      );
      return true;
    },

    reorderUserPhotos: async (_, { order }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const photos = await UserPhoto.findAll({
        where: { userId: user.userId },
      });
      if (order.length !== photos.length) {
        throw new Error("Lista de reordenamiento incompleta");
      }

      const map = Object.fromEntries(order.map((id, idx) => [id, idx]));

      await sequelize.transaction(async (t) => {
        for (const id of order) {
          const negPos = -(map[id] + 1);
          await UserPhoto.update(
            { position: negPos },
            { where: { id }, transaction: t }
          );
        }

        for (const id of order) {
          const finalPos = map[id];
          await UserPhoto.update(
            { position: finalPos },
            { where: { id }, transaction: t }
          );
        }
      });

      return UserPhoto.findAll({
        where: { userId: user.userId },
        order: [["position", "ASC"]],
      });
    },
  },

  User: {
    async mainPhoto(parent) {
      const first = await UserPhoto.findOne({
        where: { userId: parent.id },
        order: [["position", "ASC"]],
      });
      return first ? first.filePath : "/default.jpg";
    },

    photos: (parent) =>
      UserPhoto.findAll({
        where: { userId: parent.id },
        order: [["position", "ASC"]],
      }),
  },
};

export default userPhotoResolvers;
