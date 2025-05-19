
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroSectionProps {
  onScrollToRegistration: () => void;
  translations: {
    title: string;
    subtitle: string;
    description: string;
    registerButton: string;
    additionalInfo?: string;
    officialInfo?: string;
    platformStatus?: string;
    callToAction?: string;
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToRegistration, translations }) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center pt-20">
      {/* World map background with semi-transparent overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/c68546b2-08d4-48ba-a7d5-45db0a57891b.png" 
          alt="World Map" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-ecogreen-dark/80"></div>
      </div>
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-4/5 text-center md:text-left animate-fade-up">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              ECOLIFEEUROASIA
            </h1>
            <h2 className="text-xl md:text-2xl text-ecogold mb-6">
              {translations.subtitle}
            </h2>
            <p className="text-white/90 mb-4 max-w-2xl text-responsive">
              {translations.additionalInfo || ""}
            </p>
            <p className="text-white/90 mb-6 max-w-2xl text-responsive">
              {translations.officialInfo || ""}
            </p>
            <p className="text-white/80 mb-4 italic">
              {translations.platformStatus || ""}
            </p>
            <p className="text-white/90 mb-8 max-w-xl text-responsive">
              {translations.callToAction || ""}
            </p>
            <Button 
              onClick={onScrollToRegistration}
              className="bg-ecogold hover:bg-ecogold-light text-ecogreen-dark font-semibold px-6 py-5 sm:px-8 sm:py-6 text-base sm:text-lg"
            >
              {translations.registerButton}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
