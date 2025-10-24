
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
    <html lang="en" suppressHydrationWarning className="nature-dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Anton&family=Arima:wght@400;700&family=Arsenal:wght@400;700&family=Beau+Rivage&family=Bebas+Neue&family=Bree+Serif&family=Carattere&family=Catamaran:wght@400;700&family=Cherry+Bomb+One&family=Coiny&family=Cutive&family=Dosis:wght@400;700&family=Duru+Sans&family=Ephesis&family=Exo+2:wght@400;700&family=Fleur+De+Leah&family=Grand+Hotel&family=Great+Vibes&family=IBM+Plex+Sans:wght@400;700&family=Indie+Flower&family=Instrument+Serif:ital,wght@0,400;1,400&family=Inter:wght@400;600&family=Italianno&family=Josefin+Sans:wght@400;700&family=Kablammo&family=Lato:wght@400;700&family=Lexend+Deca:wght@400;700&family=Libertinus+Keyboard&family=Licorice&family=Lobster&family=Luckiest+Guy&family=Mea+Culpa&family=Montez&family=Neonderthaw&family=Niconne&family=Norican&family=Noto+Sans+Display:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=Oswald:wght@400;700&family=Oxygen:wght@400;700&family=PT+Sans:wght@400;700&family=Pattaya&family=Playfair+Display:wght@400;700&family=Playwrite+England+Joined&family=Playwrite+France+Moderne&family=Playwrite+USA+Modern&family=Plus+Jakarta+Sans:wght@400;700&family=Poiret+One&family=Poppins:wght@400;700&family=Raleway:wght@400;700&family=Red+Hat+Display:wght@400;700&family=Ribeye+Marrow&family=Roboto+Slab:wght@400;700&family=Roboto:wght@400;700&family=Romanesco&family=Sacramento&family=Sansita:wght@400;700&family=Shadows+Into+Light&family=Slabo+27px&family=Smooch+Sans:wght@400;700&family=Source+Sans+3:wght@400;700&family=Special+Elite&family=Style+Script&family=Syne:wght@400;700&family=Tenor+Sans&family=Tilt+Neon&family=Titillium+Web:wght@400;700&family=Ubuntu:wght@400;700&family=Updock&family=WindSong&family=Yesteryear&display=swap"
          rel="stylesheet"
        />
        {/* <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" /> */}
      </head>
      <body className="font-body antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
