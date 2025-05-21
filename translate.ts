import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Translations } from './src/translations/types';

// Получение __dirname для ES модулей
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
const translationsDir = path.join(__dirname, 'src', 'translations');

// Путь к файлу с хешами строк
const hashesFilePath = path.join(translationsDir, '.translation-hashes.json');

// Функция для перевода текста через Google Translate API
async function translateText(text: string, targetLang: string): Promise<string> {
  try {
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
        } else if (typeof item === 'object') {
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

// Функция для создания хеша строки
function createHash(str: string): string {
  return crypto.createHash('md5').update(str).digest('hex');
}

// Функция для создания хешей всех строк в объекте
function createObjectHashes(obj: any, path: string = ''): Record<string, string> {
  const hashes: Record<string, string> = {};
  
  for (const key in obj) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (Array.isArray(obj[key])) {
      // Для массивов
      obj[key].forEach((item: any, index: number) => {
        if (typeof item === 'string') {
          hashes[`${currentPath}[${index}]`] = createHash(item);
        } else if (typeof item === 'object' && item !== null) {
          const nestedHashes = createObjectHashes(item, `${currentPath}[${index}]`);
          Object.assign(hashes, nestedHashes);
        }
      });
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Для вложенных объектов
      const nestedHashes = createObjectHashes(obj[key], currentPath);
      Object.assign(hashes, nestedHashes);
    } else if (typeof obj[key] === 'string') {
      // Для строк
      hashes[currentPath] = createHash(obj[key]);
    }
  }
  
  return hashes;
}

// Функция для получения значения по пути в объекте
function getValueByPath(obj: any, path: string): any {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    
    // Обработка индексов массива
    if (part.includes('[') && part.includes(']')) {
      const arrayName = part.substring(0, part.indexOf('['));
      const indexStr = part.substring(part.indexOf('[') + 1, part.indexOf(']'));
      const index = parseInt(indexStr, 10);
      
      if (!current[arrayName] || !Array.isArray(current[arrayName])) {
        return undefined;
      }
      
      current = current[arrayName][index];
    } else {
      if (current[part] === undefined) {
        return undefined;
      }
      current = current[part];
    }
  }
  
  return current;
}

// Функция для установки значения по пути в объекте
function setValueByPath(obj: any, path: string, value: any): void {
  const parts = path.split('.');
  let current = obj;
  
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    
    // Обработка индексов массива
    if (part.includes('[') && part.includes(']')) {
      const arrayName = part.substring(0, part.indexOf('['));
      const indexStr = part.substring(part.indexOf('[') + 1, part.indexOf(']'));
      const index = parseInt(indexStr, 10);
      
      if (!current[arrayName]) {
        current[arrayName] = [];
      }
      
      if (!current[arrayName][index]) {
        current[arrayName][index] = {};
      }
      
      current = current[arrayName][index];
    } else {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    }
  }
  
  const lastPart = parts[parts.length - 1];
  
  // Обработка индексов массива для последней части
  if (lastPart.includes('[') && lastPart.includes(']')) {
    const arrayName = lastPart.substring(0, lastPart.indexOf('['));
    const indexStr = lastPart.substring(lastPart.indexOf('[') + 1, lastPart.indexOf(']'));
    const index = parseInt(indexStr, 10);
    
    if (!current[arrayName]) {
      current[arrayName] = [];
    }
    
    current[arrayName][index] = value;
  } else {
    current[lastPart] = value;
  }
}

