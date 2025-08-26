const { sequelize } = require('../db/models');

async function resetArtsSequence() {
  try {
    // Получаем максимальный id из таблицы Arts
    const [results] = await sequelize.query('SELECT MAX(id) as max_id FROM "Arts"');
    const maxId = results[0].max_id || 0;

    // Сбрасываем последовательность на следующее значение после максимального id
    await sequelize.query(`ALTER SEQUENCE "Arts_id_seq" RESTART WITH ${maxId + 1}`);
    
    console.log('Последовательность Arts успешно сброшена');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка при сбросе последовательности:', error);
    process.exit(1);
  }
}

resetArtsSequence(); 