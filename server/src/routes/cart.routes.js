const router = require('express').Router();

const verifyAccessTokenBuyer = require('../middleware/verifyAccessTokenBuyer');

const {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItem,
  clearCart,
} = require('../controllers/Cart.controller');
// Получение корзины
router.get('/art', verifyAccessTokenBuyer, getCart);
// Добавление товара в корзину
router.post('/art/:artId', verifyAccessTokenBuyer, addToCart);
// Обновление количества товара в корзине
router.put('/art/:artId', verifyAccessTokenBuyer, updateCartItem);
// Удаление товара из корзины
router.delete('/art/:artId', verifyAccessTokenBuyer, removeFromCart);
// Очистка корзины
router.delete('/deletecart', verifyAccessTokenBuyer, clearCart);

module.exports = router;
