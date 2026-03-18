import type { Metadata } from 'next';
import { Cormorant_Garamond, Montserrat, Inter } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-montserrat',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://eventcontrol.site'),
  title: 'EventControl — Crea y controla tu evento',
  description: 'Plataforma para crear invitaciones digitales, confirmar invitados y gestionar tu evento desde un solo lugar.',
  openGraph: {
    title: 'EventControl — Crea y controla tu evento',
    description: 'Invitaciones digitales, confirmaciones en tiempo real y gestion completa para cualquier evento.',
    url: 'https://eventcontrol.site',
    siteName: 'EventControl',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${cormorant.variable} ${montserrat.variable} ${inter.variable}`}>
      <head>
        {/* Great Vibes font — loaded via Google Fonts link since next/font doesn't support it well */}
        <link
          href="https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
