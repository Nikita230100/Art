const cartService = require('../services/Cart.service');
const formatResponse = require('../utils/formatResponse');

// Добавление товара в корзину
const addToCart = async (req, res) => {
  try {
    const { artId } = req.params;
    const { id: buyerId } = res.locals.buyer;

    const result = await cartService.addToCart(buyerId, artId);

    return res.status(200).json(formatResponse(200, 'success', result));
  } catch (error) {
    console.error('Error updating art:', error);
    return res.status(500).json(formatResponse(500, 'Internal server error', null, error.message));
  }
};

// Удаление товара из корзины
const removeFromCart = async (req, res) => {
  try {
    const { artId } = req.params;
    const { id: buyerId } = res.locals.buyer;
    // const { completeRemoval = false } = req.body;

    await cartService.removeFromCart(buyerId, artId);
    return res
      .status(200)
      .json(formatResponse(200, 'success', { message: 'Item updated', artId: Number(artId) }));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json(formatResponse(500, 'Internal server error', null, error.message));
  }
};
// Получение корзины
const getCart = async (req, res) => {
  try {
    const { id: buyerId } = res.locals.buyer;

    const result = await cartService.getCart(buyerId);
    return res.status(200).json(formatResponse(200, 'success', result));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json(formatResponse(500, 'Internal server error', null, error.message));
  }
};
// Обновление количества товара в корзине
const updateCartItem = async (req, res) => {
  try {
    const { artId } = req.params;
    const { id: buyerId } = res.locals.buyer;
    const { quantity } = req.body;

    const result = await cartService.updateCartItem(buyerId, artId, quantity);
    return res.status(200).json(formatResponse(200, 'success', result));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json(formatResponse(500, 'Internal server error', null, error.message));
  }
};
// Очистка корзины
const clearCart = async (req, res) => {
  try {
    const { id: buyerId } = res.locals.buyer;
    const data = await cartService.clearCart(buyerId);
    return res.status(200).json(formatResponse(200, 'success', data));
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json(formatResponse(500, 'Internal server error', null, error.message));
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItem,
  clearCart,
};
