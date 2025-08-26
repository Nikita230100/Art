"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Cart, { foreignKey: "cartId" });
    }
  }
  Order.init(
    {
      buyerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.DECIMAL(12, 2), // 12 цифр всего, 2 после запятой
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      status: {
        type: DataTypes.ENUM(
          "новый",
          "подтвержден",
          "отправлен",
          "доставлен",
          "отменен"
        ),
        defaultValue: "новый",
        allowNull: false,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      address: DataTypes.STRING,
      trackingNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
