import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Получаем текущую директорию для ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Загрузка переменных окружения из .env файла
dotenv.config();

// Проверка наличия API ключа Google Translate
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
if (!GOOGLE_API_KEY) {
  console.error('❌ Ошибка: GOOGLE_API_KEY не найден в .env файле');
  process.exit(1);
}

// Целевые языки для перевода
const targetLangs = [
  'en', 'ru', 'de', 'fr', 'tr', 'pl', 'it', 'es', 'pt', 'nl',
  'bg', 'ro', 'hu', 'el', 'cs', 'sk', 'sl', 'hr', 'sr', 'bs',
  'mk', 'sq', 'lv', 'lt', 'et'
];

// Путь к директории с переводами
const translationsDir = path.join(__dirname, 'translations');

// Функция для перевода текста через Google Translate API
async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    // Если текст пустой или не строка, возвращаем как есть
    if (!text || typeof text !== 'string') {
      return text;
    }
    
    const response = await axios.get('https://translation.googleapis.com/language/translate/v2', {
      params: {
        q: text,
        target: targetLang,
        source: 'kk', // Казахский как исходный язык
        key: GOOGLE_API_KEY
      }
    });
    
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`❌ Ошибка API перевода: ${error.message}`);
      if (error.response) {
        console.error(`Статус: ${error.response.status}`);
        console.error(`Данные: ${JSON.stringify(error.response.data)}`);
      }
    } else {
      console.error(`❌ Неизвестная ошибка: ${error}`);
    }
    return text; // Возвращаем исходный текст в случае ошибки
  }
}

// Рекурсивная функция для перевода всех строк в объекте
async function translateObject(obj: any, targetLang: string): Promise<any> {
  const result: any = {};
  
  for (const key in obj) {
    if (Array.isArray(obj[key])) {
      // Обработка массивов
      result[key] = [];
      for (const item of obj[key]) {
        if (typeof item === 'string') {
          result[key].push(await translateText(item, targetLang));
        } else if (typeof item === 'object' && item !== null) {
          result[key].push(await translateObject(item, targetLang));
        } else {
          result[key].push(item);
        }
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Рекурсивный перевод вложенных объектов
      result[key] = await translateObject(obj[key], targetLang);
    } else if (typeof obj[key] === 'string') {
      // Перевод строк
      result[key] = await translateText(obj[key], targetLang);
    } else {
      // Копирование других типов данных без изменений
      result[key] = obj[key];
    }
  }
  
  return result;
}

// Функция для сравнения объектов и определения изменений
function findChangedKeys(sourceObj: any, targetObj: any, path: string = ''): string[] {
  const changedKeys: string[] = [];
  
  for (const key in sourceObj) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (!(key in targetObj)) {
      // Если ключ отсутствует в целевом объекте
      changedKeys.push(currentPath);
    } else if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null && 
               typeof targetObj[key] === 'object' && targetObj[key] !== null && 
               !Array.isArray(sourceObj[key]) && !Array.isArray(targetObj[key])) {
      // Рекурсивное сравнение для вложенных объектов
      changedKeys.push(...findChangedKeys(sourceObj[key], targetObj[key], currentPath));
    } else if (typeof sourceObj[key] === 'string' && typeof targetObj[key] === 'string') {
      // Сравнение строк
      if (sourceObj[key] !== targetObj[key]) {
        changedKeys.push(currentPath);
      }
    } else if (JSON.stringify(sourceObj[key]) !== JSON.stringify(targetObj[key])) {
      // Сравнение других типов данных
      changedKeys.push(currentPath);
    }
  }
  
  return changedKeys;
}

// Функция для получения значения по пути в объекте
function getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  
  return current;
}

// Функция для установки значения по пути в объекте
function setValueByPath(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!(part in current)) {
      current[part] = {};
    }
    current = current[part];
  }
  
  current[parts[parts.length - 1]] = value;
}

