# PaiPai — Project Context & Memory Guide

> **For Future AI Coding Assistants & Developers**  
> This file provides architecture details, code patterns, security constraints, and design decisions for **PaiPai**.

---

## 📌 Project Overview
- **Name**: PaiPai (পাই পাই) — Debt & Tab Expense Tracker
- **Meaning**: "Pai Pai" (পাই পাই হিসাব) is a Bengali expression meaning keeping track of every single penny / pie.
- **Currency**: Bangladeshi Taka (`৳`)
- **Tech Stack**: HTML5, Vanilla JavaScript (ES6 Modules), TailwindCSS (CDN), Firebase v10/v11 (Auth + Firestore).

---

## 📁 Repository Structure
```
PaiPai/
├── index.html                   # Main application markup & UI layout
├── css/
│   └── styles.css               # Scrollbar styling, resizer panes, animations
├── js/
│   ├── firebase-config.js       # User Firebase API config (Ignored in .gitignore)
│   ├── firebase-config.sample.js# Public sample template for Firebase config
│   ├── auth.js                  # Google Auth, Email Auth & Account Linking
│   ├── db.js                    # Firestore Real-time Sync & LocalStorage fallback
│   └── app.js                   # Application state manager & DOM UI controller
├── .gitignore                   # Excludes secrets (js/firebase-config.js, .env)
├── MEMORY.md                    # Project context guide for AI agents & contributors
└── README.md                    # Public documentation and setup guide
```

---

## 🔐 Security & Public Repo Guidelines
1. **Never Commit Secrets**:
   - `js/firebase-config.js` is listed in `.gitignore`.
   - Always commit updates to `js/firebase-config.sample.js` if adding new config variables.
   - Do NOT commit hardcoded API keys or service accounts.

---

## 🏗️ Architecture & Data Patterns

### Data Model (`dbState`)
```json
{
  "Person Name": [
    {
      "id": "1722958900000",
      "date": "2026-08-06T13:40:00.000Z",
      "amount": 500.00,
      "type": "gave", // "gave" | "received"
      "note": "Lunch & snacks"
    }
  ]
}
```

### Firestore Document Schema
- Collection: `users`
- Document ID: `{user.uid}`
- Field: `trackerData` (object holding the full `dbState`)

### Real-Time Sync Strategy
- When **Logged In**: `db.js` listens to Firestore (`onSnapshot`). Updates save to Firestore and update `localStorage` as offline fallback cache. Auto-migrates `localStorage` data to Firestore on first login.
- When **Logged Out**: `db.js` uses `localStorage` (`paiPaiDB`).

### Authentication & Account Linking
- Supports both **Google Sign-In** and **Email & Password**.
- Allows users to link both methods (`linkWithPopup` / `linkWithCredential`) under the account settings dialog so they can access the same data via either login method.

---

## 🛠️ Key Conventions for AI Agents
- Preserve ES6 module structure (`type="module"` in script tags).
- Do not collapse JavaScript back into `index.html`.
- Maintain currency formatting (`৳`).
- Keep responsive split-pane resizer functionality working.
