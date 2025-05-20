import axios from 'axios';
import config from '@/config';

// Список поддерживаемых языков
const supportedLanguages = [
  'en', 'ru', 'de', 'fr', 'tr', 'pl', 'it', 'es', 'pt', 'nl',
  'bg', 'ro', 'hu', 'el', 'cs', 'sk', 'sl', 'hr', 'sr', 'bs',
  'mk', 'sq', 'lv', 'lt', 'et'
];

// Функция для перевода текста через Google Translate API
export async function translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
  try {
    const response = await axios.get('https://translation.googleapis.com/language/translate/v2', {
      params: {
        q: text,
        target: targetLang,
        source: sourceLang,
        key: config.googleApiKey
      }
    });
    
    return response.data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Ошибка при переводе:', error);
    return text; // Возвращаем исходный текст в случае ошибки
  }
}

// Функция для получения значения по пути в объекте
export function getValueByPath(obj: any, path: string[]): any {
  let current = obj;
  for (const key of path) {
    if (current === undefined || current === null) return undefined;
    current = current[key];
  }
  return current;
}

// Функция для установки значения по пути в объекте
export function setValueByPath(obj: any, path: string[], value: any): void {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (current[key] === undefined || current[key] === null) {
      current[key] = {};
    }
    current = current[key];
  }
  current[path[path.length - 1]] = value;
}

// Функция для перевода и обновления всех языков
export async function translateAndUpdateAllLanguages(
  path: string[], 
  value: string, 
  currentLanguage: string,
  translationsData: Record<string, Record<string, any>>
): Promise<Record<string, Record<string, any>>> {
  // Создаем копию данных переводов
  const updatedTranslations = { ...translationsData };
  
  // Определяем материнский язык (kk или ru)
  const motherLanguage = currentLanguage === 'kk' || currentLanguage === 'ru' 
    ? currentLanguage 
    : 'kk'; // По умолчанию используем казахский
  
  // Получаем текст для перевода
  const textToTranslate = value;
  
  // Устанавливаем значение для текущего языка
  if (!updatedTranslations[currentLanguage]) {
    updatedTranslations[currentLanguage] = {};
  }
  setValueByPath(updatedTranslations[currentLanguage], path, textToTranslate);
  
  // Переводим на все поддерживаемые языки
  for (const lang of supportedLanguages) {
    // Пропускаем текущий язык, так как он уже обновлен
    if (lang === currentLanguage) continue;
    
    try {
      // Переводим текст
      const translatedText = await translateText(textToTranslate, motherLanguage, lang);
      
      // Создаем объект для языка, если он не существует
      if (!updatedTranslations[lang]) {
        updatedTranslations[lang] = {};
      }
      
      // Устанавливаем переведенное значение
      setValueByPath(updatedTranslations[lang], path, translatedText);
      
      console.log(`Перевод на ${lang} завершен: ${translatedText}`);
    } catch (error) {
      console.error(`Ошибка при переводе на ${lang}:`, error);
    }
  }
  
  return updatedTranslations;
}
