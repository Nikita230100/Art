const CartItemService = require('../services/CartItem.service');
const isValidId = require('../utils/isValidId');
// const CartValidator = require('../utils/Cart.validator');
const formatResponse = require('../utils/formatResponse');

class CartItemController {
  static async getAllItemsInAllCarts(req, res) {
    try {
      const allCartItems = await CartItemService.getAll();

      if (allCartItems.length === 0) {
        return res.status(200).json(formatResponse(204, 'No items found in any cart', []));
      }

      res.status(200).json(formatResponse(200, 'success', allCartItems));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getAllItemsInOneCart(req, res) {
    const { cartId } = req.params;
    try {
      //? За запросы в БД отвечает сервис
      const allItemsInOneCart = await CartItemService.getAllItemsByCartId(cartId);

      if (allItemsInOneCart.length === 0) {
        return res.status(200).json(formatResponse(204, 'No items found in any cart', []));
      }

      res.status(200).json(formatResponse(200, 'success', allItemsInOneCart));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getItemByCartIdAndByArtId(req, res) {
    const { cartId } = req.params;
    const { artId } = req.body;

    //? Проверка на валидность ID (обработка негативного кейса) (можно делать и не внутри try/catch)
    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }

    try {
      //? За запросы в БД отвечает сервис (форматируем id под тип данных number)
      const itemInCart = await CartItemService.getItemByCartIdAndByArtId(cartId, artId);

      if (!itemInCart) {
        return res
          .status(404)
          .json(formatResponse(404, `Item with id ${artId} not found in cart with id ${cartId}`));
      }

      res.status(200).json(formatResponse(200, 'success', itemInCart));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async createCartItem(req, res) {
    const { cartId, artId, quantity, priceAtPurchase } = req.body;

    // const { isValid, error } = ColorValidator.validate({ title, body });
    // if (!isValid) {
    //   return res
    //     .status(400)
    //     .json(formatResponse(400, 'Validation error', null, error));
    // }

    try {
      // const { buyer } = res.locals.buyer;

      const newItemInCart = await CartItemService.create({
        cartId,
        artId,
        quantity,
        priceAtPurchase,
      });

      if (!newItemInCart) {
        return res.status(400).json(formatResponse(400, `Failed to create new item in the cart`));
      }

      res.status(201).json(formatResponse(201, 'success', newItemInCart));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async updateCartItem(req, res) {
    const { id } = req.params;
    const { quantity, priceAtPurchase } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }

    //   const { isValid, error } = ColorValidator.validate({ title, body });
    //   if (!isValid) {
    //     return res
    //       .status(400)
    //       .json(formatResponse(400, "Validation error", null, error));
    //   }

    try {
      const updatedCartItem = await CartItemService.update(+id, {
        quantity,
        priceAtPurchase,
      });

      if (!updatedCartItem) {
        return res.status(404).json(formatResponse(404, `Cart item with id ${id} not found`));
      }

      res.status(200).json(formatResponse(200, 'success', updatedCartItem));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async deleteCartItem(req, res) {
    const { id } = req.params;
    // удаляем позицию в автоматом после конвертации в заказ
    // const { buyer } = res.locals.buyer;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }

    try {
      const deletedCartItem = await CartItemService.delete(+id);

      if (!deletedCartItem) {
        return res.status(404).json(formatResponse(404, `ErrorCart item with id ${id} not found`));
      }

      res.status(200);
      res.status(200).json(formatResponse(200, `Color with id ${id} successfully deleted`));
    } catch ({ message }) {
      console.error(message);
      if (message.includes('Unauthorized')) {
        res.status(400).json(formatResponse(400, message, null, message));
      } else {
        res.status(500).json(formatResponse(500, 'Internal server error', null, message));
      }
    }
  }
}

module.exports = CartItemController;
