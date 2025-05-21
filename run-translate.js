// Скрипт для запуска переводчика
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Запуск переводчика...');

// Запускаем node с нужными параметрами
const translateProcess = spawn('node', [
  '--loader', 
  'ts-node/esm', 
  path.join(__dirname, 'translate.ts')
], {
  stdio: 'inherit' // Перенаправляем ввод/вывод в текущую консоль
});

// Обработка завершения процесса
translateProcess.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Процесс завершился с кодом: ${code}`);
  }
});
