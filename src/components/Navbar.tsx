import React from 'react';
import { Button } from "@/components/ui/button";
import { useIsMobile } from '@/hooks/use-mobile';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  onScrollToSection: (section: string) => void;
}

const languages = [
  { code: 'kk' as const, name: 'Қаз' },
  { code: 'ru' as const, name: 'Рус' },
  { code: 'en' as const, name: 'Eng' }
];

// Тексты для навигации на разных языках
const navTexts = {
  kk: { 
    home: 'Басты бет', 
    about: 'Біз туралы', 
    benefits: 'Артықшылықтар', 
    register: 'Тіркелу' 
  },
  ru: { 
    home: 'Главная', 
    about: 'О нас', 
    benefits: 'Преимущества', 
    register: 'Регистрация' 
  },
  en: { 
    home: 'Home', 
    about: 'About', 
    benefits: 'Benefits', 
    register: 'Register' 
  }
} as const;

type NavLanguage = keyof typeof navTexts;

const Navbar: React.FC<NavbarProps> = ({ onScrollToSection }) => {
  const isMobile = useIsMobile();
  const [currentLanguage, setCurrentLanguage] = useLanguage();
  
  // Получаем тексты для текущего языка или используем fallback
  const getNavText = () => {
    // Проверяем, есть ли текущий язык в navTexts
    if (currentLanguage in navTexts) {
      return navTexts[currentLanguage as NavLanguage];
    }
    // Фолбэк на английский
    if ('en' in navTexts) {
      return navTexts.en;
    }
    // Если даже английского нет, используем первый доступный язык
    return navTexts[Object.keys(navTexts)[0] as NavLanguage];
  };
  
  const currentNavText = getNavText();
  
  // Обновляем элементы навигации при изменении языка
  const navItems = [
    { name: currentNavText.home, section: 'hero' },
    { name: currentNavText.about, section: 'about' },
    { name: currentNavText.benefits, section: 'benefits' },
    { name: currentNavText.register, section: 'registration' }
  ];

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
  };

  const NavItems = () => (
    <>
      {navItems.map((item) => (
        <Button 
          key={item.section}
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => onScrollToSection(item.section)}
        >
          {item.name}
        </Button>
      ))}
    </>
  );

  // Используем новый компонент LanguageSwitcher вместо LanguageDropdown
  const LanguageSelector = () => {
    return (
      <LanguageSwitcher className="text-white" />
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#021F18] shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3 px-4">
        <div className="flex items-center">
          <img 
            src="/lovable-uploads/b241a71c-c673-4ac3-8320-3027b67c4557.png" 
            alt="EcoLifeEuroAsia Logo" 
            className="h-12 md:h-16" 
          />
        </div>

        {isMobile ? (
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 md:hidden">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-1">
              <NavItems />
            </nav>
            <LanguageSelector />
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
