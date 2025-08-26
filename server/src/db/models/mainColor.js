"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MainColor extends Model {
    static associate(models) {
      this.belongsTo(models.Color, { foreignKey: "colorId" });
      this.belongsTo(models.Art, { foreignKey: "artId" });
    }
  }
  MainColor.init(
    {
      artId: DataTypes.INTEGER,
      colorId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MainColor",
    }
  );
  return MainColor;
};
