// backend/src/models/Match.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Match = sequelize.define(
  "Match",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user1Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user2Id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    compat: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  { timestamps: true }
);

export default Match;
