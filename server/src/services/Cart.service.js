const { CartNew, Art } = require('../db/models');
// Добавление товара в корзину
const addToCart = async (buyerId, artId) => {
  const art = await Art.findByPk(artId);
  if (!art) throw new Error('Art not found');

  const [cartItem, created] = await CartNew.findOrCreate({
    where: { buyerId, artId },
    defaults: {
      buyerId,
      artId,
      quantity: 1,
      sum: art.price,
    },
  });

  if (!created) {
    cartItem.quantity += 1;
    cartItem.sum = art.price;
    await cartItem.save();
  }

  return cartItem;
};

// Удаление товара из корзины
const removeFromCart = async (buyerId, artId) => {
  const cartItem = await CartNew.findOne({ where: { buyerId, artId } });

  if (!cartItem) {
    throw new Error('Item not found in cart');
  }

  await cartItem.destroy();
};

// Получение корзины
const getCart = async (buyerId) => {
  const cartItems = await CartNew.findAll({
    where: { buyerId },
    include: {
      model: Art,
      attributes: ['id', 'name', 'img', 'price'],
    },
  });

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.sum, 0);

  return {
    items: cartItems,
    total,
  };
};

// Обновление количества товара в корзине
const updateCartItem = async (buyerId, artId, quantity) => {
  const cartItem = await CartNew.findOne({
    where: { buyerId, artId },
    include: [Art],
  });

  if (!cartItem) {
    throw new Error('Item not found in cart');
  }

  cartItem.quantity = quantity;
  await cartItem.save();

  return cartItem;
};

// Очистка корзины
const clearCart = async (buyerId) => {
  await CartNew.destroy({ where: { buyerId } });
  return { message: 'Cart cleared' };
};

module.exports = {
  addToCart,
  removeFromCart,
  getCart,
  updateCartItem,
  clearCart,
};
