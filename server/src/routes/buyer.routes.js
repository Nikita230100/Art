const router = require('express').Router();
const BuyerController = require('../controllers/Buyer.controller');
const verifyRefreshTokenBuyer = require('../middleware/verifyRefreshTokenBuyer');
const verifyAccessTokenBuyer = require('../middleware/verifyAccessTokenBuyer');
const upload = require('../middleware/upload');

router
  .get('/refreshTokensBuyer', verifyRefreshTokenBuyer, BuyerController.refreshTokensBuyer)
  .post('/signupbuyer', BuyerController.signUpBuyer)
  .post('/signinbuyer', BuyerController.signInBuyer)
  .delete('/signoutbuyer', BuyerController.signOutBuyer)
  .put('/update', verifyAccessTokenBuyer, upload.single('avatar'), BuyerController.updateBuyer);

module.exports = router;
