
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

interface NavbarProps {
  onScrollToSection: (section: string) => void;
  onLanguageChange: (language: string) => void;
}

const languages = [
  { code: 'kk', name: 'Қазақша' },
  { code: 'ru', name: 'Русский' },
  { code: 'en', name: 'English' }
];

const Navbar: React.FC<NavbarProps> = ({ onScrollToSection, onLanguageChange }) => {
  const isMobile = useIsMobile();
  const [selectedLanguage, setSelectedLanguage] = useState('kk');

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    onLanguageChange(languageCode);
  };

  const navItems = [
    { name: 'Басты бет', section: 'hero' },
    { name: 'Біз туралы', section: 'about' },
    { name: 'Артықшылықтар', section: 'benefits' },
    { name: 'Тіркелу', section: 'registration' }
  ];

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

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#021F18] shadow-md">
      <div className="container mx-auto flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/b241a71c-c673-4ac3-8320-3027b67c4557.png" 
            alt="EcoLifeEuroAsia Logo" 
            className="h-12 md:h-16"
          />
        </div>

        {isMobile ? (
          <div className="flex items-center">
            <div className="mr-4">
              <select 
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#021F18] text-white border border-white/30 rounded px-2 py-1 text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#021F18] text-white">
                <nav className="flex flex-col gap-4 mt-8">
                  <NavItems />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-1">
              <NavItems />
            </nav>
            <div className="border-l border-white/30 pl-4">
              <select 
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="bg-[#021F18] text-white border border-white/30 rounded px-2 py-1"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
