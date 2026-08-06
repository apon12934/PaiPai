# AGENTS.md — Workspace Rules & Instructions for PaiPai

## Workspace Context
- **Project**: PaiPai (Debt & Expense Tracker)
- **Primary Entry**: [`index.html`](file:///c:/Users/Apon/Desktop/PaiPai/index.html)
- **Repository Visibility**: Public Git Repository.

## AI Assistant Rules
1. **Secrets Security**: NEVER output or commit real API keys, credentials, or `.env` secrets into the git index. `js/firebase-config.js` is ignored by `.gitignore`. Always maintain `js/firebase-config.sample.js` as the clean public sample template.
2. **Modular Structure**: Keep code organized in ES6 modules under `js/` and styles under `css/`.
3. **Data Integrity**: Always maintain backward compatibility with `localStorage` keys (`paiPaiDB` / `debtTrackerDB`).
