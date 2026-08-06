# PaiPai (পাই পাই) — Debt & Tab Tracker

A modern, premium debt and expense tracking web app with real-time cloud sync across all your devices.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## Features

- ৳ **Balance Tracking**: Net balances per person and overall grand total
- 🔐 **Multi-Device Sync**: Sign in with Google or Email/Password, data syncs instantly
- 🔗 **Account Linking**: Connect both Google and Email login to one account
- 🌙 **Premium Dark UI**: Glassmorphism design with gradient accents
- ⌨️ **Keyboard Shortcuts**: Enter = I Gave, Shift+Enter = I Received
- 📁 **Backup**: Export & import JSON backups
- ⚡ **Offline Support**: Works locally when signed out, auto-migrates data on first login

## Quick Start

1. **Clone & install**:
   ```bash
   git clone https://github.com/apon12934/PaiPai.git
   cd PaiPai
   npm install
   ```

2. **Set up Firebase credentials**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase config values in `.env.local`.

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Tech Stack

- **Framework**: Next.js 15 (App Router, Static Export)
- **UI**: React 19, TailwindCSS v4
- **Backend**: Firebase Authentication + Cloud Firestore
- **Hosting**: Vercel

## License
MIT License.
