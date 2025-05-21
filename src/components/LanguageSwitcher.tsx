import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/hooks/useLanguage';
import { getSupportedLanguages } from '@/i18n';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const params = useParams();
  const [currentLanguage, setCurrentLanguage] = useLanguage();
  
  // Основные языки для выбора
  const mainLanguages = [
    { code: 'kk', name: 'Қаз' },
    { code: 'ru', name: 'Рус' },
    { code: 'en', name: 'Eng' }
  ];
  
  // Получаем все поддерживаемые языки из файлов переводов
  const allSupportedCodes = getSupportedLanguages();
  
  // Создаем объекты языков для всех поддерживаемых кодов
  const allLanguages = allSupportedCodes.map(code => {
    // Проверяем, есть ли язык в основных
    const mainLang = mainLanguages.find(l => l.code === code);
    if (mainLang) return mainLang;
    
    // Иначе создаем новый объект языка
    return { code, name: code.toUpperCase() };
  });
  
  // Создаем список языков для отображения в меню
  const [menuLanguages, setMenuLanguages] = useState(mainLanguages);
  
  // Запоминаем последний дополнительный язык
  const [lastExtraLanguage, setLastExtraLanguage] = useState<{code: string, name: string} | null>(null);
  
  // Проверяем URL на наличие языкового префикса при загрузке
  useEffect(() => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    if (pathParts.length > 0) {
      const urlLang = pathParts[0];
      // Если язык в URL не входит в основные, запоминаем его
      if (!mainLanguages.some(l => l.code === urlLang) && allSupportedCodes.includes(urlLang)) {
        const extraLang = { code: urlLang, name: urlLang.toUpperCase() };
        setLastExtraLanguage(extraLang);
      }
    }
  }, []);
  
  // Формируем список языков для меню
  useEffect(() => {
    // Создаем список языков для меню, начиная с основных
    let newMenuLanguages = [...mainLanguages];
    
    // Если текущий язык не входит в основные, добавляем его в список и запоминаем
    if (currentLanguage && !mainLanguages.some(l => l.code === currentLanguage)) {
      const currentLangObj = allLanguages.find(l => l.code === currentLanguage);
      if (currentLangObj) {
        newMenuLanguages.push(currentLangObj);
        setLastExtraLanguage(currentLangObj);
      }
    }
    
    // Если есть запомненный дополнительный язык и он не совпадает с текущим
    if (lastExtraLanguage && lastExtraLanguage.code !== currentLanguage) {
      // Проверяем, что его еще нет в списке
      if (!newMenuLanguages.some(l => l.code === lastExtraLanguage.code)) {
        newMenuLanguages.push(lastExtraLanguage);
      }
    }
    
    // Удаляем дубликаты, если они есть
    const uniqueLanguages = newMenuLanguages.filter((lang, index, self) => 
      index === self.findIndex(l => l.code === lang.code)
    );
    
    setMenuLanguages(uniqueLanguages);
  }, [currentLanguage, allLanguages, lastExtraLanguage, mainLanguages]);
  
  // Находим объект активного языка
  const activeLang = allLanguages.find(l => l.code === currentLanguage) || 
                    allLanguages.find(l => l.code === 'en') || 
                    mainLanguages[0];
  
  // Обработчик смены языка
  const changeLanguage = (langCode: string) => {
    console.log(`Переключение языка на: ${langCode}, текущий язык: ${currentLanguage}`);
    
    // Если переключаемся на неосновной язык, запоминаем его
    if (!mainLanguages.some(l => l.code === langCode)) {
      const langObj = allLanguages.find(l => l.code === langCode);
      if (langObj) {
        setLastExtraLanguage(langObj);
      }
    }
    
    // Обновляем язык через хук useLanguage
    setCurrentLanguage(langCode);
    
    // Получаем текущий путь и создаем новый
    const currentPath = window.location.pathname;
    console.log(`Текущий путь: ${currentPath}`);
    
    // Проверяем, есть ли языковой префикс в URL
    const pathParts = currentPath.split('/').filter(Boolean);
    const supportedLangs = allLanguages.map(l => l.code);
    const hasLangPrefix = pathParts.length > 0 && supportedLangs.includes(pathParts[0]);
    
    let newPath;
    if (hasLangPrefix) {
      // Если есть языковой префикс, заменяем его
      newPath = currentPath.replace(`/${pathParts[0]}`, `/${langCode}`);
    } else {
      // Если нет, добавляем язык в начало пути
      newPath = `/${langCode}${currentPath === '/' ? '' : currentPath}`;
    }
    
    console.log(`Новый путь: ${newPath}`);
    
    // Переходим на новый URL
    navigate(newPath, { replace: true });
  };
  
  // Не нужен эффект, так как useLanguage уже обрабатывает изменение языка

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Выпадающее меню с языками */}
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-black/10 flex items-center gap-1 justify-center"
            >
              <Globe className="h-4 w-4" />
              <span>{activeLang.name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-[120px] bg-white/90 backdrop-blur-sm">
            {/* Список языков для меню */}
            {menuLanguages.map(lang => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => changeLanguage(lang.code)}
                className={`${lang.code === currentLanguage ? 'bg-black/10 font-bold' : ''} hover:bg-black/10`}
                disabled={lang.code === currentLanguage}
              >
                {lang.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default LanguageSwitcher;
