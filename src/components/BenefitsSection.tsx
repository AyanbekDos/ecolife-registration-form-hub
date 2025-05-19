
import React from 'react';
import { Globe, Award, Clock, Shield, Zap } from 'lucide-react';

interface BenefitProps {
  number: string;
  title: string;
  description: string;
  color: string;
  icon: React.ReactNode;
}

interface BenefitsSectionProps {
  translations: {
    title: string;
    benefits: {
      title: string;
      description: string;
    }[];
    whyRegisterTitle: string;
    benefitsItems?: {
      title: string;
      description: string;
    }[];
  };
}

const BenefitItem: React.FC<BenefitProps> = ({ title, description, color, icon }) => {
  return (
    <div className={`benefit-step ${color} p-4 md:p-6 rounded-lg shadow-md text-white h-full`}>
      <div className="flex items-center mb-3 md:mb-4">
        <div className="w-8 h-8 md:w-10 md:h-10 mr-3">{icon}</div>
      </div>
      <h3 className="text-lg md:text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm md:text-base text-white/90">{description}</p>
    </div>
  );
};

const BenefitsSection: React.FC<BenefitsSectionProps> = ({ translations }) => {
  // Используем benefitsItems из переводов, если они есть, иначе используем стандартные значения
  const benefitsData = translations.benefitsItems || [
    {
      title: "40+ ел нарығына бірден кіріңіз!",
      description: "Қазір тіркеліп, әлем нарығын бағындырыңыз!"
    },
    {
      title: "50% жеңілдік – уақыт шектеулі!",
      description: "Алдын ала тіркелудің артықшылығын пайдаланыңыз!"
    },
    {
      title: "100 Әлемдік Эко Лидер",
      description: "Атағын иеленуге үлгеріңіз! Орын саны шектеулі!"
    },
    {
      title: "100 ЭкоБренд қатарында болыңыз!",
      description: "Үздіктердің бірі болыңыз, орын шектеулі!"
    },
    {
      title: "№1 экоплатформадағы ең тиімді орындар",
      description: "Сіздікі болуы мүмкін! Мүмкіндік шектеулі, қазір тіркеліңіз!"
    }
  ];
  
  // Добавляем цвета и иконки к элементам
  const benefits = [
    { ...benefitsData[0], color: "bg-[#0B5032]", icon: <Globe className="w-full h-full" /> },
    { ...benefitsData[1], color: "bg-[#c15b3b]", icon: <Clock className="w-full h-full" /> },
    { ...benefitsData[2], color: "bg-[#a0892b]", icon: <Award className="w-full h-full" /> },
    { ...benefitsData[3], color: "bg-[#2b802d]", icon: <Shield className="w-full h-full" /> },
    { ...benefitsData[4], color: "bg-[#9b795f]", icon: <Zap className="w-full h-full" /> }
  ];

  return (
    <section id="benefits" className="py-10 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-ecogreen mb-3 md:mb-4">{translations.whyRegisterTitle}</h2>
          <div className="w-16 md:w-20 h-1 bg-ecogold mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (
            <BenefitItem 
              key={index}
              number={`0${index + 1}`}
              title={benefit.title}
              description={benefit.description}
              color={benefit.color}
              icon={benefit.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
