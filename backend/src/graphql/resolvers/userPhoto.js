// backend/src/graphql/resolvers/userPhoto.js
import { GraphQLUpload } from "graphql-upload-ts";
import fs from "fs";
import path from "path";
import UserPhoto from "../../models/UserPhoto.js";
import crypto from "crypto";
import sequelize from "../../config/database.js";

const ALLOWED = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/heic": ".heic",
};

const saveFile = async (createReadStream, userId, mimetype) => {
  const extFromMime = ALLOWED[mimetype];
  if (!extFromMime) {
    throw new Error(`Tipo de archivo no permitido: ${mimetype}`);
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
    uploadUserPhotos: async (_, { files }, { user, req }) => {
      if (!user) throw new Error("Unauthorized");

      const existing = await UserPhoto.count({
        where: { userId: user.userId },
      });
      if (existing + files.length > 10) throw new Error("Máximo 10 fotos");

      const saved = [];
      for (const filePromise of files) {
        const { createReadStream, mimetype } = await filePromise;
        console.log("createReadStream: ", createReadStream);
        console.log("mimetype: ", mimetype);
        const filePath = await saveFile(
          createReadStream,
          user.userId,
          mimetype
        );

        const photo = await UserPhoto.create({
          userId: user.userId,
          filePath,
          position: existing + saved.length,
        });
        saved.push(photo);
      }
      return saved;
    },

    deleteUserPhoto: async (_, { photoId }, { user }) => {
      const photo = await UserPhoto.findByPk(photoId);
      if (!photo || photo.userId !== user.userId)
        throw new Error("No permitido");
      await photo.destroy();
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
