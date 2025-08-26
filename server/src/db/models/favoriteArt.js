"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class FavoriteArt extends Model {
    static associate(models) {
      this.belongsTo(models.Buyer, { foreignKey: "userId" });
      this.belongsTo(models.Art, { foreignKey: "artId" });
    }
  }
  FavoriteArt.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: DataTypes.INTEGER,
      artId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "FavoriteArt",
    }
  );
  return FavoriteArt;
};
