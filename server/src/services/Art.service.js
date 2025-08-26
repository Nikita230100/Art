const { Art, sequelize, MainColor, Color, Sequelize } = require('../db/models');

class ArtService {
  //* Получить все произведения
  static async getAll() {
    return await Art.findAll();
  }

  //* Найти произведение по ID
  static async getById(id) {
    return await Art.findByPk(id);
  }

  //* Создать новое произведение
  static async create(data) {
    try {
      const existingArt = await Art.findOne({ where: { name: data.name } });
      if (existingArt) {
        throw new Error('Art with this name already exists');
      }

      if (data.width <= 0 || data.height <= 0 || data.price <= 0 || data.quantity <= 0) {
        throw new Error('Invalid numeric values. All numeric fields must be greater than 0');
      }

      return await Art.create(data);
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError' && error.errors?.[0]?.path === 'id') {
        await this.resetSequence();

        return await Art.create(data);
      }
      throw error;
    }
  }

  //* Обновить произведение по ID
  static async update(id, data) {
    const art = await this.getById(id);
    if (!art) {
      throw new Error('Art not found');
    }

    if (data.width <= 0 || data.height <= 0 || data.price <= 0 || data.quantity <= 0) {
      throw new Error('Invalid numeric values. All numeric fields must be greater than 0');
    }

    Object.assign(art, data);
    await art.save();
    return art;
  }

  //* Удалить произведение  продавца по ID
  static async delete(id, sellerId) {
    const art = await this.getById(id);
    if (!art) {
      throw new Error('Art not found');
    }

    if (art.artistId !== sellerId) {
      throw new Error('You are not authorized to delete this art');
    }

    await art.destroy();
    return art;
  }

  //* Сбросить последовательность ID
  static async resetSequence() {
    try {
      const [results] = await sequelize.query('SELECT MAX(id) as max_id FROM "Arts"');
      const maxId = results[0].max_id || 0;

      await sequelize.query(`ALTER SEQUENCE "Arts_id_seq" RESTART WITH ${maxId + 1}`);
      console.log('Последовательность Arts успешно сброшена');
    } catch (error) {
      console.error('Ошибка при сбросе последовательности:', error);
      throw error;
    }
  }

  static async getBySellerId(sellerId) {
    return await Art.findAll({ where: { artistId: sellerId } });
  }

  static async getByColors(colorsHexes) {
    try {
      const artIds = await sequelize.query(
        `
        SELECT "Art".id
        FROM "Arts" AS "Art"
        INNER JOIN "MainColors" AS "MainColor" ON "Art".id = "MainColor"."artId"
        INNER JOIN "Colors" AS "Color" ON "MainColor"."colorId" = "Color".id
        WHERE "Color"."hex" IN (:colors)
        GROUP BY "Art".id
        HAVING COUNT(DISTINCT "Color"."hex") = :colorCount
      `,
        {
          replacements: {
            colors: colorsHexes,
            colorCount: colorsHexes.length,
          },
          type: sequelize.QueryTypes.SELECT,
        },
      );

      const arts = await Art.findAll({
        where: {
          id: artIds.map((art) => art.id),
        },
        include: [
          {
            model: Color,
            as: 'Colors',
            through: {
              model: MainColor,
              attributes: [],
            },
          },
        ],
      });

      return arts;
    } catch (error) {
      console.error('Error getting art by colors:', error);
      throw error;
    }
  }
}

module.exports = ArtService;
