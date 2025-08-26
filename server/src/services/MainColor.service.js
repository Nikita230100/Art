const { MainColor, Color } = require("../db/models");

class MainColorService {
  //* Получить все записи о цветах
  static async getAll() {
    return await MainColor.findAll();
  }
  //* Получить все записи о цветах для конкретного произведения
  static async getAllArtColors(artId) {
    return await MainColor.findAll({ where: { artId }, include: [{ model: Color }] });
  }
  //* Найти запись по ID записи
  static async getById(id) {
    return await MainColor.findByPk(id);
  }

  //* Создать новyю запись о цвете
  static async create(artId, colorId) {
    return await MainColor.create({ artId, colorId });
  }

  //* Обновить запись о цвете по ID
  static async update(id, artId, colorId) {
    const mainColor = await this.getById(id);
    if (mainColor) {
      mainColor.artId = artId;
      mainColor.colorId = colorId;
      await mainColor.save();
    }
    return mainColor; 
  }

  //* Удалить цвет по ID
  static async delete(id) {
    const mainColor = await this.getById(id);
    if (mainColor) {
      if (mainColor.id !== id) {
        throw new Error("Error: Cannot delete this color");
      }
      await mainColor.destroy();
    }
    return mainColor; 
  }
}

module.exports = MainColorService;
