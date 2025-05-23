// backend/src/models/User.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import ChatMessage from "./ChatMessage.js";
import UserAIProfile from "./UserAIProfile.js";

const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  gender: {
    type: DataTypes.ENUM("hombre", "mujer"),
    allowNull: true,
  },
  searchGender: {
    type: DataTypes.ENUM("hombres", "mujeres", "ambos"),
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

User.hasMany(ChatMessage, { foreignKey: "userId" });
ChatMessage.belongsTo(User, { foreignKey: "userId" });

User.hasOne(UserAIProfile, { foreignKey: "userId" });
UserAIProfile.belongsTo(User, { foreignKey: "userId" });

export default User;
