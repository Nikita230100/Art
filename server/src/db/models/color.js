"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Color extends Model {
    static associate({ MainColor, Art }) {
      this.belongsToMany(Art, { foreignKey: "colorId", through: MainColor });
    }
  }
  Color.init(
    {
      name: {
        type: DataTypes.STRING,
        values: [
          "красный",
          "зеленый",
          "синий",
          "желтый",
          "черный",
          "белый",
          "оранжевый",
          "розовый",
          "фиолетовый",
          "голубой",
          "бирюзовый",
          "коричневый",
          "серый",
          "бордовый",
          "салатовый",
          "лавандовый",
          "золотой",
          "серебристый",
        ],
        allowNull: false,
        unique: true,
      },
      pantone: {
        type: DataTypes.STRING,
        unique: true,
      },
      hex: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Color",
    }
  );
  return Color;
};
