// Скрипт для исправления JSON-файлов переводов
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

// Сначала загружаем эталонный файл kk.json
const sourceFilePath = path.join(translationsDir, 'kk.json');
let sourceData;

try {
  const sourceContent = fs.readFileSync(sourceFilePath, 'utf8');
  sourceData = JSON.parse(sourceContent);
  console.log('✅ Эталонный файл kk.json успешно загружен');
} catch (error) {
  console.error(`❌ Ошибка при загрузке эталонного файла kk.json: ${error.message}`);
  process.exit(1);
}

// Обрабатываем каждый файл
files.forEach(file => {
  if (file === 'kk.json') return; // Пропускаем эталонный файл
  
  const filePath = path.join(translationsDir, file);
  
  try {
    // Читаем содержимое файла
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Пытаемся распарсить JSON
    let fileData;
    let isValid = true;
    
    try {
      fileData = JSON.parse(content);
    } catch (parseError) {
      console.log(`❌ ${file}: JSON невалиден: ${parseError.message}`);
      isValid = false;
    }
    
    // Если файл невалиден или структура не соответствует эталону
    if (!isValid || !validateStructure(fileData, sourceData)) {
      console.log(`🔄 ${file}: Исправляем структуру файла...`);
      
      // Создаем бэкап файла
      const backupPath = path.join(translationsDir, `${file}.bak`);
      fs.writeFileSync(backupPath, content, 'utf8');
      console.log(`📦 ${file}: Создана резервная копия`);
      
      // Если файл невалиден, пробуем восстановить данные
      if (!isValid) {
        try {
          // Пробуем исправить проблемы с кавычками
          content = content
            .replace(/""([^"]*)""/, '"\\\"$1\\\""')
            .replace(/"Platform under construction"/g, '"Platform under construction"')
            .replace(/"Платформа в разработке"/g, '"Платформа в разработке"')
            .replace(/"Platforma tiek būvēta"/g, '"Platforma tiek būvēta"')
            .replace(/"Piattaforma in costruzione"/g, '"Piattaforma in costruzione"')
            .replace(/"Plattform im Aufbau"/g, '"Plattform im Aufbau"')
            .replace(/\\"/g, '"') // Убираем экранирование
            .replace(/",\s*\\"/g, '", "') // Исправляем неправильные переходы между ключами
            .replace(/"\s*}/g, '" }') // Исправляем закрывающие скобки
            .replace(/"\s*{/g, '" {') // Исправляем открывающие скобки
            .replace(/"\s*,/g, '",') // Исправляем запятые
            .replace(/"\s*:/g, '":') // Исправляем двоеточия
            .replace(/:\s*"/g, ':"'); // Исправляем двоеточия с другой стороны
          
          try {
            fileData = JSON.parse(content);
            console.log(`✅ ${file}: JSON успешно восстановлен`);
          } catch (error) {
            console.log(`❌ ${file}: Не удалось восстановить JSON, используем структуру из эталона`);
            fileData = {}; // Пустой объект для заполнения из эталона
          }
        } catch (error) {
          console.log(`❌ ${file}: Ошибка при исправлении JSON: ${error.message}`);
          fileData = {}; // Пустой объект для заполнения из эталона
        }
      }
      
      // Создаем новый объект с правильной структурой
      const newData = createStructureFromTemplate(fileData, sourceData);
      
      // Записываем исправленный файл
      fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
      console.log(`✅ ${file}: Файл успешно исправлен и сохранен`);
      
      totalFilesFixed++;
    } else {
      console.log(`✅ ${file}: Структура соответствует эталону`);
    }
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${file}: ${error.message}`);
    totalErrors++;
  }
});

console.log(`\n📊 Итоги:`);
console.log(`📝 Обработано файлов: ${files.length - 1}`); // -1 для kk.json
console.log(`🔧 Исправлено файлов: ${totalFilesFixed}`);
console.log(`❌ Ошибок: ${totalErrors}`);

// Функция для проверки соответствия структуры
function validateStructure(obj, template, path = '') {
  if (!obj) return false;
  
  // Проверяем все ключи в шаблоне
  for (const key in template) {
    const currentPath = path ? `${path}.${key}` : key;
    
    // Если ключ отсутствует в проверяемом объекте
    if (!(key in obj)) {
      console.log(`⚠️ Отсутствует ключ: ${currentPath}`);
      return false;
    }
    
    // Если типы не совпадают
    if (typeof template[key] !== typeof obj[key]) {
      console.log(`⚠️ Несоответствие типов для ключа ${currentPath}: ожидается ${typeof template[key]}, получено ${typeof obj[key]}`);
      return false;
    }
    
    // Рекурсивная проверка для объектов
    if (typeof template[key] === 'object' && template[key] !== null && 
        typeof obj[key] === 'object' && obj[key] !== null) {
      // Для массивов проверяем только первый элемент (если есть)
      if (Array.isArray(template[key])) {
        if (!Array.isArray(obj[key])) {
          console.log(`⚠️ Ожидается массив для ключа ${currentPath}`);
          return false;
        }
        
        // Если массив шаблона не пустой, проверяем структуру первого элемента
        if (template[key].length > 0 && obj[key].length > 0) {
          if (typeof template[key][0] === 'object' && template[key][0] !== null) {
            for (let i = 0; i < obj[key].length; i++) {
              if (!validateStructure(obj[key][i], template[key][0], `${currentPath}[${i}]`)) {
                return false;
              }
            }
          }
        }
      } else {
        // Для обычных объектов рекурсивно проверяем все ключи
        if (!validateStructure(obj[key], template[key], currentPath)) {
          return false;
        }
      }
    }
  }
  
  return true;
}

// Функция для создания объекта с правильной структурой
function createStructureFromTemplate(obj, template) {
  const result = {};
  
  // Копируем все ключи из шаблона
  for (const key in template) {
    // Если ключ есть в исходном объекте и типы совпадают
    if (key in obj && typeof template[key] === typeof obj[key]) {
      if (typeof template[key] === 'object' && template[key] !== null) {
        // Для массивов
        if (Array.isArray(template[key])) {
          if (Array.isArray(obj[key])) {
            // Если массив шаблона не пустой, создаем структуру для каждого элемента
            if (template[key].length > 0 && typeof template[key][0] === 'object' && template[key][0] !== null) {
              result[key] = obj[key].map(item => 
                typeof item === 'object' && item !== null 
                  ? createStructureFromTemplate(item, template[key][0])
                  : item
              );
            } else {
              result[key] = [...obj[key]];
            }
          } else {
            result[key] = [...template[key]];
          }
        } else {
          // Для обычных объектов
          result[key] = createStructureFromTemplate(obj[key], template[key]);
        }
      } else {
        // Для примитивных типов
        result[key] = obj[key];
      }
    } else {
      // Если ключа нет или типы не совпадают, копируем из шаблона
      if (typeof template[key] === 'object' && template[key] !== null) {
        if (Array.isArray(template[key])) {
          result[key] = [...template[key]];
        } else {
          result[key] = createStructureFromTemplate({}, template[key]);
        }
      } else {
        result[key] = template[key];
      }
    }
  }
  
  return result;
}
