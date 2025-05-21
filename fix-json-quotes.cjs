// Скрипт для исправления кавычек в JSON файлах
const fs = require('fs');
const path = require('path');

// Путь к директории с переводами
const translationsDir = path.join(__dirname, 'src', 'translations');

// Получаем список всех JSON-файлов в директории
const files = fs.readdirSync(translationsDir)
  .filter(file => file.endsWith('.json') && file !== '.translation-hashes.json');

console.log(`🔍 Найдено ${files.length} файлов переводов`);

// Счетчики для статистики
let totalFilesFixed = 0;
let totalReplacements = 0;

// Обрабатываем каждый файл
files.forEach(file => {
  const filePath = path.join(translationsDir, file);
  
  try {
    // Читаем содержимое файла
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Проверяем наличие проблемных кавычек
    if (content.includes('"Platforma tiek būvēta"') || 
        content.includes('"Platform under construction"') ||
        content.includes('"Платформа в разработке"') ||
        content.includes('"Piattaforma in costruzione"') ||
        content.includes('"Plattform im Aufbau"')) {
      
      // Заменяем проблемные кавычки на экранированные
      let newContent = content;
      
      // Заменяем все варианты проблемных строк
      const replacements = [
        { from: '"Platforma tiek būvēta"', to: '\\"Platforma tiek būvēta\\"' },
        { from: '"Platform under construction"', to: '\\"Platform under construction\\"' },
        { from: '"Платформа в разработке"', to: '\\"Платформа в разработке\\"' },
        { from: '"Piattaforma in costruzione"', to: '\\"Piattaforma in costruzione\\"' },
        { from: '"Plattform im Aufbau"', to: '\\"Plattform im Aufbau\\"' }
      ];
      
      let replacementCount = 0;
      
      replacements.forEach(({ from, to }) => {
        if (newContent.includes(from)) {
          newContent = newContent.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), to);
          replacementCount++;
        }
      });
      
      if (replacementCount > 0) {
        // Записываем обновленное содержимое обратно в файл
        fs.writeFileSync(filePath, newContent, 'utf8');
        
        console.log(`✅ ${file}: исправлены проблемные кавычки`);
        
        totalFilesFixed++;
        totalReplacements += replacementCount;
      } else {
        console.log(`ℹ️ ${file}: проблемные строки найдены, но не заменены`);
      }
    } else {
      console.log(`ℹ️ ${file}: проблемных кавычек не найдено`);
    }
    
    // Дополнительная проверка - пробуем распарсить JSON
    try {
      JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (parseError) {
      console.error(`❌ ${file}: JSON невалиден после исправлений: ${parseError.message}`);
      
      // Попытка более агрессивного исправления - замена всех неэкранированных кавычек внутри значений
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Регулярное выражение для поиска неэкранированных кавычек внутри значений JSON
      const regex = /: ?"([^"]*)"([^"]*)"([^"]*)"/g;
      const fixedContent = content.replace(regex, (match, p1, p2, p3) => {
        return `: "${p1}\\"${p2}\\"${p3}"`;
      });
      
      fs.writeFileSync(filePath, fixedContent, 'utf8');
      console.log(`🔧 ${file}: применено агрессивное исправление кавычек`);
      
      // Проверяем еще раз
      try {
        JSON.parse(fs.readFileSync(filePath, 'utf8'));
        console.log(`✅ ${file}: JSON теперь валиден после агрессивного исправления`);
      } catch (e) {
        console.error(`❌ ${file}: JSON все еще невалиден: ${e.message}`);
      }
    }
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${file}: ${error.message}`);
  }
});

console.log(`\n📊 Итоги:`);
console.log(`📝 Обработано файлов: ${files.length}`);
console.log(`🔧 Исправлено файлов: ${totalFilesFixed}`);
console.log(`🔄 Всего замен: ${totalReplacements}`);
