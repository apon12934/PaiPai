import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { DatabaseProvider } from '@/hooks/useDatabase';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata = {
  title: 'PaiPai — Debt & Expense Tracker',
  description:
    'PaiPai (পাই পাই) — Track every penny. A modern debt and expense tab tracker with real-time cloud sync across all your devices.',
  keywords: ['debt tracker', 'expense tracker', 'paipai', 'পাই পাই', 'taka', 'finance'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased bg-[#0B1120] text-slate-100 h-screen overflow-hidden bg-gradient-blobs">
        <AuthProvider>
          <DatabaseProvider>{children}</DatabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
