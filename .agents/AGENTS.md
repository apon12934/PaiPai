# AGENTS.md — Workspace Rules & Instructions for PaiPai

## Workspace Context
- **Project**: PaiPai (Debt & Expense Tracker)
- **Framework**: Next.js 15 (App Router, Static Export)
- **Primary Entry**: [`src/app/page.js`](file:///c:/Users/Apon/Desktop/PaiPai/src/app/page.js)
- **Repository Visibility**: Public Git Repository.

## AI Assistant Rules
1. **Secrets Security**: NEVER output or commit real API keys, credentials, or `.env.local` secrets into the git index. `.env.local` is ignored by `.gitignore`. Always maintain `.env.example` as the clean public template.
2. **Modular Structure**: Keep code organized in React components under `src/components/`, hooks under `src/hooks/`, and utilities under `src/lib/`.
3. **Client Components**: All components using hooks, state, or browser APIs must have `'use client'` directive.
4. **Static Export**: This app uses `output: 'export'` — do NOT use server-side features (cookies, headers, server actions).
5. **Data Integrity**: Always maintain backward compatibility with `localStorage` keys (`paiPaiDB` / `debtTrackerDB`).
6. **Design System**: Dark theme with glassmorphism. Use TailwindCSS v4 classes. Base color: `#0B1120`.
