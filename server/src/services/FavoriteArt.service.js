const { FavoriteArt, Art } = require("../db/models");

class FavoriteService {
  //* Получить все избранные
  static async getAll(userId) {
    return await FavoriteArt.findAll({
      attributes: ["id", "userId", "artId"],
      where: { userId },
      include: {
        model: Art,
        attributes: [
          "id",
          "name",
          "price",
          "mainColor",
          "width",
          "height",
          "style",
          "material",
          "isLimitedEdition",
          "quantity",
          "type",
          "img",
        ],
      },
    });
  }
  //* Найти избранное по ID
  static async getById(id) {
    return await FavoriteArt.findByPk(id);
  }

  //* Создать избранное
  static async create(data) {
    return await FavoriteArt.create(data);
  }

  //* Удалить избранное по ID
  static async delete(id) {
    
    const favorite = await FavoriteArt.findByPk(id);
    
    if (favorite) {
      if (favorite.id !== id) {
        throw new Error("Error: Cannot delete this favorite");
      }
      await favorite.destroy();
    }

    return favorite; //* Возвращаем удалённый объект или null
  }
}

module.exports = FavoriteService;
