const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.jsx') || dirFile.endsWith('.js')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = walkSync(path.join(__dirname, 'src'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Broad replacements
  content = content.replace(/bg-indigo-600/g, 'bg-slate-900 dark:bg-slate-100');
  content = content.replace(/hover:bg-indigo-500/g, 'hover:bg-slate-800 dark:hover:bg-white');
  
  content = content.replace(/border-indigo-600/g, 'border-slate-900 dark:border-slate-100');
  content = content.replace(/border-indigo-500/g, 'border-slate-900 dark:border-slate-100');
  
  content = content.replace(/text-indigo-600/g, 'text-slate-900 dark:text-slate-100');
  content = content.replace(/text-indigo-500/g, 'text-slate-800 dark:text-slate-200');
  content = content.replace(/text-indigo-400/g, 'text-slate-700 dark:text-slate-300');
  content = content.replace(/hover:text-indigo-400/g, 'hover:text-slate-900 dark:hover:text-white');
  content = content.replace(/hover:text-indigo-600/g, 'hover:text-slate-900 dark:hover:text-white');
  
  content = content.replace(/ring-indigo-500/g, 'ring-slate-900 dark:ring-slate-100');

  content = content.replace(/shadow-indigo-600\/\d+/g, 'shadow-black/20 dark:shadow-white/20');
  content = content.replace(/shadow-indigo-500\/\d+/g, 'shadow-black/20 dark:shadow-white/20');

  content = content.replace(/bg-indigo-100/g, 'bg-slate-200 dark:bg-slate-800');
  content = content.replace(/bg-indigo-50/g, 'bg-slate-100 dark:bg-slate-900');
  content = content.replace(/border-indigo-200/g, 'border-slate-300 dark:border-slate-700');
  content = content.replace(/text-indigo-700/g, 'text-slate-900 dark:text-slate-100');
  content = content.replace(/text-indigo-300/g, 'text-slate-700 dark:text-slate-300');

  // Fix text-white on monochromatic buttons
  // Anywhere we now have "bg-slate-900 dark:bg-slate-100" AND "text-white" (with or without dark prefix)
  // Let's just find "text-white" in lines that contain "bg-slate-900 dark:bg-slate-100" and replace with "text-white dark:text-slate-900"
  
  const lines = content.split('\n');
  const newLines = lines.map(line => {
    if (line.includes('bg-slate-900 dark:bg-slate-100') && line.includes('text-white') && !line.includes('dark:text-slate-900')) {
      return line.replace(/text-white/g, 'text-white dark:text-slate-900');
    }
    return line;
  });
  content = newLines.join('\n');

  // Special cases for SettingsModal where `isSel` logic uses `text-white`
  // `isSel ? 'text-white' : 'text-slate-900 dark:text-slate-100'` -> needs dark:text-slate-900
  if (file.includes('SettingsModal') || file.includes('page.js') || file.includes('PersonItem')) {
    content = content.replace(/'text-white'/g, "'text-white dark:text-slate-900'");
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log('Updated', file);
  }
});
