const fs = require('fs');

let page = fs.readFileSync('src/app/page.js', 'utf8');

// 1. Import HelpModal
page = page.replace(
  "import SettingsModal from '@/components/settings/SettingsModal';",
  "import SettingsModal from '@/components/settings/SettingsModal';\nimport HelpModal from '@/components/ui/HelpModal';"
);

// 2. Add state
page = page.replace(
  "const [settingsModalOpen, setSettingsModalOpen] = useState(false);",
  "const [settingsModalOpen, setSettingsModalOpen] = useState(false);\n  const [helpModalOpen, setHelpModalOpen] = useState(false);"
);

// 3. Render Modal
page = page.replace(
  "{/* Global Confirmation Modal */}",
  "<HelpModal isOpen={helpModalOpen} onClose={() => setHelpModalOpen(false)} />\n\n      {/* Global Confirmation Modal */}"
);

// 4. Update the Floating Button
page = page.replace(
  /<a\n\s+href="https:\/\/github\.com\/apon12934\/PaiPai"\n\s+target="_blank"\n\s+rel="noopener noreferrer"/g,
  '<button\n        onClick={() => setHelpModalOpen(true)}'
);
page = page.replace(
  /<\/a>\n\s+<\/div>\n\s+\);\n\}/g,
  '</button>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/app/page.js', page);
