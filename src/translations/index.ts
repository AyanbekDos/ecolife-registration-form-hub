// Импортируем напрямую JSON файлы с переводами
import kkTranslations from './kk.json';
import enTranslations from './en.json';
import ruTranslations from './ru.json';
import { Translations } from './types';

// Для обратной совместимости со старым кодом
export const translations: Record<string, Translations> = {
  kk: kkTranslations as Translations,
  en: enTranslations as Translations,
  ru: ruTranslations as Translations
};

// Функция для получения перевода
export function getTranslation(lang: string = 'kk'): Translations {
  return translations[lang] || translations.kk;
}

// Экспорт по умолчанию для совместимости
export default translations;
