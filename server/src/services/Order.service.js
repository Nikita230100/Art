const { Order } = require("../db/models");

class OrderService {
  //* Получить все заказы
  static async getAll() {
    return await Order.findAll();
  }

  //* Найти заказ по ID
  static async getById(id) {
    return await Order.findByPk(id);
  }

  //* Создать новый заказ
  static async create(data) {
    return await Order.create(data);
  }

  //* Обновить заказ по ID
  static async update(id, data) {
    const order = await this.getById(id);
    if (order) {
      order.status = data.status;
      order.isPaid = data.isPaid;
      order.address = data.address;
      order.trackingNumber = data.trackingNumber;
      await order.save();
    }
    return order; 
  }

  //* Удалить заказ по ID
  static async delete(id) {
    const order = await this.getById(id);
    if (order) {
      if (order.id !== id) {
        throw new Error("Error: Cannot delete this order");
      }
      await order.destroy();
    }
    return order; 
  }
}

module.exports = OrderService;
