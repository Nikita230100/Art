"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Получаем максимальный id из таблицы Arts
    const [results] = await queryInterface.sequelize.query(
      'SELECT MAX(id) as max_id FROM "Arts"'
    );
    const maxId = results[0].max_id || 0;

    // Сбрасываем последовательность на следующее значение после максимального id
    await queryInterface.sequelize.query(
      `ALTER SEQUENCE "Arts_id_seq" RESTART WITH ${maxId + 1}`
    );
  },

  async down(queryInterface, Sequelize) {
    // Нет необходимости в обратной миграции, так как это одноразовое исправление
  },
};
