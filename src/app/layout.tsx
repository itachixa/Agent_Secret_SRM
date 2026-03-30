import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/lib/context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'TogoIndia - Communauté togolaise en Inde',
  description: 'La plateforme qui connecte les étudiants togolais en Inde. Profils, feed, mentorat, opportunités et plus encore.',
  keywords: 'Togo, Inde, étudiants, communauté, SRM, IIT, Delhi, Chennai, Bangalore',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-togo-darker text-gray-200 min-h-screen`}>
        <AppProvider>
          <Navbar />
          <main className="pt-14 lg:pt-16 pb-16 lg:pb-0 min-h-screen">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
