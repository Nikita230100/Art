const router = require('express').Router();
const ColorController = require('../controllers/Color.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');

router
  //* Метод GET - получить все задачи
  .get('/', ColorController.getAllColors)

  //* Метод GET - получить задачу по ID
  .get('/:id', ColorController.getColorById)

  //* Метод POST - создать задачу
  .post('/', verifyAccessToken, ColorController.createColor);

module.exports = router;
