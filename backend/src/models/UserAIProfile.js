// backend/src/models/UserAIProfile.js

import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const UserAIProfile = sequelize.define(
  "UserAIProfile",
  {
    userId: { type: DataTypes.INTEGER, primaryKey: true },
    summary: DataTypes.TEXT,
    embedding: DataTypes.BLOB,
  },
  { timestamps: true }
);

export default UserAIProfile;
