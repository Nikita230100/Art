"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartItems", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      cartId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Carts",
          key: "id",
        },
      },
      artId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Arts",
          key: "id",
        },
      },
      qty: {
        type: Sequelize.INTEGER,
      },
      priceAtPurchase: {
        type: Sequelize.DECIMAL(12, 2),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("CartItems");
  },
};
