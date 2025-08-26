const OrderService = require('../services/Order.service');
const isValidId = require('../utils/isValidId');
const formatResponse = require('../utils/formatResponse');

class OrderController {
  static async getAllOrders(req, res) {
    try {
      const orders = await OrderService.getAll();

      if (orders.length === 0) {
        return res.status(200).json(formatResponse(204, 'No orders found', []));
      }

      res.status(200).json(formatResponse(200, 'success', orders));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getOrderById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid order ID'));
    }

    try {
      //? За запросы в БД отвечает сервис (форматируем id под тип данных number)
      const order = await OrderService.getById(+id);

      if (!order) {
        return res.status(404).json(formatResponse(404, `Order with id ${id} not found`));
      }

      res.status(200).json(formatResponse(200, 'success', order));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async createOrder(req, res) {
    const { total, address } = req.body;

    try {
      const { buyer } = res.locals.buyer;
      //? За запросы в БД отвечает сервис
      const newOrder = await OrderService.create({
        buyerId: buyer.id,
        total,
        status: 'новый',
        isPaid: false,
        address,
        trackingNumber: '',
      });

      if (!newOrder) {
        return res.status(400).json(formatResponse(400, `Failed to create new order`));
      }

      res.status(201).json(formatResponse(201, 'success', newOrder));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async updateOrder(req, res) {
    const { id } = req.params;
    const { status, isPaid, address, trackingNumber, total } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }

    try {
      const updatedOrder = await OrderService.update(+id, {
        status,
        isPaid,
        address,
        trackingNumber,
        total,
      });

      if (!updatedOrder) {
        return res.status(404).json(formatResponse(404, `Order with id ${id} not found`));
      }

      res.status(200).json(formatResponse(200, 'success', updatedOrder));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async deleteOrder(req, res) {
    const { id } = req.params;
    const { seller } = res.locals.seller;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }
    if (seller.role !== 'admin') {
      return res.status(400).json(formatResponse(400, 'Invalid role for deleting order'));
    }

    try {
      const deletedOrder = await OrderService.delete(+id, seller.id);

      if (!deletedOrder) {
        return res.status(404).json(formatResponse(404, `Color with id ${id} not found`));
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

module.exports = OrderController;
