import fs from 'fs';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import { Translations } from './translations/types';

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

// Функция для обновления недостающих строк в существующем переводе
async function updateMissingTranslations(
  sourceObj: any, 
  targetObj: any, 
  targetLang: string, 
  path: string = ''
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
      result[key] = await updateMissingTranslations(sourceObj[key], result[key], targetLang, currentPath);
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
    
    // Перевод на все целевые языки
    for (const lang of targetLangs) {
      const targetFilePath = path.join(translationsDir, `${lang}.json`);
      
      console.log(`\n🔄 Обработка языка: ${lang}`);
      
      let translatedData: any;
      
      // Проверка существования файла перевода
      if (fs.existsSync(targetFilePath)) {
        console.log(`  📄 Найден существующий файл ${lang}.json`);
        const existingData = JSON.parse(fs.readFileSync(targetFilePath, 'utf8'));
        
        // Обновление только недостающих строк
        console.log(`  🔄 Обновление недостающих строк...`);
        translatedData = await updateMissingTranslations(sourceData, existingData, lang);
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
main();
