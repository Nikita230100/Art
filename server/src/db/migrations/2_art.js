"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Arts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      width: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      height: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      depth: {
        type: Sequelize.INTEGER,
      },
      mainColor: {
        type: Sequelize.STRING,
      },
      style: {
        type: Sequelize.STRING,
      },
      material: {
        type: Sequelize.STRING,
      },
      quantity: {
        type: Sequelize.INTEGER,
      },
      price: {
        type: Sequelize.INTEGER,
      },
      img: {
        type: Sequelize.TEXT,
      },
      artistId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Sellers",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      isSold: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      isTrending: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isNew: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isBestSeller: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      isLimitedEdition: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable("Arts");
  },
};
