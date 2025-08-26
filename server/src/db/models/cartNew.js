"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartNew extends Model {
    static associate({ Buyer, Art }) {
      this.belongsTo(Buyer, { foreignKey: "buyerId" });
      this.belongsTo(Art, { foreignKey: "artId" });
    }
  }
  CartNew.init(
    {
      buyerId: DataTypes.INTEGER,
      artId: DataTypes.INTEGER,
      quantity: DataTypes.INTEGER,
      sum: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "CartNew",
    }
  );
  return CartNew;
};
