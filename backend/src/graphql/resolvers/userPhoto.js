// backend/src/graphql/resolvers/userPhoto.js
import { GraphQLUpload } from "graphql-upload-ts";
import fs from "fs";
import path from "path";
import UserPhoto from "../../models/UserPhoto.js";
import crypto from "crypto";
import sequelize from "../../config/database.js";
import { Op } from "sequelize";
import { GraphQLError } from "graphql";

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

  const dir = path.join("uploads", String(userId));
  fs.mkdirSync(dir, { recursive: true });

  const ext = extFromMime;
  const safeName =
    Date.now() + "_" + crypto.randomBytes(4).toString("hex") + ext;

  const filePath = path.join(dir, safeName);
  const webPath = `uploads/${userId}/${safeName}`;

  await new Promise((res, rej) =>
    createReadStream()
      .pipe(fs.createWriteStream(filePath))
      .on("finish", res)
      .on("error", rej)
  );

  return webPath.replace(/\\/g, "/");
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
