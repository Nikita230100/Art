const router = require('express').Router();
const SellerController = require('../controllers/Seller.controller');
const verifyRefreshToken = require('../middleware/verifyRefreshToken');
const upload = require('../middleware/upload');

router
  .get('/refreshTokens', verifyRefreshToken, SellerController.refreshTokens)
  .post('/signup', SellerController.signUp)
  .post('/signin', SellerController.signIn)
  .delete('/signout', SellerController.signOut)
  .put('/update/:id', upload.single('avatar'), SellerController.updateSeller);

module.exports = router;
