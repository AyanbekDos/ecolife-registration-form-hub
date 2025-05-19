
import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import BenefitsSection from '@/components/BenefitsSection';
import RegistrationForm from '@/components/RegistrationForm';
import Footer from '@/components/Footer';
import { translations } from '@/translations';

const Index = () => {
  const [language, setLanguage] = useState('kk');
  const [currentTranslations, setCurrentTranslations] = useState(translations.kk);
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const registrationRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Auto-detect user's language or region based on browser info
    try {
      const userLang = navigator.language.split('-')[0];
      if (userLang === 'ru' || userLang === 'kk' || userLang === 'en') {
        setLanguage(userLang);
      }
    } catch (error) {
      console.error("Ошибка определения языка:", error);
    }
  }, []);

  useEffect(() => {
    setCurrentTranslations(translations[language] || translations.kk);
  }, [language]);

  const scrollToSection = (section: string) => {
    const sectionRefs: Record<string, React.RefObject<HTMLElement>> = {
      hero: heroRef,
      about: aboutRef,
      benefits: benefitsRef,
      registration: registrationRef
    };

    const ref = sectionRefs[section];
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar 
        onScrollToSection={scrollToSection} 
        onLanguageChange={setLanguage} 
      />

      <main>
        <section ref={heroRef}>
          <HeroSection 
            translations={currentTranslations.hero}
            onScrollToRegistration={() => scrollToSection('registration')} 
          />
        </section>
        
        <section ref={aboutRef}>
          <AboutSection translations={currentTranslations.about} />
        </section>
        
        <section ref={benefitsRef}>
          <BenefitsSection translations={currentTranslations.benefits} />
        </section>
        
        <section ref={registrationRef}>
          <RegistrationForm translations={currentTranslations.registration} />
        </section>
      </main>
      
      <Footer translations={currentTranslations.footer} />
    </div>
  );
};

export default Index;
