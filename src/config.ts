// Конфигурация приложения
// Здесь можно легко изменить настройки почты и другие параметры

interface AppConfig {
  // Email для получения заявок
  emailTo: string;
  
  // Настройки EmailJS
  emailjs: {
    serviceId: string;
    templateId: string;
    publicKey: string;
  };
  
  // Google API Key для перевода
  googleApiKey: string;
  
  // Настройки администратора
  admin: {
    username: string;
    password: string;
  };
}

const config: AppConfig = {
  // Email для получения заявок
  emailTo: import.meta.env.VITE_EMAIL_TO || 'leads@ecolifeeuroasia.com',
  
  // Настройки EmailJS
  emailjs: {
    serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || ''
  },
  
  // Google API Key для перевода
  googleApiKey: import.meta.env.GOOGLE_API_KEY || '',
  
  // Настройки администратора
  admin: {
    username: 'admin', // Фиксированный логин
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'ecolife2025' // Пароль по умолчанию, лучше заменить в .env
  }
};

export default config;
