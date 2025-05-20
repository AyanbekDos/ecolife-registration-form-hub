import emailjs from '@emailjs/browser';

interface FormData {
  country: string;
  company: string;
  industry: string;
  email: string;
  phone: string;
  hasCertificate: boolean;
  description: string;
}

// Проверка на спам
function isSpam(formData: FormData): boolean {
  // Проверяем, что все обязательные поля заполнены
  if (!formData.country || !formData.company || !formData.industry || !formData.email) {
    console.warn('Не все обязательные поля заполнены');
    return true;
  }
  
  // Проверяем email на валидность
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData.email)) {
    console.warn('Неверный формат email');
    return true;
  }
  
  // Проверяем на спам-слова в описании
  const spamWords = ['http', 'www', '.ru', '.com', 'click', 'free', 'win', 'prize'];
  const description = formData.description?.toLowerCase() || '';
  if (spamWords.some(word => description.includes(word))) {
    console.warn('Обнаружены спам-слова в описании');
    return true;
  }
  
  return false;
}

// Отправка данных формы на email с использованием EmailJS
async function sendFormDataToEmail(formData: FormData): Promise<boolean> {
  try {
    // Логируем данные для отладки
    console.log('Отправка данных формы на email:', {
      to: 'leads@ecolifeeuroasia.com',
      subject: 'Новая регистрация на Ecolife',
      formData
    });
    
    const templateParams = {
      to_email: 'leads@ecolifeeuroasia.com',
      from_email: formData.email,
      from_name: formData.company,
      message: `
        Страна: ${formData.country}
        Компания: ${formData.company}
        Отрасль: ${formData.industry}
        Email: ${formData.email}
        Телефон: ${formData.phone}
        Есть сертификат: ${formData.hasCertificate ? 'Да' : 'Нет'}
        Описание: ${formData.description}
      `
    };

    // Проверяем наличие обязательных переменных окружения
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error('Не настроены переменные окружения для EmailJS');
      console.log('VITE_EMAILJS_SERVICE_ID:', serviceId ? 'установлен' : 'отсутствует');
      console.log('VITE_EMAILJS_TEMPLATE_ID:', templateId ? 'установлен' : 'отсутствует');
      console.log('VITE_EMAILJS_PUBLIC_KEY:', publicKey ? 'установлен' : 'отсутствует');
      return false;
    }

    const result = await emailjs.send(
      serviceId,
      templateId,
      templateParams,
      publicKey
    );

    console.log('Письмо успешно отправлено:', result);
    return true;
  } catch (error) {
    console.error('Ошибка при отправке письма:', {
      message: error instanceof Error ? error.message : 'Неизвестная ошибка',
      details: error
    });
    return false;
  }
}

// Основная функция обработки формы
export const handleFormSubmission = async (formData: FormData) => {
  try {
    // Проверка на спам
    if (isSpam(formData)) {
      return { 
        success: false, 
        message: 'Ваша заявка была помечена как спам. Пожалуйста, свяжитесь с нами другим способом.' 
      };
    }
    
    // Отправка письма с данными формы
    const emailSent = await sendFormDataToEmail(formData);
    
    if (!emailSent) {
      return { success: false, message: 'Ошибка при отправке письма' };
    }
    
    return { success: true, message: 'Форма успешно отправлена' };
  } catch (error) {
    console.error('Form submission error:', error);
    return { 
      success: false, 
      message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.' 
    };
  }
}
