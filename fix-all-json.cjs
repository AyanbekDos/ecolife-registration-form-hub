// Скрипт для полного исправления всех JSON-файлов переводов
const fs = require('fs');
const path = require('path');

// Путь к директории с переводами
const translationsDir = path.join(__dirname, 'src', 'translations');

// Получаем список всех JSON-файлов в директории
const files = fs.readdirSync(translationsDir)
  .filter(file => file.endsWith('.json') && file !== '.translation-hashes.json');

console.log(`🔍 Найдено ${files.length} файлов переводов`);

// Счетчики для статистики
let totalFilesFixed = 0;
let totalErrors = 0;

// Обрабатываем каждый файл
files.forEach(file => {
  const filePath = path.join(translationsDir, file);
  
  try {
    // Читаем содержимое файла
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Пытаемся распарсить JSON
    try {
      JSON.parse(content);
      console.log(`✅ ${file}: JSON валиден, пропускаем`);
    } catch (parseError) {
      console.log(`❌ ${file}: JSON невалиден: ${parseError.message}`);
      
      // Исправляем проблемы с кавычками в platformStatus
      if (content.includes('"Platform under construction"') || 
          content.includes('"Платформа в разработке"') ||
          content.includes('"Platforma tiek būvēta"') ||
          content.includes('"Piattaforma in costruzione"')) {
        
        content = content
          .replace(/"Platform under construction"/g, '"\\\"Platform under construction\\\""')
          .replace(/"Платформа в разработке"/g, '"\\\"Платформа в разработке\\\""')
          .replace(/"Platforma tiek būvēta"/g, '"\\\"Platforma tiek būvēta\\\""')
          .replace(/"Piattaforma in costruzione"/g, '"\\\"Piattaforma in costruzione\\\""')
          .replace(/"Plattform im Aufbau"/g, '"\\\"Plattform im Aufbau\\\""');
        
        console.log(`🔧 ${file}: Исправлены кавычки в platformStatus`);
      }
      
      // Если файл сильно поврежден (как lv.json), полностью пересоздаем его
      if (file === 'lv.json' || content.includes('\\\"')) {
        console.log(`🔄 ${file}: Файл сильно поврежден, пересоздаем структуру`);
        
        // Читаем исходный файл (kk.json) для получения правильной структуры
        const sourceFilePath = path.join(translationsDir, 'kk.json');
        if (fs.existsSync(sourceFilePath)) {
          try {
            const sourceContent = fs.readFileSync(sourceFilePath, 'utf8');
            const sourceData = JSON.parse(sourceContent);
            
            // Пытаемся извлечь данные из поврежденного файла
            // Создаем временный файл с исправленными кавычками
            const tempContent = content
              .replace(/\\"/g, '"') // Убираем экранирование
              .replace(/",\s*\\"/g, '", "') // Исправляем неправильные переходы между ключами
              .replace(/"\s*}/g, '" }') // Исправляем закрывающие скобки
              .replace(/"\s*{/g, '" {') // Исправляем открывающие скобки
              .replace(/"\s*,/g, '",') // Исправляем запятые
              .replace(/"\s*:/g, '":') // Исправляем двоеточия
              .replace(/:\s*"/g, ':"') // Исправляем двоеточия с другой стороны
              .replace(/\\\\"/g, '\\"'); // Исправляем двойное экранирование
            
            // Записываем временный файл
            const tempFilePath = path.join(translationsDir, `${file}.temp`);
            fs.writeFileSync(tempFilePath, tempContent, 'utf8');
            
            // Пытаемся прочитать данные из временного файла
            try {
              // Пробуем прочитать данные напрямую, если не получится - используем регулярные выражения
              const data = {};
              
              // Извлекаем все строки вида "ключ": "значение"
              const regex = /"([^"]+)":\s*"([^"]*)"/g;
              let match;
              
              while ((match = regex.exec(tempContent)) !== null) {
                const key = match[1];
                const value = match[2];
                
                // Строим вложенную структуру по точкам в ключе
                const keyParts = key.split('.');
                let current = data;
                
                for (let i = 0; i < keyParts.length - 1; i++) {
                  if (!current[keyParts[i]]) {
                    current[keyParts[i]] = {};
                  }
                  current = current[keyParts[i]];
                }
                
                current[keyParts[keyParts.length - 1]] = value;
              }
              
              // Если данные пустые, используем структуру из исходного файла
              if (Object.keys(data).length === 0) {
                console.log(`⚠️ ${file}: Не удалось извлечь данные, используем структуру из kk.json`);
                fs.copyFileSync(sourceFilePath, filePath);
              } else {
                // Записываем исправленный файл
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
              }
              
              // Удаляем временный файл
              fs.unlinkSync(tempFilePath);
            } catch (tempError) {
              console.error(`❌ ${file}: Ошибка при чтении временного файла: ${tempError.message}`);
              // Копируем исходный файл как запасной вариант
              fs.copyFileSync(sourceFilePath, filePath);
            }
          } catch (sourceError) {
            console.error(`❌ Ошибка при чтении исходного файла: ${sourceError.message}`);
            totalErrors++;
          }
        } else {
          console.error(`❌ Исходный файл kk.json не найден`);
          totalErrors++;
        }
      } else {
        // Для менее поврежденных файлов пробуем более простое исправление
        // Исправляем проблему с двойными кавычками в строках
        content = content.replace(/""([^"]*)""/, '"\\\"$1\\\""');
        
        // Записываем исправленное содержимое
        fs.writeFileSync(filePath, content, 'utf8');
      }
      
      // Проверяем, исправлен ли файл
      try {
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✅ ${file}: JSON теперь валиден`);
        totalFilesFixed++;
      } catch (finalError) {
        console.error(`❌ ${file}: JSON все еще невалиден после всех исправлений: ${finalError.message}`);
        totalErrors++;
      }
    }
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${file}: ${error.message}`);
    totalErrors++;
  }
});

console.log(`\n📊 Итоги:`);
console.log(`📝 Обработано файлов: ${files.length}`);
console.log(`🔧 Исправлено файлов: ${totalFilesFixed}`);
console.log(`❌ Ошибок: ${totalErrors}`);
