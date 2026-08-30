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
    <html lang="en" className={`${poppins.variable} ${anekBangla.variable} dark`} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = localStorage.getItem('theme');
                if (!theme) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                if (theme === 'light') {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.classList.add('light');
                } else {
                  document.documentElement.classList.add('dark');
                  document.documentElement.classList.remove('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="font-sans antialiased h-screen overflow-hidden bg-gradient-blobs">
        <AuthProvider>
          <DatabaseProvider>{children}</DatabaseProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
