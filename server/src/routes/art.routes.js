const router = require('express').Router();
const ArtController = require('../controllers/Art.controller');
const verifyAccessToken = require('../middleware/verifyAccessToken');
const upload = require('../middleware/upload');

router
  //* Метод GET - получить все задачи
  .get('/', ArtController.getAllArts)

  //* Метод GET - получить все произведения продавца
  .get('/seller', verifyAccessToken, ArtController.getBySellerId)

  //* Метод GET - получить задачу по ID
  .get('/:id', ArtController.getArtById)

  //* Метод POST - создать задачу (запустит функцию контроллер для создания новой задачи)
  .post('/', verifyAccessToken, upload.single('img'), ArtController.createArt)

  //* Метод POST - поиск произведения по цветам
  .post('/colors', ArtController.getByColors)

  //* Метод PUT - обновить задачу
  .put('/:id', verifyAccessToken, upload.single('img'), ArtController.updateArt)

  //* Метод DELETE - удалить задачу
  .delete('/:id', verifyAccessToken, ArtController.deleteArt);

module.exports = router;
