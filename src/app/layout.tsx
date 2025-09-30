import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Writa',
  description: 'Are You Writa?',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Playfair+Display:wght@700&family=Inter:wght@600&family=Special+Elite&family=Open+Sans:wght@400;600;700&family=Roboto:wght@400;700&family=Slabo+27px&family=Lato:wght@400;700&family=Oswald:wght@400;700&family=Raleway:wght@400;700&family=Roboto+Slab:wght@400;700&family=Ubuntu:wght@400;700&family=Titillium+Web:wght@400;700&family=Oxygen:wght@400;700&family=Dosis:wght@400;700&family=Lobster&family=Catamaran:wght@400;700&family=Bree+Serif&family=Josefin+Sans:wght@400;700&family=Exo+2:wght@400;700&family=Anton&family=Libertinus+Keyboard&display=swap&subset=latin-ext"
          rel="stylesheet"
        />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
