
import React from 'react';
import { Mail, Globe, MapPin, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  translations: {
    contact: string;
    email: string;
    location: string;
    copyright: string;
    companyDescription?: string;
    platformDevelopment?: string;
    securityTitle?: string;
    securityDescription?: string;
  };
}

const Footer: React.FC<FooterProps> = ({ translations }) => {
  return (
    <footer className="bg-gray-900 text-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EcoLifeEuroAsia</h3>
            <p className="text-gray-300 text-sm mb-4">
              {translations.companyDescription || "EcoLifeEuroAsia — тіркелген халықаралық экоплатформа"}
            </p>
            <p className="text-gray-400 text-xs">
              {translations.copyright}
            </p>
            <div className="mt-4">
              <Link to="/admin" className="flex items-center text-gray-400 text-xs hover:text-ecogold transition-colors">
                <Settings className="h-3 w-3 mr-1" />
                Администрирование
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{translations.contact}</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-ecogold mr-2 mt-0.5" />
                <span className="text-gray-300 text-sm">{translations.email}</span>
              </li>
              <li className="flex items-start">
                <Globe className="h-5 w-5 text-ecogold mr-2 mt-0.5" />
                <div>
                  <span className="text-gray-300 text-sm block">ecolifeeuroasia.com</span>
                  <span className="text-gray-400 text-xs italic">{translations.platformDevelopment || "(Жаңа платформа нұсқасы жасалып жатыр — бізбен бірге болыңыз!)"}</span>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-ecogold mr-2 mt-0.5" />
                <span className="text-gray-300 text-sm">{translations.location}</span>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{translations.securityTitle || "Қауіпсіздік"}</h3>
            <p className="text-gray-300 text-sm">
              {translations.securityDescription || "Сіздің деректеріңіз қорғалған. Барлық транзакциялар қауіпсіз."}
            </p>
            <div className="mt-6 flex space-x-4">
              <div className="bg-gray-800 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ecogold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="bg-gray-800 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ecogold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
