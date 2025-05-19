
import React from 'react';
import { Globe, Award, Leaf, CheckCircle } from 'lucide-react';

interface AboutSectionProps {
  translations: {
    title: string;
    description: string;
    mission: string;
    missionTitle: string;
    features: {
      international: {
        title: string;
        description: string;
      };
      certified: {
        title: string;
        description: string;
      };
      official: {
        title: string;
        description: string;
      };
    };
  };
}

const AboutSection: React.FC<AboutSectionProps> = ({ translations }) => {
  return (
    <section id="about" className="py-12 md:py-20 bg-white section-padding">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-ecogreen mb-6">{translations.title}</h2>
          <p className="text-gray-700 mb-8 text-responsive">
            {translations.description}
          </p>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex justify-center mb-4">
              <Leaf className="h-10 w-10 text-ecogreen" />
            </div>
            <h3 className="text-xl md:text-2xl font-semibold mb-4">{translations.missionTitle}:</h3>
            <p className="text-gray-700 text-responsive">
              {translations.mission}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <Globe className="h-12 w-12 mx-auto mb-4 text-ecogreen" />
            <h3 className="text-lg font-semibold mb-2">{translations.features.international.title}</h3>
            <p className="text-gray-600">{translations.features.international.description}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-ecogreen" />
            <h3 className="text-lg font-semibold mb-2">{translations.features.certified.title}</h3>
            <p className="text-gray-600">{translations.features.certified.description}</p>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
            <Award className="h-12 w-12 mx-auto mb-4 text-ecogreen" />
            <h3 className="text-lg font-semibold mb-2">{translations.features.official.title}</h3>
            <p className="text-gray-600">{translations.features.official.description}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
