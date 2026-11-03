import type { Metadata, Viewport } from 'next';
import './globals.css';
import { config } from '@/lib/config';

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: 'SET Home – Furnish your new Birmingham home for less',
  description: 'Ready-made room packs of checked second-hand, clearance and new furniture. Delivered and set up on your move-in day, across Birmingham.',
  openGraph: { title: 'SET Home – New to Birmingham? Furnish your home for less.', description: 'Room packs delivered and set up on your move-in day.', type: 'website' },
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#1B2A4A' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@700;800&family=Atkinson+Hyperlegible:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
