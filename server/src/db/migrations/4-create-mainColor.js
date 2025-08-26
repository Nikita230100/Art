"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("MainColors", {
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
        // нельзя удалять цвет вместе с картиной
        // onDelete: "CASCADE",
      },
      colorId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Colors",
          key: "id",
        },
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
    await queryInterface.dropTable("MainColors");
  },
};
