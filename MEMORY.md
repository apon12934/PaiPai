# PaiPai — Project Context & Memory Guide

> **For Future AI Coding Assistants & Developers**
> This file provides architecture details, code patterns, security constraints, and design decisions for **PaiPai**.

---

## 📌 Project Overview
- **Name**: PaiPai (পাই পাই) — Debt & Tab Expense Tracker
- **Meaning**: "Pai Pai" (পাই পাই হিসাব) is a Bengali expression meaning keeping track of every single penny / pie.
- **Currency**: Bangladeshi Taka (`৳`)
- **Tech Stack**: Next.js 16 (App Router), React 19, TailwindCSS v4, Firebase v11 (Auth + Firestore), Nodemailer, Firebase Admin
- **Deployment**: Vercel / Node.js (Static optimization for pages + Serverless Route Handlers for Auth OTP)
- **Design**: Dark-mode glassmorphism UI with Inter font

---

## 📁 Repository Structure
```
PaiPai/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/
│   │   │       ├── send-otp/route.js     # Serverless OTP dispatcher (Gmail SMTP)
│   │   │       └── verify-otp/route.js   # Serverless OTP validator & user admin
│   │   ├── layout.js                     # Root layout (Inter font, Auth+DB providers)
│   │   ├── page.js                       # Main app page (3-panel tracker)
│   │   ├── privacy/page.js               # Privacy policy route
│   │   └── globals.css                   # Dark theme, glassmorphism, animations
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthModal.jsx             # Login/Signup modal (Google + Email + 6-Digit OTP)
│   │   │   ├── AccountLinkModal.jsx      # Provider linking dialog
│   │   │   └── UserProfileBar.jsx        # Logged-in user bar in sidebar
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx               # Left panel: brand, people, totals
│   │   │   ├── MainPanel.jsx             # Center: balance card, tx form
│   │   │   ├── HistoryPanel.jsx          # Right: transaction history
│   │   │   └── EmptyState.jsx            # Empty selection view
│   │   ├── transactions/
│   │   │   ├── TransactionForm.jsx       # Amount/note form + keyboard shortcuts
│   │   │   └── TransactionCard.jsx       # History item card
│   │   └── ui/
│   │       ├── GlassCard.jsx             # Glassmorphism container
│   │       ├── BalanceCard.jsx           # Gradient balance display
│   │       ├── Modal.jsx                 # Animated modal base
│   │       ├── Button.jsx                # Button variants
│   │       └── PersonItem.jsx            # Sidebar person item
│   ├── hooks/
│   │   ├── useAuth.js                    # Auth context + hook (Google, Email, OTP)
│   │   └── useDatabase.js                # Database context + hook
│   └── lib/
│       ├── firebase.js                   # Firebase Client SDK init
│       ├── auth.js                       # Client auth operations + OTP API clients
│       ├── db.js                         # Firestore sync + localStorage fallback
│       ├── cloudinary.js                 # Cloudinary image cropping & upload
│       └── server/
│           ├── mailer.js                 # Nodemailer Gmail SMTP dispatcher
│           └── firebase-admin.js         # Firebase Admin SDK singleton
├── .env.local                            # Firebase & SMTP secrets (gitignored)
├── .env.example                          # Public env template
├── .gitignore
├── next.config.mjs                       # Next.js config
├── package.json
├── MEMORY.md
└── README.md
```

---

## 🔐 Security & Public Repo Guidelines
1. **Never Commit Secrets**: `.env.local` is gitignored. Use `.env.example` as the public template.
2. **Firebase config uses `NEXT_PUBLIC_` env vars** — not a separate config file.

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
      "type": "gave",
      "note": "Lunch"
    }
  ]
}
```

### Firestore Document Schema
- Collection: `users`
- Document ID: `{user.uid}`
- Fields: `trackerData` (object), `lastUpdated` (ISO string)

### State Management
- `useAuth()` hook: Provides `user`, `loading`, and all auth functions via React Context
- `useDatabase()` hook: Provides `data` (dbState) and `saveData(newData)` via React Context
- Both contexts are wrapped at the root layout level

### Authentication
- Google Sign-In + Email/Password
- Account linking (`linkWithPopup` / `linkWithCredential`)
- Friendly error message mapping for all Firebase auth error codes

---

## 🛠️ Key Conventions for AI Agents
- All UI components use `'use client'` directive
- TailwindCSS v4 for all styling (no CSS modules)
- Dark theme: base `#0A0A0A`, panels `#141414`, monochromatic styling with only rose/emerald flow accents
- Currency: `৳` (Bangladeshi Taka)
- Keyboard shortcuts: Enter = gave, Shift+Enter = received
- Server-side routes: Under `src/app/api/` (Serverless Node.js Route Handlers for OTP and SMTP email dispatch)
- SMTP secrets: Stored strictly in `.env.local` without `NEXT_PUBLIC_` prefixes; NEVER exposed to the client bundle
