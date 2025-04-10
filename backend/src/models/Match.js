// backend/src/models/Match.js
import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Match = sequelize.define("Match", {
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Match;
