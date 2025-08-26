const { Seller } = require('../db/models');

class SellerService {
  static async getByEmail(email) {
    return await Seller.findOne({ where: { email } });
  }

  static async create(sellerData) {
    return await Seller.create(sellerData);
  }

  // изменение данных продавца
  static async update(id, updateData) {
    const seller = await Seller.findByPk(id);
    if (!seller) {
      throw new Error('Seller not found');
    }
    return await seller.update(updateData);
  }
}

module.exports = SellerService;
