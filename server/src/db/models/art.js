"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Art extends Model {
    static associate({
      Seller,
      Buyer,
      Image,
      Feedback,
      FavoriteArt,
      MainColor,
      Color,
      CartItem,
      Cart,
    }) {
      this.belongsTo(Seller, { foreignKey: "artistId" });
      this.hasMany(Image, { foreignKey: "artId" });

      this.belongsToMany(Buyer, { foreignKey: "artId", through: Feedback });
      this.belongsToMany(Buyer, { foreignKey: "artId", through: FavoriteArt });
      this.belongsToMany(Color, { foreignKey: "artId", through: MainColor });

      this.belongsToMany(Cart, { foreignKey: "artId", through: CartItem });
    }
  }
  Art.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      width: DataTypes.INTEGER,
      height: DataTypes.INTEGER,
      depth: DataTypes.INTEGER,
      mainColor: DataTypes.STRING,
      style: DataTypes.STRING,
      material: DataTypes.STRING,
      quantity: DataTypes.INTEGER,
      price: DataTypes.INTEGER,
      img: DataTypes.STRING,
      isSold: DataTypes.BOOLEAN,
      isActive: DataTypes.BOOLEAN,
      isTrending: DataTypes.BOOLEAN,
      isNew: DataTypes.BOOLEAN,
      isBestSeller: DataTypes.BOOLEAN,
      isLimitedEdition: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Art",
    }
  );
  return Art;
};
