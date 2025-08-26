"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CartNews", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      artId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Arts",
          key: "id",
        },
      },
      buyerId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Buyers",
          key: "id",
        },
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      sum: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("CartNews");
  },
};
