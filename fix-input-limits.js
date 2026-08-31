const fs = require('fs');

// 1. Sidebar.jsx Add Contact
let sidebar = fs.readFileSync('src/components/layout/Sidebar.jsx', 'utf8');
sidebar = sidebar.replace(
  /type="text"\n\s*autoFocus\n\s*placeholder="Contact name..."/g,
  'type="text"\n              autoFocus\n              maxLength={30}\n              placeholder="Contact name..."'
);
fs.writeFileSync('src/components/layout/Sidebar.jsx', sidebar);

// 2. page.js Add Contact (Mobile)
let page = fs.readFileSync('src/app/page.js', 'utf8');
page = page.replace(
  /placeholder="New contact name..."\n\s*value=\{newMobilePersonName\}/g,
  'placeholder="New contact name..."\n                  maxLength={30}\n                  value={newMobilePersonName}'
);
fs.writeFileSync('src/app/page.js', page);

// 3. TransactionForm.jsx inputs
let txForm = fs.readFileSync('src/components/transactions/TransactionForm.jsx', 'utf8');
txForm = txForm.replace(
  /step="0\.01"\n\s*value=\{amount\}/g,
  'step="0.01"\n          max="999999999"\n          value={amount}'
);
txForm = txForm.replace(
  /type="text"\n\s*value=\{note\}/g,
  'type="text"\n          maxLength={60}\n          value={note}'
);
fs.writeFileSync('src/components/transactions/TransactionForm.jsx', txForm);
