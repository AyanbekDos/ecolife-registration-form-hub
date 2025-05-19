const puppeteer = require('puppeteer');
const path = require('path');

// Конфигурация тестов
const testCases = [
  { name: 'Russian', languages: ['ru', 'en-US', 'en'], expected: 'ru' },
  { name: 'Kazakh', languages: ['kk', 'ru', 'en'], expected: 'kk' },
  { name: 'English', languages: ['en-US', 'en'], expected: 'en' },
  { name: 'German', languages: ['de', 'en'], expected: 'kk' }, // Должен использовать kk как дефолтный
  { name: 'French', languages: ['fr', 'en'], expected: 'kk' },  // Должен использовать kk как дефолтный
  { name: 'Unsupported Language', languages: ['ja', 'zh'], expected: 'kk' } // Неподдерживаемый язык
];

async function runTests() {
  const browser = await puppeteer.launch({ headless: false });
  
  try {
    for (const testCase of testCases) {
      console.log(`\n--- Тестируем ${testCase.name} (${testCase.languages.join(', ')}) ---`);
      
      const context = await browser.createIncognitoBrowserContext();
      
      // Устанавливаем языки для браузера
      await context.overridePermissions('file://', []);
      await context.overridePermissions('http://localhost:3000', []);
      
      // Создаем страницу с настройками языка
      const page = await context.newPage();
      await page.setExtraHTTPHeaders({
        'Accept-Language': testCase.languages.join(',')
      });
      
      // Загружаем тестовую страницу
      const filePath = path.join('file://', __dirname, 'test-lang.html');
      await page.goto(filePath, { waitUntil: 'networkidle0' });
      
      // Получаем результат определения языка
      const detectedLang = await page.evaluate(() => {
        return document.getElementById('browserLang').textContent;
      });
      
      // Проверяем результат
      const detectedLangShort = detectedLang.split('-')[0];
      const isSuccess = detectedLangShort === testCase.expected;
      
      console.log(`Определенный язык: ${detectedLang}`);
      console.log(`Ожидаемый язык: ${testCase.expected}`);
      console.log(`Результат: ${isSuccess ? '✅ УСПЕХ' : '❌ ОШИБКА'}`);
      
      // Делаем скриншот
      await page.screenshot({ path: `test-result-${testCase.name.toLowerCase().replace(/\s+/g, '-')}.png` });
      
      await page.close();
      await context.close();
    }
  } catch (error) {
    console.error('Ошибка при выполнении тестов:', error);
  } finally {
    await browser.close();
  }
}

// Запускаем тесты
runTests().then(() => {
  console.log('\nВсе тесты завершены!');  
}).catch(console.error);
