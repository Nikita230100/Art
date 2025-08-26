const ColorService = require('../services/Color.service');
const isValidId = require('../utils/isValidId');
// const ColorValidator = require('../utils/Color.validator');
const formatResponse = require('../utils/formatResponse');

class ColorController {
  static async getAllColors(req, res) {
    try {
      const colors = await ColorService.getAll();

      if (colors.length === 0) {
        return res.status(200).json(formatResponse(204, 'No colors found', []));
      }

      res.status(200).json(formatResponse(200, 'success', colors));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getColorById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid color ID'));
    }

    try {
      //? За запросы в БД отвечает сервис (форматируем id под тип данных number)
      const color = await ColorService.getById(+id);

      if (!color) {
        return res.status(404).json(formatResponse(404, `Color with id ${id} not found`));
      }

      res.status(200).json(formatResponse(200, 'success', color));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async createColor(req, res) {
    const { name, pantone, hex } = req.body;

    // const { isValid, error } = ColorValidator.validate({ title, body });
    // if (!isValid) {
    //   return res
    //     .status(400)
    //     .json(formatResponse(400, 'Validation error', null, error));
    // }

    try {
      // const { user } = res.locals;

      const newColor = await ColorService.create({
        name,
        pantone,
        hex,
      });

      if (!newColor) {
        return res.status(400).json(formatResponse(400, `Failed to create new color`));
      }

      res.status(201).json(formatResponse(201, 'success', newColor));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }
}

module.exports = ColorController;
