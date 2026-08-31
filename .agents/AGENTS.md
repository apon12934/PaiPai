# AGENTS.md — Workspace Rules & Instructions for PaiPai

## Workspace Context
- **Project**: PaiPai (Debt & Expense Tracker)
- **Framework**: Next.js 16 (App Router, Static Export)
- **Primary Entry**: [`src/app/page.js`](file:///c:/Users/Apon/Desktop/PaiPai/src/app/page.js)
- **Repository Visibility**: Public Git Repository.

## AI Assistant Rules
1. **Secrets Security**: NEVER output or commit real API keys, credentials, or `.env.local` secrets into the git index. `.env.local` is ignored by `.gitignore`. Always maintain `.env.example` as the clean public template.
2. **Modular Structure**: Keep code organized in React components under `src/components/`, hooks under `src/hooks/`, and utilities under `src/lib/`.
3. **Client Components**: All components using hooks, state, or browser APIs must have `'use client'` directive.
4. **Static Export**: This app uses `output: 'export'` — do NOT use server-side features (cookies, headers, server actions).
5. **Data Integrity**: Always maintain backward compatibility with `localStorage` keys (`paiPaiDB` / `debtTrackerDB`).
6. **Design System**: 
   - **Monochromatic Theme**: Pure black/white/gray scale. 
   - Base dark background is `#0A0A0A` and panels are `#141414`. 
   - Do **NOT** use indigo, purple, or navy accents. 
   - The only accepted colors are pure red (`rose`) and green (`emerald`) for semantic flow (gave/received).
7. **Cloudinary Integration**: Profile pictures are uploaded via unsigned POST requests directly to Cloudinary using HTML5 Canvas for client-side cropping and optimization. Ensure `w_500,h_500,q_auto,f_auto` transformations are applied for delivery.

## Red Team Security Architecture (Implemented)
8. **Cloudinary DoS Protection**: The Cloudinary upload preset relies on a strict **Incoming Transformation** (`c_fill,g_auto,h_500,w_500,f_auto,q_auto`) to crush massive payloads server-side, preventing Denial of Wallet storage exhaustion. Do not attempt to validate file size or format purely on the client.
9. **Firestore Rules**: Database is strictly locked to `request.auth.uid == userId`. Client-side code in `db.js` MUST explicitly reference `doc(db, 'users', user.uid)`.
10. **XSS & Payload Limits**: `DOMPurify` is strictly enforced in `page.js` on all user string inputs (names, transaction notes) before touching React state or Firestore. Hardcoded JS bounds limits (max 5000 transactions, amount < 1B, note < 100 chars) are required to emulate backend validation.
11. **Google OAuth Branding**: The application is officially verified for `paipai.ddns.net`. Any structural changes must not break the `src/app/privacy/page.js` route or the Google Verification metadata tag in `src/app/layout.js`, as these are required to maintain Google Trust & Safety compliance for the login screen.
