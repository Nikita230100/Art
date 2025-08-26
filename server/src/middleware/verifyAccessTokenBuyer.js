const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});
const jwt = require('jsonwebtoken');
const formatResponse = require('../utils/formatResponse');

function verifyAccessTokenBuyer(req, res, next) {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json(formatResponse(401, 'No authorization header', null));
    }

    const accessTokenBuyer = req.headers.authorization.split(' ')[1];
    console.log('🚀 ~ verifyAccessTokenBuyer ~ token:', accessTokenBuyer);

    if (!accessTokenBuyer) {
      return res.status(401).json(formatResponse(401, 'No access token provided', null));
    }

    const { buyer } = jwt.verify(accessTokenBuyer, process.env.SECRET_ACCESS_TOKEN);

    if (!buyer || !buyer.id) {
      return res.status(401).json(formatResponse(401, 'Invalid token payload', null));
    }

    res.locals.buyer = buyer;

    next();
  } catch (error) {
    console.error('Error in verifyAccessTokenBuyer:', error.message);
    res.status(403).json(formatResponse(403, 'Invalid access token', null, error.message));
  }
}

module.exports = verifyAccessTokenBuyer;