// Функция для обновления недостающих и измененных строк в существующем переводе
async function updateTranslations(
  sourceObj: any, 
  targetObj: any, 
  targetLang: string,
  baseObj: any = null // Базовый объект для сравнения (предыдущая версия sourceObj)
): Promise<any> {
  const result = JSON.parse(JSON.stringify(targetObj)); // Глубокое копирование
  
  // Находим измененные ключи, если есть базовый объект для сравнения
  let changedKeys: string[] = [];
  if (baseObj) {
    changedKeys = findChangedKeys(sourceObj, baseObj);
    console.log(`  🔍 Найдено ${changedKeys.length} измененных ключей`);
  }
  
  // Обновляем измененные ключи
  for (const path of changedKeys) {
    const sourceValue = getValueByPath(sourceObj, path);
    if (typeof sourceValue === 'string') {
      const translatedValue = await translateText(sourceValue, targetLang);
      setValueByPath(result, path, translatedValue);
      console.log(`  🔄 Обновлен ключ: ${path}`);
    }
  }
  
  // Обновляем недостающие ключи и структуры
  for (const key in sourceObj) {
    if (!(key in result)) {
      // Если ключ отсутствует в целевом объекте
      if (Array.isArray(sourceObj[key])) {
        // Для массивов
        result[key] = [];
        for (const item of sourceObj[key]) {
          if (typeof item === 'string') {
            result[key].push(await translateText(item, targetLang));
          } else if (typeof item === 'object' && item !== null) {
            result[key].push(await translateObject(item, targetLang));
          } else {
            result[key].push(item);
          }
        }
      } else if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null) {
        // Для объектов
        result[key] = await translateObject(sourceObj[key], targetLang);
      } else if (typeof sourceObj[key] === 'string') {
        // Для строк
        result[key] = await translateText(sourceObj[key], targetLang);
      } else {
        // Для других типов данных
        result[key] = sourceObj[key];
      }
      console.log(`  ✅ Добавлен новый ключ: ${key}`);
    } else if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null && 
               typeof result[key] === 'object' && result[key] !== null && 
               !Array.isArray(sourceObj[key]) && !Array.isArray(result[key])) {
      // Рекурсивное обновление для вложенных объектов
      const baseObjKey = baseObj && typeof baseObj === 'object' ? baseObj[key] : null;
      result[key] = await updateTranslations(sourceObj[key], result[key], targetLang, baseObjKey);
    }
  }
  
  return result;
}

// Функция для сохранения предыдущей версии файла
function backupFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    const backupPath = `${filePath}.bak`;
    fs.copyFileSync(filePath, backupPath);
    console.log(`  📦 Создана резервная копия: ${backupPath}`);
  }
}

// Основная функция для запуска процесса перевода
async function main() {
  console.log('🌐 Запуск процесса перевода...');
  
  try {
    // Проверка наличия директории переводов
    if (!fs.existsSync(translationsDir)) {
      fs.mkdirSync(translationsDir, { recursive: true });
      console.log(`📁 Создана директория: ${translationsDir}`);
    }
    
    // Загрузка исходного файла с казахским переводом
    const sourceFilePath = path.join(translationsDir, 'kk.json');
    if (!fs.existsSync(sourceFilePath)) {
      console.error(`❌ Ошибка: Исходный файл ${sourceFilePath} не найден`);
      process.exit(1);
    }
    
    // Загружаем текущую версию исходного файла
    const sourceData = JSON.parse(fs.readFileSync(sourceFilePath, 'utf8'));
    console.log('📄 Загружен исходный файл kk.json');
    
    // Загружаем предыдущую версию исходного файла, если она существует
    const backupPath = `${sourceFilePath}.bak`;
    let previousSourceData = null;
    if (fs.existsSync(backupPath)) {
      try {
        previousSourceData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
        console.log('📄 Загружена предыдущая версия kk.json');
      } catch (error) {
        console.warn(`⚠️ Не удалось загрузить предыдущую версию: ${error}`);
      }
    }
    
    // Создаем резервную копию текущего исходного файла
    backupFile(sourceFilePath);
    
    // Перевод на все целевые языки
    for (const lang of targetLangs) {
      // Пропускаем казахский язык, так как это исходный язык
      if (lang === 'kk') continue;
      
      const targetFilePath = path.join(translationsDir, `${lang}.json`);
      
      console.log(`\n🔄 Обработка языка: ${lang}`);
      
      let translatedData: any;
      
      // Проверка существования файла перевода
      if (fs.existsSync(targetFilePath)) {
        console.log(`  📄 Найден существующий файл ${lang}.json`);
        
        // Создаем резервную копию текущего файла перевода
        backupFile(targetFilePath);
        
        const existingData = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));
        
        // Обновление недостающих и измененных строк
        console.log(`  🔄 Обновление переводов...`);
        translatedData = await updateTranslations(sourceData, existingData, lang, previousSourceData);
        console.log(`  ✅ Обновление завершено`);
      } else {
        console.log(`  🆕 Создание нового файла ${lang}.json`);
        
        // Полный перевод для нового файла
        console.log(`  🔄 Перевод всех строк...`);
        translatedData = await translateObject(sourceData, lang);
        console.log(`  ✅ Перевод завершен`);
      }
      
      // Сохранение результата
      fs.writeFileSync(targetFilePath, JSON.stringify(translatedData, null, 2), 'utf8');
      console.log(`  💾 Сохранен файл: ${lang}.json`);
    }
    
    console.log('\n✅ Процесс перевода успешно завершен!');
  } catch (error) {
    console.error(`❌ Ошибка: ${error}`);
    process.exit(1);
  }
}

// Запуск основной функции
main().catch(error => {
  console.error(`❌ Необработанная ошибка: ${error}`);
  process.exit(1);
});
