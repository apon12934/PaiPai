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

  content = content.replace(/dark:text-slate-100 dark:text-slate-700 dark:text-slate-300/g, 'dark:text-slate-300');
  content = content.replace(/dark:text-slate-100 dark:text-slate-400 dark:hover:text-slate-700 dark:text-slate-300/g, 'dark:text-slate-400 dark:hover:text-slate-300');
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});
