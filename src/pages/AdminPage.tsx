import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import config from '@/config';
import { useTranslation } from 'react-i18next';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Список доступных языков
const availableLanguages = [
  { code: 'ru', name: 'Русский' },
  { code: 'kk', name: 'Қазақша' },
  { code: 'en', name: 'English' },
  { code: 'el', name: 'Ελληνικά' },
  { code: 'de', name: 'Deutsch' },
  { code: 'fr', name: 'Français' },
  { code: 'tr', name: 'Türkçe' },
  { code: 'pl', name: 'Polski' },
  { code: 'it', name: 'Italiano' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'bg', name: 'Български' },
  { code: 'ro', name: 'Română' },
  { code: 'hu', name: 'Magyar' },
  { code: 'cs', name: 'Čeština' },
  { code: 'sk', name: 'Slovenčina' },
  { code: 'sl', name: 'Slovenščina' },
  { code: 'hr', name: 'Hrvatski' },
  { code: 'sr', name: 'Српски' },
  { code: 'bs', name: 'Bosanski' },
  { code: 'mk', name: 'Македонски' },
  { code: 'sq', name: 'Shqip' },
  { code: 'lv', name: 'Latviešu' },
  { code: 'lt', name: 'Lietuvių' },
  { code: 'et', name: 'Eesti' }
];

