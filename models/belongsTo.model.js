import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class BelongsTo extends Model {}

BelongsTo.init({}, {
  sequelize,
  tableName: "belongs_to",
  timestamps: true
});