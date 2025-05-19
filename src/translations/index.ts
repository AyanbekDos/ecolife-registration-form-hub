import { Translations } from './types';
import { getSupportedLanguages } from '../i18n';

// Импортируем все переводы статически
// В Vite нет возможности динамически импортировать файлы без дополнительных плагинов
import kkTranslations from './kk.json';
import enTranslations from './en.json';
import ruTranslations from './ru.json';
import deTranslations from './de.json';
import frTranslations from './fr.json';
import trTranslations from './tr.json';
import plTranslations from './pl.json';
import itTranslations from './it.json';
import esTranslations from './es.json';
import ptTranslations from './pt.json';
import nlTranslations from './nl.json';
import bgTranslations from './bg.json';
import roTranslations from './ro.json';
import huTranslations from './hu.json';
import elTranslations from './el.json';
import csTranslations from './cs.json';
import skTranslations from './sk.json';
import slTranslations from './sl.json';
import hrTranslations from './hr.json';
import srTranslations from './sr.json';
import bsTranslations from './bs.json';
import mkTranslations from './mk.json';
import sqTranslations from './sq.json';
import lvTranslations from './lv.json';
import ltTranslations from './lt.json';
import etTranslations from './et.json';

// Создаем объект со всеми переводами
export const translations: Record<string, Translations> = {
  kk: kkTranslations as Translations,
  en: enTranslations as Translations,
  ru: ruTranslations as Translations,
  de: deTranslations as Translations,
  fr: frTranslations as Translations,
  tr: trTranslations as Translations,
  pl: plTranslations as Translations,
  it: itTranslations as Translations,
  es: esTranslations as Translations,
  pt: ptTranslations as Translations,
  nl: nlTranslations as Translations,
  bg: bgTranslations as Translations,
  ro: roTranslations as Translations,
  hu: huTranslations as Translations,
  el: elTranslations as Translations,
  cs: csTranslations as Translations,
  sk: skTranslations as Translations,
  sl: slTranslations as Translations,
  hr: hrTranslations as Translations,
  sr: srTranslations as Translations,
  bs: bsTranslations as Translations,
  mk: mkTranslations as Translations,
  sq: sqTranslations as Translations,
  lv: lvTranslations as Translations,
  lt: ltTranslations as Translations,
  et: etTranslations as Translations
};

// Функция для получения перевода
export function getTranslation(lang: string = 'kk'): Translations {
  // Если перевод для языка существует, используем его
  if (translations[lang]) {
    return translations[lang];
  }
  
  // Иначе используем английский как fallback
  if (translations.en) {
    return translations.en;
  }
  
  // Если даже английского нет, используем казахский
  return translations.kk || Object.values(translations)[0];
}

// Экспорт по умолчанию для совместимости
export default translations;
