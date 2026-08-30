const fs = require('fs');

let page = fs.readFileSync('src/app/page.js', 'utf8');

// 4. Update the Floating Button
page = page.replace(
  /<a\r?\n\s+href="https:\/\/github\.com\/apon12934\/PaiPai"\r?\n\s+target="_blank"\r?\n\s+rel="noopener noreferrer"/g,
  '<button\n        onClick={() => setHelpModalOpen(true)}'
);
page = page.replace(
  /<\/a>\r?\n\s+<\/div>\r?\n\s+\);\r?\n\}/g,
  '</button>\n    </div>\n  );\n}'
);

fs.writeFileSync('src/app/page.js', page);
