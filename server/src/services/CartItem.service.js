const { CartItem } = require('../db/models');

class CartItemService {
  //* Получить все позиции во всех открытых корзинах
  static async getAll() {
    return await CartItem.findAll({
      where: {
        cart: {
          status: 'active',
        },
      },
    });
  }

  //* Найти все позиции в корзине по ID корзины
  static async getAllItemsByCartId(cartId) {
    return await CartItem.findAll({
      where: {
        cartId,
      },
    });
  }

  //* Найти позицию в корзине по ID корзины и ID арта
  static async getItemByCartIdAndArtId(cartId, artId) {
    return await CartItem.findOne({
      where: { cartId, artId },
    });
  }

  //* Найти позицию по ID позиции в таблице CartItem
  static async getById(id) {
    return await CartItem.findByPk(id);
  }

  //* Создать новую позицию в корзине
  static async create(data) {
    return await CartItem.create(data);
  }

  //* Обновить позицию в корзине по ID позиции в таблице CartItem
  static async update(id, data) {
    const cartItem = await this.getById(id);
    if (cartItem) {
      cartItem.qty = data.qty;
      cartItem.priceAtPurchase = data.priceAtPurchase;
      await cartItem.save();
    }
    return cartItem;
  }

  //* Удалить позицию в корзине по ID позиции в таблице CartItem
  static async delete(id) {
    const cartItem = await this.getById(id);
    if (cartItem) {
      if (cartItem.id !== id) {
        throw new Error('Error: Cannot delete this cartItem');
      }
      await cartItem.destroy();
    }
    return cartItem;
  }
}

module.exports = CartItemService;
