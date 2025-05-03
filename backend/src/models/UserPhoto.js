// backend/src/models/UserPhoto.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import User from "./User.js";

const UserPhoto = sequelize.define("UserPhoto", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  filePath: { type: DataTypes.STRING, allowNull: false },
  position: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasMany(UserPhoto, { foreignKey: "userId", as: "photos" });
UserPhoto.belongsTo(User, { foreignKey: "userId" });

export default UserPhoto;
