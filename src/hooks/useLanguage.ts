import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getSupportedLanguages } from '../i18n';

// Используем динамический список языков
type Language = string;

export const useLanguage = (): [Language, (lang: Language) => void] => {
  const navigate = useNavigate();
  const location = useLocation();
  const [language, setLanguage] = useState<Language>('en');

  // Функция для определения языка из URL
  const getLanguageFromUrl = (): Language | null => {
    const path = location.pathname.split('/')[1];
    const supportedLangs = getSupportedLanguages();
    if (supportedLangs.includes(path)) {
      return path;
    }
    return null;
  };

  // Функция для определения языка браузера
  const getBrowserLanguage = (): Language => {
    if (typeof navigator === 'undefined') return 'kk'; // По умолчанию KK для SSR
    
    const supportedLangs = getSupportedLanguages();
    // Получаем все предпочитаемые языки
    const browserLanguages = navigator.languages || [navigator.language];
    
    console.log('Browser languages:', browserLanguages);
    console.log('Supported languages:', supportedLangs);
    
    // Сначала ищем точное совпадение
    for (const lang of browserLanguages) {
      const langLower = lang.toLowerCase();
      // Проверяем полный код языка (например, 'de-DE')
      if (supportedLangs.some(l => langLower === l.toLowerCase())) {
        return langLower;
      }
      // Проверяем основной код языка (например, 'de')
      const langCode = langLower.split('-')[0];
      if (supportedLangs.some(l => l.toLowerCase() === langCode)) {
        return langCode;
      }
    }
    
    // Если ни один из языков не поддерживается
    // Сначала пробуем en, затем kk
    if (supportedLangs.includes('en')) {
      console.log('No matching language found, defaulting to English');
      return 'en';
    }
    
    console.log('No matching language found, defaulting to Kazakh');
    return 'kk';
  };

  // Функция для обновления языка
  const updateLanguage = (newLang: Language) => {
    const supportedLangs = getSupportedLanguages();
    if (!supportedLangs.includes(newLang)) return;
    
    setLanguage(newLang);
    
    // Обновляем URL
    const path = location.pathname.split('/').slice(1);
    if (supportedLangs.includes(path[0])) {
      path[0] = newLang;
    } else {
      path.unshift(newLang);
    }
    
    navigate(`/${path.join('/')}${location.search}${location.hash}`, { replace: true });
  };

  // Эффект для начальной настройки языка
  useEffect(() => {
    const langFromUrl = getLanguageFromUrl();
    
    if (langFromUrl) {
      // Если язык есть в URL, используем его, только если он отличается от текущего
      if (langFromUrl !== language) {
        setLanguage(langFromUrl);
      }
    } else {
      // Если в URL нет языка, определяем язык браузера и перенаправляем
      const browserLang = getBrowserLanguage();
      
      // Проверяем, что текущий путь не является языковым маршрутом
      const pathParts = location.pathname.split('/').filter(Boolean);
      const supportedLangs = getSupportedLanguages();
      
      // Если первая часть пути - это язык, не перенаправляем
      if (pathParts.length > 0 && supportedLangs.includes(pathParts[0])) {
        return;
      }
      
      // Создаем новый путь с языком
      const newPath = `/${browserLang}${location.pathname === '/' ? '' : location.pathname}`;
      
      // Используем setTimeout, чтобы избежать ошибки "Too many re-renders"
      const timer = setTimeout(() => {
        navigate(newPath + location.search + location.hash, { replace: true });
      }, 0);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  return [language, updateLanguage];
};
