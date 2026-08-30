const fs = require('fs');
let css = fs.readFileSync('src/app/globals.css', 'utf8');

const missingCSS = `
.animate-modal-pop-out {
  animation: custom-modal-pop-out 0.15s cubic-bezier(0.4, 0, 1, 1) forwards;
}

/* BASE BODY STYLES */
html, body {
  font-family: var(--font-sans);
  background-color: #0A0A0A;
  color: #F8FAFC;
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html.light, html.light body {
  background-color: #F8F9FE;`;

css = css.replace(/html\.light, html\.light body \{\s*background-color: #F8F9FE;/, missingCSS);
fs.writeFileSync('src/app/globals.css', css);
