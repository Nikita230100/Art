"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class CartItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  CartItem.init(
    {
      cartId: DataTypes.INTEGER,
      artId: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      priceAtPurchase: DataTypes.DECIMAL(12, 2),
    },
    {
      sequelize,
      modelName: "CartItem",
    }
  );
  return CartItem;
};
