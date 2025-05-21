// Скрипт для удаления &quot; из всех файлов переводов
const fs = require('fs');
const path = require('path');

// Путь к директории с переводами
const translationsDir = path.join(__dirname, 'src', 'translations');

// Получаем список всех JSON-файлов в директории
const files = fs.readdirSync(translationsDir)
  .filter(file => file.endsWith('.json'));

console.log(`🔍 Найдено ${files.length} файлов переводов`);

// Счетчики для статистики
let totalFilesFixed = 0;
let totalReplacements = 0;

// Обрабатываем каждый файл
files.forEach(file => {
  const filePath = path.join(translationsDir, file);
  
  // Читаем содержимое файла
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Считаем количество замен
  const occurrences = (content.match(/&quot;/g) || []).length;
  
  if (occurrences > 0) {
    // Заменяем &quot; на "
    const newContent = content.replace(/&quot;/g, '"');
    
    // Записываем обновленное содержимое обратно в файл
    fs.writeFileSync(filePath, newContent, 'utf8');
    
    console.log(`✅ ${file}: заменено ${occurrences} вхождений &quot;`);
    
    totalFilesFixed++;
    totalReplacements += occurrences;
  } else {
    console.log(`ℹ️ ${file}: вхождений &quot; не найдено`);
  }
});

console.log(`\n📊 Итоги:`);
console.log(`📝 Обработано файлов: ${files.length}`);
console.log(`🔧 Исправлено файлов: ${totalFilesFixed}`);
console.log(`🔄 Всего замен: ${totalReplacements}`);
