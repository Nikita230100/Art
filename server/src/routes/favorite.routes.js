const router = require('express').Router();
const FavoriteController = require('../controllers/Favorite.controller');
const verifyRefreshTokenBuyer = require('../middleware/verifyRefreshTokenBuyer');

router
  .get('/', verifyRefreshTokenBuyer, FavoriteController.getAll)

  .post('/', verifyRefreshTokenBuyer, FavoriteController.create)

  .delete('/:id', verifyRefreshTokenBuyer, FavoriteController.delete);

module.exports = router;
