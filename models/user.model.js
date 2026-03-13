import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize.client.js";

export class User extends Model { }


User.init(
  {
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: false,
    },
    firstname: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: false,
    },
    age: {
      type: DataTypes.INTEGER,

    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: 'user',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    is_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    token_confirm: {
      type: DataTypes.STRING,
      allowNull: true
    },
    token_reset: {
      type: DataTypes.STRING,
      allowNull: true
    },
    token_reset_expires: {
      type: DataTypes.DATE,
      allowNull: true
    }


  },
  {
    sequelize,
    tableName: "users",
  }
);

