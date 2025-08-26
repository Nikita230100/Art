const FavoriteService = require('../services/FavoriteArt.service');
const formatResponse = require('../utils/formatResponse');

class FavoriteController {
  static async getAll(req, res) {
    try {
      const { buyer } = res.locals;
      const favorites = await FavoriteService.getAll(buyer.id);

      if (favorites.length === 0) {
        return res.status(200).json(formatResponse(204, 'No favorites found', []));
      }

      res.status(200).json(formatResponse(200, 'success', favorites));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async create(req, res) {
    const { artId } = req.body;
    const { buyer } = res.locals;

    try {
      const newFavorite = await FavoriteService.create({
        userId: buyer.id,
        artId,
      });

      if (!newFavorite) {
        return res.status(400).json(formatResponse(400, `Failed to create new color`));
      }

      res.status(201).json(formatResponse(201, 'success', newFavorite));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async delete(req, res) {
    const { id } = req.params;

    try {
      const deletedFavorite = await FavoriteService.delete(+id);

      if (!deletedFavorite) {
        return res.status(404).json(formatResponse(404, `Favorite with id ${id} not found`));
      }

      res.status(200);
      res
        .status(200)
        .json(formatResponse(200, `Favorite with id ${id} successfully deleted`, deletedFavorite));
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

module.exports = FavoriteController;
