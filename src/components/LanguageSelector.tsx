import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Импортируем иконки флагов
import { KZ, RU, GB, DE } from 'country-flag-icons/react/3x2';

// Список поддерживаемых языков
const SUPPORTED_LANGUAGES = [
  { code: 'kk', name: 'Қаз', flag: KZ, fullName: 'Қазақша' },
  { code: 'ru', name: 'Рус', flag: RU, fullName: 'Русский' },
  { code: 'en', name: 'Eng', flag: GB, fullName: 'English' },
  { code: 'de', name: 'Deu', flag: DE, fullName: 'Deutsch' }
];

// Ключ для хранения выбранного языка в localStorage
const LANGUAGE_STORAGE_KEY = 'selectedLanguage';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [currentLanguage, setCurrentLanguage] = useState<string>('kk'); // По умолчанию казахский
  
  // Определяем активный язык из URL
  useEffect(() => {
    const detectLanguage = () => {
      // Получаем текущий путь
      const path = window.location.pathname;
      const pathSegments = path.split('/').filter(Boolean);
      
      // Проверяем, есть ли языковой префикс в URL
      if (pathSegments.length > 0) {
        const possibleLang = pathSegments[0];
        if (SUPPORTED_LANGUAGES.some(lang => lang.code === possibleLang)) {
          setCurrentLanguage(possibleLang);
          // Сохраняем выбор в localStorage
          localStorage.setItem(LANGUAGE_STORAGE_KEY, possibleLang);
          return;
        }
      }
      
      // Если в URL нет языка, проверяем localStorage
      const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
      if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
        setCurrentLanguage(savedLanguage);
        // Редирект на сохраненный язык
        redirectToLanguage(savedLanguage);
        return;
      }
      
      // Если нет сохраненного языка, определяем язык браузера
      const browserLang = detectBrowserLanguage();
      setCurrentLanguage(browserLang);
      // Редирект на определенный язык
      redirectToLanguage(browserLang);
    };
    
    detectLanguage();
  }, [navigate]);
  
  // Функция для определения языка браузера
  const detectBrowserLanguage = (): string => {
    // Проверяем доступность объекта navigator (для SSR)
    if (typeof navigator === 'undefined') return 'kk';
    
    // Получаем язык браузера
    const browserLang = navigator.language || (navigator.languages && navigator.languages[0]);
    if (!browserLang) return 'kk';
    
    // Извлекаем основной код языка (например, 'ru-RU' -> 'ru')
    const langCode = browserLang.split('-')[0].toLowerCase();
    
    // Проверяем, поддерживается ли язык
    const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === langCode);
    
    // Возвращаем код языка, если поддерживается, иначе 'kk'
    return isSupported ? langCode : 'kk';
  };
  
  // Функция для редиректа на страницу с выбранным языком
  const redirectToLanguage = (langCode: string) => {
    // Получаем текущий путь
    const path = window.location.pathname;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Проверяем, есть ли уже языковой префикс
    if (pathSegments.length > 0 && SUPPORTED_LANGUAGES.some(lang => lang.code === pathSegments[0])) {
      // Заменяем существующий префикс
      const newPath = `/${langCode}/${pathSegments.slice(1).join('/')}`;
      navigate(newPath, { replace: true });
    } else {
      // Добавляем префикс к существующему пути
      const newPath = `/${langCode}${path === '/' ? '' : path}`;
      navigate(newPath, { replace: true });
    }
  };
  
  // Обработчик выбора языка
  const handleLanguageChange = (langCode: string) => {
    if (langCode !== currentLanguage) {
      // Сохраняем выбор в localStorage
      localStorage.setItem(LANGUAGE_STORAGE_KEY, langCode);
      
      // Обновляем состояние
      setCurrentLanguage(langCode);
      
      // Редирект на выбранный язык
      redirectToLanguage(langCode);
    }
  };
  
  // Находим активный язык
  const activeLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage) || SUPPORTED_LANGUAGES[0];
  
  // Компонент флага с названием языка
  const FlagWithName = ({ lang }: { lang: typeof SUPPORTED_LANGUAGES[0] }) => {
    const Flag = lang.flag;
    return (
      <div className="flex items-center gap-2">
        <Flag className="w-4 h-3" />
        <span>{lang.name}</span>
      </div>
    );
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      {/* Кнопка с активным языком */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="px-3 py-1 text-sm font-medium bg-opacity-20 hover:bg-opacity-30 text-white"
          >
            <FlagWithName lang={activeLanguage} />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="min-w-[150px]">
          {SUPPORTED_LANGUAGES.map(lang => (
            <DropdownMenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`${lang.code === currentLanguage ? 'bg-gray-100 font-bold' : ''}`}
              disabled={lang.code === currentLanguage}
            >
              <div className="flex items-center gap-2">
                <lang.flag className="w-5 h-4" />
                <span>{lang.fullName}</span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default LanguageSelector;
