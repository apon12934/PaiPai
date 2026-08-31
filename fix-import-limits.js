const fs = require('fs');

let content = fs.readFileSync('src/app/page.js', 'utf8');

const oldBlock = `              // Validate every single transaction
              for (const tx of txs) {
                if (typeof tx !== 'object' || tx === null) throw new Error('Transaction must be an object');
                if (typeof tx.id !== 'string') throw new Error('Transaction ID must be a string');
                if (typeof tx.date !== 'string') throw new Error('Transaction date must be a string');
                if (typeof tx.amount !== 'number' || isNaN(tx.amount)) throw new Error('Transaction amount must be a valid number');
                if (tx.type !== 'gave' && tx.type !== 'received') throw new Error('Transaction type must be gave or received');
                if (tx.note !== undefined && typeof tx.note !== 'string') throw new Error('Transaction note must be a string');
              }`;

const newBlock = `              // Validate every single transaction
              if (txs.length > 5000) throw new Error('Too many transactions for contact: ' + key);
              if (key.length > 50) throw new Error('Contact name too long: ' + key);
              
              for (const tx of txs) {
                if (typeof tx !== 'object' || tx === null) throw new Error('Transaction must be an object');
                if (typeof tx.id !== 'string' || tx.id.length > 50) throw new Error('Invalid Transaction ID');
                if (typeof tx.date !== 'string' || tx.date.length > 50) throw new Error('Invalid Transaction date');
                if (typeof tx.amount !== 'number' || isNaN(tx.amount) || tx.amount <= 0 || tx.amount > 999999999) throw new Error('Transaction amount must be between 0.01 and 999,999,999');
                if (tx.type !== 'gave' && tx.type !== 'received') throw new Error('Transaction type must be gave or received');
                if (tx.note !== undefined) {
                  if (typeof tx.note !== 'string' || tx.note.length > 100) throw new Error('Transaction note too long');
                }
              }`;

content = content.replace(oldBlock, newBlock);

fs.writeFileSync('src/app/page.js', content);
