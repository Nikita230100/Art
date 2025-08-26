"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Buyer extends Model {
    static associate({ Art, FavoriteArt, Feedback }) {
      this.belongsToMany(Art, { foreignKey: "userId", through: FavoriteArt });
      this.belongsToMany(Art, { foreignKey: "userId", through: Feedback });
    }
  }
  Buyer.init(
    {
      email: DataTypes.STRING,
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      phone: DataTypes.STRING,
      role: {
        type: DataTypes.ENUM("buyer", "seller"),
        defaultValue: "buyer",
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isPhoneVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      isTwoFactorEnabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Buyer",
    }
  );
  return Buyer;
};
