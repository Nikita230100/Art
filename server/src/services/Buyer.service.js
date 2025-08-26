const { Buyer } = require("../db/models");

class BuyerService {
  static async getByEmail(email) {
    return await Buyer.findOne({ where: { email } });
  }

  static async create(buyerData) {
    return await Buyer.create(buyerData);
  }

  static async getById(id) {
    return await Buyer.findByPk(id);
  }

  static async update(id, buyerData) {
    const buyer = await this.getById(id);
    if (!buyer) return null;
    return await buyer.update(buyerData);
  }
}

module.exports = BuyerService;
