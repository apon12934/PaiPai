import { Poppins, Anek_Bangla } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/hooks/useAuth';
import { DatabaseProvider } from '@/hooks/useDatabase';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
});

const anekBangla = Anek_Bangla({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['bengali'],
  display: 'swap',
  variable: '--font-anek-bangla',
});

export const metadata = {
  title: 'PaiPai',
  description:
    'PaiPai (পাই পাই) — Track every penny. A modern debt and expense tab tracker with real-time cloud sync across all your devices.',
  keywords: ['debt tracker', 'expense tracker', 'paipai', 'পাই পাই', 'taka', 'finance'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${poppins.variable} ${anekBangla.variable} dark`}>
      <body className="font-sans antialiased bg-[#0B1120] text-slate-100 h-screen overflow-hidden bg-gradient-blobs">
        <AuthProvider>
          <DatabaseProvider>{children}</DatabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
