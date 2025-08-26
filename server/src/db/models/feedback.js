"use strict";
const { Model, DataTypes, Sequelize } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Feedback extends Model {
    static associate(models) {}
  }
  Feedback.init(
    {
      userId: DataTypes.INTEGER,
      artId: DataTypes.INTEGER,
      text: DataTypes.STRING,
      stars: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Feedback",
    }
  );
  return Feedback;
};
