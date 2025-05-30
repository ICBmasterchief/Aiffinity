// backend/src/models/Swipe.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Swipe = sequelize.define(
  "Swipe",
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
    targetUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    liked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { timestamps: true }
);

export default Swipe;
