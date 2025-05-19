
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import BenefitsSection from '@/components/BenefitsSection';
import RegistrationForm from '@/components/RegistrationForm';
import Footer from '@/components/Footer';
import { translations, getTranslation } from '@/translations';
import { useLanguage } from '@/hooks/useLanguage';

const Index = () => {
  const { lang } = useParams<{ lang: string }>();
  const [currentLanguage, setCurrentLanguage] = useLanguage();
  const [currentTranslations, setCurrentTranslations] = useState(
    // Используем функцию getTranslation для получения переводов
    lang ? getTranslation(lang) : getTranslation(currentLanguage)
  );
  
  const heroRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const benefitsRef = useRef<HTMLElement>(null);
  const registrationRef = useRef<HTMLElement>(null);

  // Обновляем переводы при изменении языка в URL
  useEffect(() => {
    if (lang) {
      // Используем функцию getTranslation, которая обрабатывает все языки
      setCurrentTranslations(getTranslation(lang));
    }
  }, [lang]);

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
      <Navbar onScrollToSection={scrollToSection} />

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
