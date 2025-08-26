const router = require('express').Router();
const CartItemController = require('../controllers/CartItem.controller');
const verifyAccessTokenBuyer = require('../middleware/verifyAccessTokenBuyer');

router
  //* Метод GET - получить все позиции в корзинах
  .get('/', CartItemController.getAllItemsInAllCarts)

  //* Метод GET - получить все позиции в одной корзине
  .get('/:cartId', CartItemController.getAllItemsInOneCart)

  //* Метод POST - создать позицию в корзине

  .post('/', verifyAccessTokenBuyer, CartItemController.createCartItem)

  //* Метод PUT - обновить позицию в корзине

  .put('/:id', verifyAccessTokenBuyer, CartItemController.updateCartItem)

  //* Метод DELETE - удалить корзину
  .delete('/:id', verifyAccessTokenBuyer, CartItemController.deleteCartItem);

module.exports = router;
