"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize, DataTypes } = require("sequelize");
const process = require("process");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/database.json")[env];
const db = {};

// Загрузка .env файла
const envPath = path.resolve(__dirname, "..", "..", "..", ".env");
console.log("Looking for .env file at:", envPath);
require("dotenv").config({
  path: envPath,
});

console.log("Environment variables:", {
  NODE_ENV: process.env.NODE_ENV,
  DB: process.env.DB ? "DB is set" : "DB is not set",
  config: config,
});

let sequelize;
if (config.use_env_variable) {
  // ДЛЯ ЛОКАЛЬНОЙ БД БЕЗ SSL
  sequelize = new Sequelize(process.env[config.use_env_variable], {
    dialect: 'postgres',
    logging: console.log, // Можно заменить на false для отключения логов
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // УБИРАЕМ SSL и таймауты для локальной БД
  });
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: console.log, // или false
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

// Проверка подключения
sequelize.authenticate()
  .then(() => {
    console.log('✅ PostgreSQL connected successfully');
  })
  .catch(err => {
    console.error('❌ Unable to connect to PostgreSQL:', err);
  });

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.slice(-3) === ".js" &&
      file.indexOf(".test.js") === -1
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;