// backend/src/models/ChatMessage.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const ChatMessage = sequelize.define(
  "ChatMessage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "assistant", "system"),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default ChatMessage;