const AdminPage: React.FC = () => {
  const { toast } = useToast();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [emailTo, setEmailTo] = useState(config.emailTo);
  const [selectedLanguage, setSelectedLanguage] = useState('ru');
  const [translationData, setTranslationData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [allTranslations, setAllTranslations] = useState<Record<string, Record<string, any>>>({});
  const [isTranslating, setIsTranslating] = useState(false);
  const [editingPath, setEditingPath] = useState<string[]>([]);
  const [editingValue, setEditingValue] = useState<string>('');

  // Функция выхода из админки
  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    navigate('/admin-login');
  };

  // Загрузка данных перевода при изменении выбранного языка
  useEffect(() => {
    const loadTranslation = async () => {
      setIsLoading(true);
      try {
        // Динамический импорт файла перевода
        const translationModule = await import(`../translations/${selectedLanguage}.json`);
        setTranslationData(translationModule.default);
      } catch (error) {
        console.error(`Failed to load translation for ${selectedLanguage}:`, error);
        toast({
          title: 'Ошибка',
          description: `Не удалось загрузить перевод для ${selectedLanguage}`,
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslation();
  }, [selectedLanguage, toast]);
  
  // Загрузка всех переводов при первом рендере
  useEffect(() => {
    const loadAllTranslations = async () => {
      const translations: Record<string, Record<string, any>> = {};
      
      for (const lang of availableLanguages) {
        try {
          const translationModule = await import(`../translations/${lang.code}.json`);
          translations[lang.code] = translationModule.default;
        } catch (error) {
          console.error(`Failed to load translation for ${lang.code}:`, error);
        }
      }
      
      setAllTranslations(translations);
    };
    
    loadAllTranslations();
  }, []);

  // Сохранение настроек email
  const saveEmailSettings = () => {
    try {
      // В реальном приложении здесь будет код для сохранения настроек на сервере
      // Для демонстрации просто обновляем локальную конфигурацию
      config.emailTo = emailTo;
      
      toast({
        title: 'Успех',
        description: 'Настройки email успешно сохранены',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось сохранить настройки email',
        variant: 'destructive',
      });
    }
  };

  // Сохранение переводов
  const saveTranslations = async () => {
    setIsLoading(true);
    try {
      // В реальном приложении здесь будет код для сохранения переводов на сервере
      // Для демонстрации просто показываем сообщение об успехе
      
      toast({
        title: 'Успех',
        description: `Переводы для ${selectedLanguage} успешно сохранены`,
      });
      
      // Обновляем переводы в i18n
      i18n.addResourceBundle(selectedLanguage, 'translation', translationData, true, true);
      
      // Если текущий язык - тот, который мы редактировали, применяем изменения
      if (i18n.language === selectedLanguage) {
        i18n.reloadResources([selectedLanguage]);
      }
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: `Не удалось сохранить переводы для ${selectedLanguage}`,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Обновление значения в объекте перевода
  const updateTranslationValue = (path: string[], value: string) => {
    // Запоминаем путь и значение для возможного перевода
    setEditingPath(path);
    setEditingValue(value);
    
    // Создаем копию данных перевода
    const updatedData = { ...translationData };
    
    // Находим целевой объект и обновляем значение
    let current = updatedData;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (!current[key]) {
        current[key] = {};
      }
      current = current[key];
    }
    
    // Устанавливаем новое значение
    current[path[path.length - 1]] = value;
    
    // Обновляем состояние
    setTranslationData(updatedData);
  };
  
  // Функция для перевода текста через Google Translate API
  const translateText = async (text: string, sourceLang: string, targetLang: string): Promise<string> => {
    try {
      const response = await axios.get('https://translation.googleapis.com/language/translate/v2', {
        params: {
          q: text,
          target: targetLang,
          source: sourceLang,
          key: config.googleApiKey
        }
      });
      
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      console.error('Ошибка при переводе:', error);
      return text; // Возвращаем исходный текст в случае ошибки
    }
  };
  
  // Функция для получения значения по пути в объекте
  const getValueByPath = (obj: any, path: string[]): any => {
    let current = obj;
    for (const key of path) {
      if (current === undefined || current === null) return undefined;
      current = current[key];
    }
    return current;
  };
  
  // Функция для установки значения по пути в объекте
  const setValueByPath = (obj: any, path: string[], value: any): void => {
    let current = obj;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (current[key] === undefined || current[key] === null) {
        current[key] = {};
      }
      current = current[key];
    }
    current[path[path.length - 1]] = value;
  };
  
  // Функция для перевода и обновления всех языков
  const translateAndUpdateAllLanguages = async () => {
    if (!editingPath.length || !editingValue) {
      toast({
        title: 'Внимание',
        description: 'Сначала измените какое-либо поле перевода',
        variant: 'default',
      });
      return;
    }
    
    setIsTranslating(true);
    
    try {
      // Создаем копию всех переводов
      const updatedTranslations = { ...allTranslations };
      
      // Определяем материнский язык (kk или ru)
      const motherLanguage = selectedLanguage === 'kk' || selectedLanguage === 'ru' 
        ? selectedLanguage 
        : 'kk'; // По умолчанию используем казахский
      
      // Получаем текст для перевода
      const textToTranslate = editingValue;
      
      // Устанавливаем значение для текущего языка
      if (!updatedTranslations[selectedLanguage]) {
        updatedTranslations[selectedLanguage] = {};
      }
      setValueByPath(updatedTranslations[selectedLanguage], editingPath, textToTranslate);
      
      // Переводим на все поддерживаемые языки
      for (const lang of availableLanguages) {
        // Пропускаем текущий язык, так как он уже обновлен
        if (lang.code === selectedLanguage) continue;
        
        try {
          // Переводим текст
          const translatedText = await translateText(textToTranslate, motherLanguage, lang.code);
          
          // Создаем объект для языка, если он не существует
          if (!updatedTranslations[lang.code]) {
            updatedTranslations[lang.code] = {};
          }
          
          // Устанавливаем переведенное значение
          setValueByPath(updatedTranslations[lang.code], editingPath, translatedText);
          
          console.log(`Перевод на ${lang.code} завершен: ${translatedText}`);
        } catch (error) {
          console.error(`Ошибка при переводе на ${lang.code}:`, error);
        }
      }
      
      // Обновляем состояние всех переводов
      setAllTranslations(updatedTranslations);
      
      // Обновляем текущий перевод
      setTranslationData(updatedTranslations[selectedLanguage]);
      
      // Сохраняем переводы (здесь должен быть код для сохранения на сервере)
      // В демо-версии просто показываем сообщение об успехе
      
      toast({
        title: 'Успех',
        description: 'Переводы успешно обновлены для всех языков',
      });
      
      // Очищаем путь и значение редактирования
      setEditingPath([]);
      setEditingValue('');
    } catch (error) {
      console.error('Ошибка при переводе:', error);
      toast({
        title: 'Ошибка',
        description: 'Не удалось выполнить перевод',
        variant: 'destructive',
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Рекурсивный рендеринг полей перевода
  const renderTranslationFields = (
    data: Record<string, any>,
    path: string[] = [],
    level: number = 0
  ): React.ReactNode => {
    return Object.entries(data).map(([key, value]) => {
      const currentPath = [...path, key];
      const fieldId = currentPath.join('.');
      
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={fieldId} className="mt-4">
            <h3 className="text-md font-semibold mb-2">{key}</h3>
            <div className="pl-4 border-l-2 border-gray-200">
              {renderTranslationFields(value, currentPath, level + 1)}
            </div>
          </div>
        );
      }
      
      return (
        <div key={fieldId} className="mb-4">
          <Label htmlFor={fieldId} className="text-sm font-medium">
            {key}
          </Label>
          {value && value.length > 100 ? (
            <Textarea
              id={fieldId}
              value={value}
              onChange={(e) => updateTranslationValue(currentPath, e.target.value)}
              className="mt-1"
              rows={3}
            />
          ) : (
            <Input
              id={fieldId}
              value={value}
              onChange={(e) => updateTranslationValue(currentPath, e.target.value)}
              className="mt-1"
            />
          )}
        </div>
      );
    });
  };

  // Применение переводов
  const applyTranslation = () => {
    try {
      i18n.changeLanguage(selectedLanguage);
      toast({
        title: 'Успех',
        description: `Язык изменен на ${selectedLanguage}`,
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось применить перевод',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Панель администратора</h1>
        <Button variant="outline" onClick={handleLogout}>Выйти</Button>
      </div>
      <Tabs defaultValue="email">
        <TabsList className="mb-4">
          <TabsTrigger value="email">Настройки Email</TabsTrigger>
          <TabsTrigger value="translations">Управление переводами</TabsTrigger>
        </TabsList>
        
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Настройки Email</CardTitle>
              <CardDescription>
                Настройте адрес электронной почты для получения заявок с формы регистрации
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailTo">Email для получения заявок</Label>
                  <Input
                    id="emailTo"
                    value={emailTo}
                    onChange={(e) => setEmailTo(e.target.value)}
                    placeholder="example@example.com"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveEmailSettings}>Сохранить настройки</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="translations">
          <Card>
            <CardHeader>
              <CardTitle>Управление переводами</CardTitle>
              <CardDescription>
                Редактируйте переводы для различных языков
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Label htmlFor="language" className="min-w-32">Выберите язык</Label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={setSelectedLanguage}
                  >
                    <SelectTrigger id="language" className="w-60">
                      <SelectValue placeholder="Выберите язык" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableLanguages.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={applyTranslation}>
                    Применить перевод
                  </Button>
                  <Button 
                    onClick={translateAndUpdateAllLanguages} 
                    disabled={isTranslating || !editingPath.length}
                    variant="outline"
                  >
                    {isTranslating ? 'Переводится...' : 'Перевести и опубликовать'}
                  </Button>
                </div>
                
                <Separator className="my-4" />
                
                {isLoading ? (
                  <div className="text-center py-4">Загрузка переводов...</div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto p-4">
                    {renderTranslationFields(translationData)}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex space-x-4">
                <Button onClick={saveTranslations} disabled={isLoading || isTranslating}>
                  Сохранить переводы
                </Button>
                <Button 
                  onClick={translateAndUpdateAllLanguages} 
                  disabled={isTranslating || !editingPath.length}
                  variant="outline"
                >
                  {isTranslating ? 'Переводится...' : 'Перевести и опубликовать'}
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
