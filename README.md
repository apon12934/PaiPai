# PaiPai (পাই পাই) — Debt & Tab Tracker

PaiPai is a sleek, responsive debt and expense tab tracking web application designed to help you keep accurate tabs on money owed and received across friends, family, and colleagues.

![PaiPai](https://img.shields.io/badge/App-PaiPai-indigo) ![License](https://img.shields.io/badge/License-MIT-blue)

## Features

- ৳ **Bangladeshi Taka & Currency Balance Tracking**: See net overall balance and individual person tabs at a glance.
- 🔐 **Multi-Device Cloud Sync**: Log in from any phone, laptop, or tablet.
- 🌐 **Google Sign-In & Email/Password**: Log in via Google or Email/Password, or link both to one account.
- 📁 **Offline First & Backup Export**: Works offline locally and allows 1-click JSON backup export & import.
- 📐 **Resizable 3-Pane UI**: Split-pane interface with draggable resizers.

## Setup Instructions for Developers

1. **Clone the repository**:
   ```bash
   git clone https://github.com/apon12934/PaiPai.git
   cd PaiPai
   ```

2. **Set up Firebase Credentials**:
   - Copy `js/firebase-config.sample.js` to `js/firebase-config.js`:
     ```bash
     cp js/firebase-config.sample.js js/firebase-config.js
     ```
   - Open `js/firebase-config.js` and paste your Firebase project credentials from [Firebase Console](https://console.firebase.google.com/).

3. **Run locally**:
   - Open `index.html` in any web browser, or use VS Code Live Server / `npx serve`.

## License
MIT License.
