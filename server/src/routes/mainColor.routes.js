const router = require('express').Router();
const MainColorController = require('../controllers/MainColor.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  //* Метод GET - получить все записи о цветах
  .get('/', MainColorController.getAllMainColors)

  //* Метод GET - получить запись о цвете по ID Art
  .get('/:artId', MainColorController.getAllArtColors)

  //* Метод POST - создать запись о цвете
  .post('/', verifyAccessToken, MainColorController.createMainColor)

  // * Метод DELETE - удалить задачу
  .delete('/:id', verifyAccessToken, MainColorController.deleteMainColor);

module.exports = router;
