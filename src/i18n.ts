import { Translations } from './translations/types';

// Функция для определения языка пользователя
// Список поддерживаемых языков формируется динамически при первом импорте модуля
let supportedLangs: string[] = [];

// Экспортируем функцию для использования в других модулях
export function getSupportedLanguages(): string[] {
  if (supportedLangs.length > 0) return supportedLangs;
  
  // Жестко задаем список поддерживаемых языков
  // В Vite нет прямого аналога require.context без дополнительных плагинов
  supportedLangs = [
    'kk', 'en', 'ru', 'de', 'fr', 'tr', 'pl', 'it', 'es', 'pt', 'nl',
    'bg', 'ro', 'hu', 'el', 'cs', 'sk', 'sl', 'hr', 'sr', 'bs',
    'mk', 'sq', 'lv', 'lt', 'et'
  ];
  
  return supportedLangs;
}

function detectUserLanguage(): string {
  const langs = getSupportedLanguages();

  if (typeof navigator === 'undefined') {
    return 'kk';
  }

  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && langs.includes(urlLang)) {
    return urlLang;
  }

  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const langCode = lang.split('-')[0].toLowerCase();
    if (langs.includes(langCode)) {
      return langCode;
    }
  }

  return 'kk';
}

// Кэш для загруженных переводов
const translationsCache: Record<string, Translations> = {};

// Асинхронная функция для загрузки перевода
export async function loadTranslation(lang: string = detectUserLanguage()): Promise<Translations> {
  const langs = getSupportedLanguages();
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }
  try {
    const translation = await import(`./translations/${lang}.json`);
    translationsCache[lang] = translation as Translations;
    return translation as Translations;
  } catch (error) {
    console.error(`Ошибка загрузки перевода для языка ${lang}:`, error);
    // Fallback: сначала en, если нет en — kk
    if (lang !== 'en' && langs.includes('en')) {
      console.warn('Пробуем fallback на EN...');
      return loadTranslation('en');
    }
    if (lang !== 'kk' && langs.includes('kk')) {
      console.warn('Пробуем fallback на KK...');
      return loadTranslation('kk');
    }
    throw new Error(`Не удалось загрузить перевод для языка ${lang}`);
  }
}

// Текущий язык
let currentLang = detectUserLanguage();

// Функция для изменения языка
export function changeLanguage(lang: string): Promise<Translations> {
  currentLang = lang;
  return loadTranslation(lang);
}

// Функция для получения текущего языка
export function getCurrentLanguage(): string {
  return currentLang;
}

// Простой класс для работы с переводами
export class I18n {
  private static instance: I18n;
  private translations: Translations | null = null;
  
  private constructor() {}
  
  // Получение экземпляра класса (паттерн Singleton)
  public static getInstance(): I18n {
    if (!I18n.instance) {
      I18n.instance = new I18n();
    }
    return I18n.instance;
  }
  
  // Инициализация с загрузкой переводов
  public async init(lang: string = detectUserLanguage()): Promise<void> {
    this.translations = await loadTranslation(lang);
  }
  
  // Получение перевода по ключу
  public t(key: string): string {
    if (!this.translations) {
      console.warn('Переводы не инициализированы. Вызовите init() перед использованием t()');
      return key;
    }
    
    // Разбиваем ключ на части (например, 'navbar.home' -> ['navbar', 'home'])
    const parts = key.split('.');
    let result: any = this.translations;
    
    // Проходим по частям ключа
    for (const part of parts) {
      if (result && typeof result === 'object' && part in result) {
        result = result[part];
      } else {
        console.warn(`Ключ перевода не найден: ${key}`);
        return key;
      }
    }
    
    return typeof result === 'string' ? result : key;
  }
  
  // Изменение языка
  public async setLanguage(lang: string): Promise<void> {
    this.translations = await loadTranslation(lang);
  }
  
  // Получение текущего языка
  public getLanguage(): string {
    return currentLang;
  }
  
  // Получение всех переводов
  public getTranslations(): Translations | null {
    return this.translations;
  }
}

// Экспорт экземпляра для удобства использования
export const i18n = I18n.getInstance();

// Инициализация i18n при импорте модуля
i18n.init().catch(error => {
  console.error('Ошибка инициализации i18n:', error);
});

export default i18n;
