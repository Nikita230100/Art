const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});
const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/formatResponse');

function verifyRefreshTokenBuyer(req, res, next) {
  try {
    const { refreshTokenBuyer } = req.cookies;

    const { buyer } = jwt.verify(refreshTokenBuyer, process.env.SECRET_REFRESH_TOKEN);
    
    res.locals.buyer = buyer;
    console.log(res.locals.buyer, '<<<<<<<<<<<<<<<33333333>>>>>>>>>>>>>>>>>');
    next();
  } catch ({ message }) {
    console.log('=========verifyRefreshToken=========', message);
    res
      .status(401)
      .clearCookie('refreshTokenBuyer')
      .json(
        formatResponse(
          401,
          'Invalid refresh token',
          null,
          'Invalid refresh token'
        )
      );
  }
}

module.exports = verifyRefreshTokenBuyer;
