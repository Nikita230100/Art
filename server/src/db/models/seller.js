"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Seller extends Model {
    static associate({ Art }) {
      this.hasMany(Art, { foreignKey: "artistId" });
    }
  }
  Seller.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      avatar: DataTypes.STRING,
      isActive: DataTypes.BOOLEAN,
      isEmailVerified: DataTypes.BOOLEAN,
      isPhoneVerified: DataTypes.BOOLEAN,
      isTwoFactorEnabled: DataTypes.BOOLEAN,
      role: {
        type: DataTypes.ENUM("admin", "seller"),
        defaultValue: "seller",
      },
    },
    {
      sequelize,
      modelName: "Seller",
    }
  );
  return Seller;
};
