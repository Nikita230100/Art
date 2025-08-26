const router = require('express').Router();
const formatResponse = require('../utils/formatResponse');
const buyerRoutes = require('./buyer.routes');
const sellerRoutes = require('./seller.routes');
const colorRoutes = require('./color.routes');
const artRoutes = require('./art.routes');
const favoriteRoutes = require('./favorite.routes');
const cartRoutes = require('./cart.routes');
const cartItemRoutes = require('./cartItem.routes');
const orderRoutes = require('./order.routes');
const mainColorRoutes = require('./mainColor.routes');
const aiRouter = require('./ai.routes');

router.use('/buyer', buyerRoutes);
router.use('/seller', sellerRoutes);
router.use('/color', colorRoutes);
router.use('/art', artRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/cart', cartRoutes);
router.use('/cartItem', cartItemRoutes);
router.use('/order', orderRoutes);
router.use('/mainColor', mainColorRoutes);
router.use('/ai', aiRouter);

//! Обработка всех запросов на несуществующие маршруты
router.use((req, res) => {
  res.status(404).json(formatResponse(404, 'Not found'));
});

module.exports = router;
