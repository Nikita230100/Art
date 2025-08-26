const { Color } = require("../db/models");

class ColorService {
  //* Получить все цвета
  static async getAll() {
    return await Color.findAll();
  }

  //* Найти цвет по ID
  static async getById(id) {
    return await Color.findByPk(id);
  }

  //* Создать новый цвет
  static async create(data) {
    return await Color.create(data);
  }

  //* Обновить цвет по ID
  static async update(id, data) {
    const color = await this.getById(id);
    if (color) {
      color.name = data.name;
      color.pantone = data.pantone;
      color.hex = data.hex;
      await color.save();
    }
    return color; 
  }

  //* Удалить цвет по ID
  static async delete(id) {
    const color = await this.getById(id);
    if (color) {
      if (color.id !== id) {
        throw new Error("Error: Cannot delete this color");
      }
      await color.destroy();
    }
    return color; 
  }
}

module.exports = ColorService;
