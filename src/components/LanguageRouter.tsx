import { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '@/hooks/useLanguage';
import { getSupportedLanguages } from '@/i18n';

interface LanguageRouterProps {
  children?: React.ReactNode;
}

export const LanguageRouter: React.FC<LanguageRouterProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentLanguage] = useLanguage();
  
  // Проверяем, что текущий путь начинается с кода языка
  useEffect(() => {
    // Если это корневой путь, перенаправляем на язык браузера
    if (location.pathname === '/') {
      navigate(`/${currentLanguage}`, { replace: true });
    }
  }, [location.pathname, currentLanguage, navigate]);
  
  // Если есть children, возвращаем их
  if (children) {
    return <>{children}</>;
  }
  
  // Иначе перенаправляем на язык
  return <Navigate to={`/${currentLanguage}`} replace />;
};
