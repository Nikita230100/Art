const MainColorService = require('../services/MainColor.service');
const isValidId = require('../utils/isValidId');
const formatResponse = require('../utils/formatResponse');

class MainColorController {
  static async getAllMainColors(req, res) {
    try {
      const colors = await MainColorService.getAll();

      if (colors.length === 0) {
        return res.status(200).json(formatResponse(204, 'No colors found', []));
      }

      res.status(200).json(formatResponse(200, 'success', colors));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getAllArtColors(req, res) {
    const { artId } = req.params;
    if (!artId) {
      return res.status(400).json(formatResponse(400, 'Art ID is required'));
    }
    const mainColorsOfArt = await MainColorService.getAllArtColors(artId);
    res.status(200).json(formatResponse(200, 'success', mainColorsOfArt));
  }

  static async getMainColorById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }

    try {
      const mainColor = await MainColorService.getById(+id);

      if (!color) {
        return res.status(404).json(formatResponse(404, `Color with id ${id} not found`));
      }

      res.status(200).json(formatResponse(200, 'success', mainColor));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async createMainColor(req, res) {
    const { artId, colorId } = req.body;

    try {
      const newMainColor = await MainColorService.create(artId, colorId);

      if (!newMainColor) {
        return res.status(400).json(formatResponse(400, `Failed to create new color`));
      }

      res.status(201).json(formatResponse(201, 'success', newMainColor));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  // update не делаем: галочку убрали - удалили, поставили - добавили
  // единственный update, цвет в БД поменяли или в ЛК администратора

  static async deleteMainColor(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }

    try {
      const deletedMainColor = await MainColorService.delete(+id);

      if (!deletedMainColor) {
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

module.exports = MainColorController;
