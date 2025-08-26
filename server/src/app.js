const path = require("path"); //* Импорт библиотеки path
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") }); //* Подключение переменных окружения
const express = require("express"); //* Импорт библиотеки express
const serverConfig = require("./config/serverConfig");
const indexRouter = require("./routes/index.routes");

const app = express(); //* Заводим экземпляр приложения

serverConfig(app); //* Прогоняем экземпляр приложения через функцию обучения

const PORT = process.env.PORT || 3000; //* указываем порт, который будет слушать сервер

app.use("/api", indexRouter); //* подключаем весь пакет маршрутов на /api
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
//* Старт сервера - прослушивание определенного порта
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
