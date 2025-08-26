"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate({ Order, CartItem, Art }) {
      Cart.hasOne(Order, { foreignKey: "cartId" });
      Cart.belongsToMany(Art, { foreignKey: "cartId", through: CartItem });
    }
  }
  Cart.init(
    {
      buyerId: DataTypes.INTEGER,
      status: {
        type: DataTypes.ENUM("active", "converted", "abandoned"),
        defaultValue: "active",
        comment:
          "active - активная корзина, converted - преобразована в заказ, abandoned - брошена",
      },
    },
    {
      sequelize,
      modelName: "Cart",
    }
  );
  return Cart;
};