// Функция для обновления недостающих строк в существующем переводе
async function updateMissingTranslations(
  sourceObj: any, 
  targetObj: any, 
  targetLang: string, 
  path: string = '',
  changedPaths: string[] = []
): Promise<any> {
  const result: any = { ...targetObj };
  
  for (const key in sourceObj) {
    const currentPath = path ? `${path}.${key}` : key;
    
    if (!(key in result)) {
      // Если ключ отсутствует в целевом объекте
      if (Array.isArray(sourceObj[key])) {
        // Для массивов
        result[key] = [];
        for (const item of sourceObj[key]) {
          if (typeof item === 'string') {
            result[key].push(await translateText(item, targetLang));
          } else if (typeof item === 'object') {
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
      console.log(`  ✅ Добавлен новый ключ: ${currentPath}`);
    } else if (typeof sourceObj[key] === 'object' && sourceObj[key] !== null && !Array.isArray(sourceObj[key])) {
      // Рекурсивное обновление для вложенных объектов
      result[key] = await updateMissingTranslations(sourceObj[key], result[key], targetLang, currentPath, changedPaths);
    } else if (typeof sourceObj[key] === 'string' && changedPaths.includes(currentPath)) {
      // Обновление изменённой строки
      console.log(`  🔄 Обновление изменённого ключа: ${currentPath}`);
      result[key] = await translateText(sourceObj[key], targetLang);
    }
  }
  
  return result;
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
    
    const sourceData = JSON.parse(fs.readFileSync(sourceFilePath, 'utf8')) as Translations;
    console.log('📄 Загружен исходный файл kk.json');
    
    // Создание хешей для текущего состояния исходного файла
    const currentHashes = createObjectHashes(sourceData);
    
    // Загрузка предыдущих хешей, если они существуют
    let previousHashes: Record<string, string> = {};
    if (fs.existsSync(hashesFilePath)) {
      try {
        previousHashes = JSON.parse(fs.readFileSync(hashesFilePath, 'utf8'));
        console.log('📄 Загружены предыдущие хеши строк');
      } catch (e) {
        console.warn('⚠️ Не удалось загрузить предыдущие хеши, будет выполнен полный перевод');
      }
    }
    
    // Определение изменённых путей
    const changedPaths: string[] = [];
    for (const path in currentHashes) {
      if (!previousHashes[path] || previousHashes[path] !== currentHashes[path]) {
        changedPaths.push(path);
      }
    }
    
    // Добавление новых путей
    for (const path in currentHashes) {
      if (!previousHashes[path]) {
        if (!changedPaths.includes(path)) {
          changedPaths.push(path);
        }
      }
    }
    
    if (changedPaths.length > 0) {
      console.log(`🔍 Обнаружено ${changedPaths.length} изменённых строк`);
    } else {
      console.log('✅ Изменений не обнаружено, переводы актуальны');
    }
    
    // Перевод на все целевые языки
    for (const lang of targetLangs) {
      // Всегда обрабатываем все языки, независимо от наличия изменений
      // if (changedPaths.length === 0 && lang !== 'en') {
      //   // Пропускаем языки, если нет изменений (кроме английского, который всегда обновляем)
      //   continue;
      // }
      
      const targetFilePath = path.join(translationsDir, `${lang}.json`);
      
      console.log(`\n🔄 Обработка языка: ${lang}`);
      
      let translatedData: any;
      
      // Проверка существования файла перевода
      if (fs.existsSync(targetFilePath)) {
        console.log(`  📄 Найден существующий файл ${lang}.json`);
        const existingData = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));
        
        if (changedPaths.length > 0) {
          // Обновление только изменённых строк
          console.log(`  🔄 Обновление изменённых строк (${changedPaths.length})...`);
          translatedData = await updateMissingTranslations(sourceData, existingData, lang, '', changedPaths);
          console.log(`  ✅ Обновление завершено`);
        } else {
          console.log(`  ✅ Файл актуален, обновление не требуется`);
          translatedData = existingData;
        }
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
    
    // Сохранение текущих хешей для следующего запуска
    fs.writeFileSync(hashesFilePath, JSON.stringify(currentHashes, null, 2), 'utf8');
    console.log('💾 Сохранены хеши строк для следующего запуска');
    
    console.log('\n✅ Процесс перевода успешно завершен!');
  } catch (error) {
    console.error(`❌ Ошибка: ${error}`);
    process.exit(1);
  }
}

// Запуск основной функции
main();
