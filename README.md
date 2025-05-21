# Ecolife - Форма регистрации

Многоязычная веб-форма регистрации для проекта Ecolife с поддержкой нескольких языков и адаптивным дизайном.

## 🌍 Доступные языки

- Русский (ru)
- Казахский (kk)
- Английский (en)
- Немецкий (de)
- Французский (fr)
- Испанский (es)
- Итальянский (it)
- И еще более 15 языков

## 🚀 Технологии

- React 18 с TypeScript
- Vite для сборки
- i18next для интернационализации
- Tailwind CSS для стилей
- React Hook Form для управления формами
- Framer Motion для анимаций
- React Icons для иконок

## 🛠 Установка и запуск

1. Клонируйте репозиторий:
   ```sh
   git clone <URL_репозитория>
   cd ecolife-registration-form
   ```

2. Установите зависимости:
   ```sh
   npm install
   ```

3. Запустите сервер разработки:
   ```sh
   npm run dev
   ```

4. Откройте http://localhost:5173 в браузере

## 🏗 Сборка для продакшена

```sh
npm run build
```

Собранные файлы будут доступны в папке `dist`.

## 🔄 Система автоперевода и определения языка

### Определение языка пользователя

Система автоматически определяет язык пользователя в следующем порядке:

1. **URL-параметр**: Проверяется наличие параметра `?lang=XX` в URL
2. **Язык браузера**: Используется `navigator.languages` или `navigator.language`
3. **Язык по умолчанию**: Если ничего не найдено, используется казахский (kk)

```typescript
// Функция определения языка в src/i18n.ts
function detectUserLanguage(): string {
  const langs = getSupportedLanguages();

  // Проверка URL-параметра
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang && langs.includes(urlLang)) {
    return urlLang;
  }

  // Проверка языка браузера
  const browserLangs = navigator.languages || [navigator.language];
  for (const lang of browserLangs) {
    const langCode = lang.split('-')[0].toLowerCase();
    if (langs.includes(langCode)) {
      return langCode;
    }
  }

  // Язык по умолчанию
  return 'kk';
}
```

### Загрузка переводов

Переводы загружаются динамически с использованием динамического импорта:

```typescript
// Асинхронная функция для загрузки перевода
export async function loadTranslation(lang: string = detectUserLanguage()): Promise<Translations> {
  // Проверка кэша
  if (translationsCache[lang]) {
    return translationsCache[lang];
  }
  
  try {
    // Динамический импорт файла перевода
    const translation = await import(`./translations/${lang}.json`);
    translationsCache[lang] = translation as Translations;
    return translation as Translations;
  } catch (error) {
    // Fallback на английский или казахский
    if (lang !== 'en') {
      return loadTranslation('en');
    }
    if (lang !== 'kk') {
      return loadTranslation('kk');
    }
    throw new Error(`Не удалось загрузить перевод для языка ${lang}`);
  }
}
```

### Использование переводов в компонентах

Для использования переводов в компонентах используется класс `I18n` с методом `t(key)`:

```typescript
// Пример использования
import i18n from '@/i18n';

// В компоненте
const translatedText = i18n.t('navbar.home');
```

### Добавление нового языка

Для добавления нового языка:

1. Создайте файл `src/translations/XX.json` (где XX - код языка)
2. Скопируйте структуру из существующего файла перевода (например, `en.json`)
3. Переведите все строки на новый язык
4. Добавьте код языка в массив `supportedLangs` в функции `getSupportedLanguages()` в файле `src/i18n.ts`

## 📝 Форма регистрации

### Структура компонента

Компонент формы находится в `src/components/RegistrationForm.tsx` и принимает объект переводов через пропсы.

### Валидация формы

Форма имеет следующие проверки:

1. **Обязательные поля**: страна, компания, отрасль, email
2. **Валидация email**: проверка на корректный формат email

```typescript
// Пример валидации в handleSubmit
if (!formData.country || !formData.company || !formData.industry || !formData.email) {
  toast({
    title: translations.errorMessage,
    description: "Please fill in all required fields.",
    variant: "destructive"
  });
  return;
}

// Валидация email
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(formData.email)) {
  toast({
    title: translations.errorMessage,
    description: "Please enter a valid email address.",
    variant: "destructive"
  });
  return;
}
```

### Отправка формы

Отправка формы происходит через функцию `handleFormSubmission` из модуля `@/api/formHandler`:

```typescript
const result = await handleFormSubmission({
  ...formData
});

if (result.success) {
  toast({
    title: "Успех!",
    description: translations.successMessage,
  });
  
  // Сбрасываем форму
  setFormData({
    country: '',
    company: '',
    industry: '',
    email: '',
    phone: '',
    hasCertificate: false,
    description: ''
  });
}
```

### Модификация формы

Для добавления новых полей в форму:

1. Добавьте новое поле в интерфейс `RegistrationFormProps`
2. Добавьте новое поле в состояние `formData`
3. Добавьте соответствующий элемент формы в JSX
4. Добавьте переводы для нового поля во все языковые файлы

## 🌐 SEO и производительность

### Мета-теги в index.html

В файле `index.html` настроены следующие мета-теги для SEO:

- `title`: Заголовок страницы
- `description`: Описание страницы
- `keywords`: Ключевые слова
- `og:*`: Open Graph теги для социальных сетей
- `twitter:*`: Теги для Twitter

### Файл .htaccess

Файл `.htaccess` настроен для:

- Перенаправления HTTP на HTTPS
- Сжатия контента (Gzip)
- Кэширования статических ресурсов
- Обработки SPA-маршрутизации
- Добавления заголовков безопасности

## 📁 Структура проекта

```
src/
├── api/             # API-интеграции
├── components/      # React-компоненты
│   ├── ui/          # UI-компоненты (кнопки, инпуты и т.д.)
│   └── ...          # Основные компоненты страницы
├── translations/    # Файлы переводов (.json)
├── types/          # TypeScript типы
├── utils/          # Вспомогательные функции
├── i18n.ts         # Система интернационализации
└── main.tsx        # Точка входа приложения
```

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для вашей функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте изменения в ваш форк (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект лицензирован по лицензии MIT - подробности см. в файле [LICENSE](LICENSE).

---

Создано с ❤️ для проекта Ecolife

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/ee4d483f-4735-4492-9d77-3397ec46f8f8) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
