const router = require('express').Router();
const OrderController = require('../controllers/Order.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  //* Метод GET - получить все заказы
  .get('/', OrderController.getAllOrders)

  //* Метод GET - получить заказ по ID
  .get('/:id', OrderController.getOrderById)

  //* Метод POST - создать заказ

  .post('/', verifyAccessToken, OrderController.createOrder)

  //* Метод PUT - обновить заказ

  .put('/:id', verifyAccessToken, OrderController.updateOrder)

  //* Метод DELETE - удалить заказ
  .delete('/:id', verifyAccessToken, OrderController.deleteOrder);

module.exports = router;
