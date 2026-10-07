import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

// Modelo Tag (N:M con Article)
export const Tag = sequelize.define(
  "Tag",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: true,
      validate: { len: [2, 30], isAlphanumeric: true },
    },
  },
  { timestamps: true, tableName: "Tags" },
);