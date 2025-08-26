"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Colors", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(
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
          "серебристый"
        ),
        allowNull: false,
      },
      pantone: {
        type: Sequelize.STRING,
      },
      hex: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Colors");
  },
};
