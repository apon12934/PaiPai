const fs = require('fs');

let content = fs.readFileSync('src/components/settings/SettingsModal.jsx', 'utf8');

// Fix double dark text declarations
content = content.replace(/dark:text-white dark:text-slate-900/g, 'dark:text-white');

fs.writeFileSync('src/components/settings/SettingsModal.jsx', content);
