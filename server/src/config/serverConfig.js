const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '.env'),
});
const express = require('express');
const morgan = require('morgan');
const removeHTTPHeader = require('../middleware/removeHeader');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const corsOptions = {
  origin: [process.env.CLIENT_URL],
  credentials: true,
};

const serverConfig = (app) => {
  app.use(express.urlencoded({ extended: true }));

  app.use(express.json());

  app.use(morgan('dev'));

  app.use(cookieParser());

  app.use(cors(corsOptions));

  app.use(removeHTTPHeader);

  app.use('/static/images', express.static(path.resolve(__dirname, '..', 'public', 'images')));
};

module.exports = serverConfig;
