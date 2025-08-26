const ArtService = require('../services/Art.service');
const isValidId = require('../utils/isValidId');
// const ArtValidator = require('../utils/Art.validator');
const formatResponse = require('../utils/formatResponse');
const fs = require('fs');
const path = require('path');
class ArtController {
  static async getAllArts(req, res) {
    try {
      //? За запросы в БД отвечает сервис
      const arts = await ArtService.getAll();

      if (arts.length === 0) {
        return res.status(200).json(formatResponse(204, 'No arts found', []));
      }

      res.status(200).json(formatResponse(200, 'success', arts));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async getArtById(req, res) {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid art ID'));
    }

    try {
      const art = await ArtService.getById(+id);

      if (!art) {
        return res.status(404).json(formatResponse(404, `Art with id ${id} not found`));
      }

      res.status(200).json(formatResponse(200, 'success', art));
    } catch ({ message }) {
      console.error(message);
      res.status(500).json(formatResponse(500, 'Internal server error', null, message));
    }
  }

  static async createArt(req, res) {
    const {
      type,
      name,
      description,
      width,
      height,
      depth,
      mainColor,
      style,
      material,
      quantity,
      price,
      isLimitedEdition,
    } = req.body;
    const { seller } = res.locals;

    const requiredFields = ['type', 'name', 'width', 'height', 'price'];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res
        .status(400)
        .json(formatResponse(400, `Missing required fields: ${missingFields.join(', ')}`));
    }

    const imageUrl = req.file
      ? `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${req.file.filename}`
      : null;

    try {
      const artData = {
        type,
        name,
        description,
        width: +width,
        height: +height,
        depth: depth ? +depth : null,
        mainColor,
        style,
        material,
        quantity: +quantity,
        price: +price,
        isLimitedEdition: isLimitedEdition === 'true',
        artistId: seller.id,
        img: imageUrl,
        isSold: false,
        isActive: true,
        isTrending: false,
        isNew: true,
        isBestSeller: false,
      };

      console.log('Creating art with data:', artData);

      const newArt = await ArtService.create(artData);
      return res.status(201).json(formatResponse(201, 'success', newArt));
    } catch (error) {
      console.error('Error creating art:', error);
      if (error.message.includes('already exists')) {
        return res.status(400).json(formatResponse(400, error.message));
      }
      if (error.message.includes('Invalid numeric values')) {
        return res.status(400).json(formatResponse(400, error.message));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, error.message));
    }
  }

  static async updateArt(req, res) {
    const { id } = req.params;
    const {
      type,
      name,
      description,
      width,
      height,
      depth,
      mainColor,
      style,
      material,
      quantity,
      price,
      isLimitedEdition,
    } = req.body;
    const { seller } = res.locals;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid art ID'));
    }

    try {
      //? За запросы в БД отвечает сервис (форматируем id под тип данных number без утилиты)
      const existingArt = await ArtService.getById(+id);

      if (!existingArt) {
        return res.status(404).json(formatResponse(404, `Art with id ${id} not found`));
      }

      if (existingArt.artistId !== seller.id) {
        return res
          .status(403)
          .json(formatResponse(403, 'You are not authorized to update this art'));
      }

      const updateData = {
        type,
        name,
        description,
        width: +width,
        height: +height,
        depth: depth ? +depth : null,
        mainColor,
        style,
        material,
        quantity: +quantity,
        price: +price,
        isLimitedEdition: isLimitedEdition === 'true',
      };

      if (req.file) {
        if (existingArt.img) {
          try {
            const oldFilename = existingArt.img.split('/').pop();
            const filePath = path.join(__dirname, '..', '..', 'uploads', oldFilename);
            if (fs.existsSync(filePath)) {
              fs.unlinkSync(filePath);
            }
          } catch (error) {
            console.error('Error deleting old image:', error);
          }
        }

        updateData.img = `${process.env.BASE_URL || 'http://localhost:3001'}/uploads/${
          req.file.filename
        }`;
      }

      const updatedArt = await ArtService.update(+id, updateData);
      return res.status(200).json(formatResponse(200, 'success', updatedArt));
    } catch (error) {
      console.error('Error updating art:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, error.message));
    }
  }

  static async deleteArt(req, res) {
    const { id } = req.params;
    const { seller } = res.locals;

    if (!isValidId(id)) {
      return res.status(400).json(formatResponse(400, 'Invalid art ID'));
    }

    try {
      const deletedArt = await ArtService.delete(+id, seller.id);

      if (!deletedArt) {
        return res.status(404).json(formatResponse(404, `Art with id ${id} not found`));
      }

      return res
        .status(200)
        .json(formatResponse(200, `Art with id ${id} successfully deleted`, deletedArt));
    } catch (error) {
      console.error('Error deleting art:', error);
      if (error.message.includes('Unauthorized')) {
        return res.status(403).json(formatResponse(403, error.message));
      }
      return res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, error.message));
    }
  }

  static async getBySellerId(req, res) {
    const { seller } = res.locals;
    console.log('Seller from res.locals:', seller);

    try {
      const arts = await ArtService.getBySellerId(seller.id);
      res.status(200).json(formatResponse(200, 'success', arts));
    } catch (error) {
      console.error('Error getting arts by seller ID:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, error.message));
    }
  }

  static async getByColors(req, res) {
    try {
      const { colors } = req.body;
      const art = await ArtService.getByColors(colors);
      res.status(200).json(formatResponse(200, 'success', art));
    } catch (error) {
      console.error('Error getting art by colors:', error);
      return res
        .status(500)
        .json(formatResponse(500, 'Internal server error', null, error.message));
    }
  }
}

module.exports = ArtController;
