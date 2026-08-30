# PaiPai (পাই পাই) - Debt & Tab Tracker

A modern, highly-polished debt and expense tracking web app with real-time cloud sync across all your devices.

![Next.js](https://img.shields.io/badge/Next.js-16-black) ![Firebase](https://img.shields.io/badge/Firebase-Auth%20%2B%20Firestore-orange) ![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)

## Features

- ৳ **Balance Tracking**: Track net balances per person and your overall grand total.
- ☁️ **Multi-Device Sync**: Sign in with Google or Email/Password, data syncs instantly to Firestore.
- 🔗 **Account Linking**: Connect both Google and Email login to a single account.
- 🎨 **Monochromatic & Minimalist UI**: Sleek black-and-white theme featuring dynamic light/dark/system modes. Semantic red/green accents emphasize cash flow.
- 📱 **Mobile Optimized**: True responsive design with a clean single-page architecture for mobile views.
- 🖼️ **Cloudinary Avatars**: Fully optimized client-side image cropping and fast Cloudinary-backed profile picture uploads.
- ⌨️ **Keyboard Shortcuts**: `Enter` = I Gave, `Shift + Enter` = I Received.
- 💾 **Backup**: Export & import local JSON backups.
- 🔌 **Offline Support**: Works locally when signed out; seamlessly auto-migrates local data on your first login.

## Quick Start

1. **Clone & install**:
   ```bash
   git clone https://github.com/apon12934/PaiPai.git
   cd PaiPai
   npm install
   ```

2. **Set up Environment Variables**:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase config values and your Cloudinary Cloud Name in `.env.local`.

3. **Run locally**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Tech Stack

- **Framework**: Next.js 16 (App Router, Static Export)
- **UI**: React 19, TailwindCSS v4, Lucide Icons
- **Backend**: Firebase Authentication + Cloud Firestore
- **Media**: Cloudinary (unsigned image uploads)
- **Hosting**: Vercel

## License
MIT License.
