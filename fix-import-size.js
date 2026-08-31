const fs = require('fs');

let content = fs.readFileSync('src/app/page.js', 'utf8');

const oldImport = `  const handleImport = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;
      const reader = new FileReader();`;

const newImport = `  const handleImport = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      // Prevent massive file upload memory crash (limit to 2MB)
      if (file.size > 2 * 1024 * 1024) {
        showToast('Backup file is too large! Maximum 2MB allowed.', true);
        event.target.value = '';
        return;
      }
      
      const reader = new FileReader();`;

content = content.replace(oldImport, newImport);

fs.writeFileSync('src/app/page.js', content);
