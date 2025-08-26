"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    static associate({ Art }) {
      this.belongsTo(Art, { foreignKey: "artId" });
    }
  }
  Image.init(
    {
      imgLink: DataTypes.TEXT,
      artId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Image",
    }
  );
  return Image;
};
