
export interface Translations {
  navbar: {
    home: string;
    about: string;
    benefits: string;
    register: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    registerButton: string;
  };
  about: {
    title: string;
    mission: string;
    missionTitle: string;
    description: string;
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
  benefits: {
    title: string;
    benefits: {
      title: string;
      description: string;
    }[];
    whyRegisterTitle: string;
  };
  registration: {
    title: string;
    subtitle: string;
    fields: {
      country: string;
      company: string;
      industry: string;
      email: string;
      phone: string;
      hasCertificate: string;
      yes: string;
      no: string;
      description: string;
    };
    submitButton: string;
    successMessage: string;
    errorMessage: string;
    warning: {
      title: string;
      description: string;
      steps: string[];
    };
    formTitle: string;
    afterSubmit: string;
  };
  footer: {
    contact: string;
    email: string;
    location: string;
    copyright: string;
  };
}

export const translations: Record<string, Translations> = {
  kk: {
    navbar: {
      home: 'Басты бет',
      about: 'Біз туралы',
      benefits: 'Артықшылықтар',
      register: 'Тіркелу'
    },
    hero: {
      title: 'EKOLIFEEUROASIA',
      subtitle: 'Сіздің бизнесіңіз үшін жаңа мүмкіндіктер кеңістігі. Жақсы орындарға тіркеліңіз – болашақ бүгіннен басталады',
      description: 'Европа мен Орталық Азияны біріктіретін, баламасы жоқ цифрлық кеңістік. Экологиялық таза өнімдер, қызметтер, мен эко технологияларға арналған инновациялық және сенімді халықаралық эко-платформа.',
      registerButton: 'Тіркелу'
    },
    about: {
      title: 'EKOLIFEEUROASIA ТУРАЛЫ',
      mission: 'Экологиялық сананы арттырып, Еуропа мен Орталық Азияда табиғатпен үйлесімді, таза және тұрақты бизнес-орта қалыптастыру.',
      missionTitle: 'Миссиямыз',
      description: 'Европа мен Орталық Азиядағы тексерілген эко қызметтер, эко өнімдер, иновациялық эко технологиялар бір жерде Ресми жоба, Мемлекеттік деңгейде заңды тіркелген',
      features: {
        international: {
          title: 'Халықаралық платформа',
          description: 'Еуропа мен Орталық Азияны біріктіреді'
        },
        certified: {
          title: 'Сертификатталған',
          description: 'Тексерілген эко-өнімдер мен қызметтер'
        },
        official: {
          title: 'Рәсми тіркелген',
          description: 'Мемлекеттік деңгейде заңды тіркелген'
        }
      }
    },
    benefits: {
      title: 'АРТЫҚШЫЛЫҚТАР',
      benefits: [
        {
          title: '40+ Ел нарығына',
          description: 'бірден кіріңіз! Қазір тіркеліп, әлем нарығын бағындырыңыз!'
        },
        {
          title: '50% жеңілдік',
          description: 'уақыт шектеулі! Алдын ала тіркелудің артықшылығын пайдаланыңыз!'
        },
        {
          title: '"100 әлемдік эко лидер"',
          description: 'атағын иеленуге үлгеріңіз! Орын саны шектеулі!'
        },
        {
          title: '"100 экобренд"',
          description: 'қатарында болыңыз! Үздіктердің бірі болыңыз, орын шектеулі!'
        },
        {
          title: '№1 экоплатформадағы',
          description: 'ең тиімді орындар сіздікі болуы мүмкін! Мүмкіндік шектеулі, қазір тіркеліңіз!'
        }
      ],
      whyRegisterTitle: 'НЕГЕ ДӘЛ ҚАЗІР ТІРКЕЛУ КЕРЕК?'
    },
    registration: {
      title: 'Алдын ала тіркелу парағы',
      subtitle: 'Құрметті әріптес! EkoLifeEuroAsia эко-платформасына алдын ала тіркелу үшін төмендегі ақпаратты толтыруыңызды сұраймыз.',
      fields: {
        country: 'Мемлекет / Қала',
        company: 'Компания атауы',
        industry: 'Сала / Бағыт',
        email: 'Электрондық пошта',
        phone: 'Телефон (міндетті емес)',
        hasCertificate: 'Экологиялық сертификатыңыз бар ма?',
        yes: 'Иә',
        no: 'Жоқ',
        description: 'Компанияңыз туралы қысқаша сипаттама (өнімдеріңіз немесе қызметтеріңіз туралы)'
      },
      warning: {
        title: 'ЕСКЕРТУ!',
        description: 'Платформаға тіркелу екі кезеңнен тұрады:',
        steps: [
          'Алдын ала тіркелу – төлем жасап, орынды брондау және жеңілдіктерді бекіту үшін.',
          'Кеңейтілген тіркелу – платформаның демо-нұсқасы іске қосылған соң басталады.'
        ]
      },
      formTitle: '1. Тіркелуші туралы ақпарат',
      afterSubmit: 'Алдын ала тіркелгеннен кейін, сізге жақын арада электрондық пошта арқылы сайт презентациясын жібереміз.',
      submitButton: 'Жіберу',
      successMessage: 'Сәтті жіберілді!',
      errorMessage: 'Қате'
    },
    footer: {
      contact: 'Байланыс',
      email: 'leads@ecolifeeuroasia.com',
      location: 'Орналасқан жері: Орталық Азия | Қазақстан | Қарағанды қаласы',
      copyright: '© 2025 EkoLifeEuroAsia. Барлық құқықтар қорғалған'
    }
  },
  ru: {
    navbar: {
      home: 'Главная',
      about: 'О нас',
      benefits: 'Преимущества',
      register: 'Регистрация'
    },
    hero: {
      title: 'EKOLIFEEUROASIA',
      subtitle: 'Пространство новых возможностей для вашего бизнеса. Зарегистрируйтесь на лучших местах – будущее начинается сегодня',
      description: 'Уникальное цифровое пространство, объединяющее Европу и Центральную Азию. Инновационная и надежная международная эко-платформа для экологически чистых продуктов, услуг и эко-технологий.',
      registerButton: 'Регистрация'
    },
    about: {
      title: 'О EKOLIFEEUROASIA',
      mission: 'Повысить экологическое сознание и создать гармоничную с природой, чистую и устойчивую бизнес-среду в Европе и Центральной Азии.',
      missionTitle: 'Наша миссия',
      description: 'Проверенные эко-услуги, эко-продукты, инновационные эко-технологии Европы и Центральной Азии в одном месте. Официальный проект, юридически зарегистрированный на государственном уровне',
      features: {
        international: {
          title: 'Международная платформа',
          description: 'Объединяет Европу и Центральную Азию'
        },
        certified: {
          title: 'Сертифицированная',
          description: 'Проверенные эко-продукты и услуги'
        },
        official: {
          title: 'Официально зарегистрирована',
          description: 'Юридически зарегистрирована на государственном уровне'
        }
      }
    },
    benefits: {
      title: 'ПРЕИМУЩЕСТВА',
      benefits: [
        {
          title: 'Рынки 40+ стран',
          description: 'доступны сразу! Зарегистрируйтесь сейчас и завоюйте мировой рынок!'
        },
        {
          title: '50% скидка',
          description: 'время ограничено! Воспользуйтесь преимуществами предварительной регистрации!'
        },
        {
          title: '"100 мировых эко-лидеров"',
          description: 'успейте получить этот статус! Количество мест ограничено!'
        },
        {
          title: '"100 экобрендов"',
          description: 'станьте одним из них! Будьте среди лучших, места ограничены!'
        },
        {
          title: 'Самые эффективные места',
          description: 'на эко-платформе №1 могут стать вашими! Возможности ограничены, регистрируйтесь сейчас!'
        }
      ],
      whyRegisterTitle: 'ПОЧЕМУ СТОИТ ЗАРЕГИСТРИРОВАТЬСЯ ПРЯМО СЕЙЧАС?'
    },
    registration: {
      title: 'Форма предварительной регистрации',
      subtitle: 'Уважаемый партнер! Пожалуйста, заполните информацию ниже для предварительной регистрации на эко-платформе EkoLifeEuroAsia.',
      fields: {
        country: 'Страна / Город',
        company: 'Название компании',
        industry: 'Отрасль / Направление',
        email: 'Электронная почта',
        phone: 'Телефон (необязательно)',
        hasCertificate: 'У вас есть экологический сертификат?',
        yes: 'Да',
        no: 'Нет',
        description: 'Краткое описание вашей компании (о ваших продуктах или услугах)'
      },
      warning: {
        title: 'ВНИМАНИЕ!',
        description: 'Регистрация на платформе состоит из двух этапов:',
        steps: [
          'Предварительная регистрация – для оплаты, бронирования места и фиксации скидок.',
          'Расширенная регистрация – начнется после запуска демо-версии платформы.'
        ]
      },
      formTitle: '1. Информация о регистрирующемся',
      afterSubmit: 'После предварительной регистрации мы отправим вам презентацию сайта по электронной почте в ближайшее время.',
      submitButton: 'Отправить',
      successMessage: 'Успешно отправлено!',
      errorMessage: 'Ошибка'
    },
    footer: {
      contact: 'Контакты',
      email: 'leads@ecolifeeuroasia.com',
      location: 'Расположение: Центральная Азия | Казахстан | город Караганда',
      copyright: '© 2025 EkoLifeEuroAsia. Все права защищены'
    }
  },
  en: {
    navbar: {
      home: 'Home',
      about: 'About',
      benefits: 'Benefits',
      register: 'Register'
    },
    hero: {
      title: 'ECOLIFEEUROASIA',
      subtitle: 'A space of new opportunities for your business. Register for the best spots – the future begins today',
      description: 'A unique digital space connecting Europe and Central Asia. An innovative and reliable international eco-platform for environmentally-friendly products, services, and eco-technologies.',
      registerButton: 'Register'
    },
    about: {
      title: 'ABOUT ECOLIFEEUROASIA',
      mission: 'To enhance ecological awareness and create a nature-harmonious, clean, and sustainable business environment in Europe and Central Asia.',
      missionTitle: 'Our Mission',
      description: 'Verified eco-services, eco-products, innovative eco-technologies from Europe and Central Asia in one place. An official project legally registered at the state level',
      features: {
        international: {
          title: 'International Platform',
          description: 'Connects Europe and Central Asia'
        },
        certified: {
          title: 'Certified',
          description: 'Verified eco-products and services'
        },
        official: {
          title: 'Officially Registered',
          description: 'Legally registered at the state level'
        }
      }
    },
    benefits: {
      title: 'BENEFITS',
      benefits: [
        {
          title: 'Markets of 40+ countries',
          description: 'accessible immediately! Register now and conquer the global market!'
        },
        {
          title: '50% discount',
          description: 'limited time offer! Take advantage of pre-registration benefits!'
        },
        {
          title: '"100 global eco-leaders"',
          description: 'get this status while you can! Limited spots available!'
        },
        {
          title: '"100 eco-brands"',
          description: 'be one of them! Be among the best, limited spots available!'
        },
        {
          title: 'The most effective spots',
          description: 'on the #1 eco-platform can be yours! Limited opportunity, register now!'
        }
      ],
      whyRegisterTitle: 'WHY REGISTER RIGHT NOW?'
    },
    registration: {
      title: 'Pre-registration Form',
      subtitle: 'Dear partner! Please fill out the information below to pre-register for the EkoLifeEuroAsia eco-platform.',
      fields: {
        country: 'Country / City',
        company: 'Company Name',
        industry: 'Industry / Direction',
        email: 'Email',
        phone: 'Phone (optional)',
        hasCertificate: 'Do you have an ecological certificate?',
        yes: 'Yes',
        no: 'No',
        description: 'Brief description of your company (about your products or services)'
      },
      warning: {
        title: 'ATTENTION!',
        description: 'Registration on the platform consists of two stages:',
        steps: [
          'Pre-registration – for payment, spot reservation, and securing discounts.',
          'Extended registration – will begin after the platform demo version launch.'
        ]
      },
      formTitle: '1. Registrant Information',
      afterSubmit: 'After pre-registration, we will send you a site presentation via email shortly.',
      submitButton: 'Submit',
      successMessage: 'Successfully submitted!',
      errorMessage: 'Error'
    },
    footer: {
      contact: 'Contact',
      email: 'leads@ecolifeeuroasia.com',
      location: 'Location: Central Asia | Kazakhstan | Karaganda city',
      copyright: '© 2025 EkoLifeEuroAsia. All rights reserved'
    }
  }
};
