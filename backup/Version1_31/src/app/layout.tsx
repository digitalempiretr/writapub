
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
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&family=Playfair+Display:wght@700&family=Inter:wght@600&family=Special+Elite&family=Open+Sans:wght@400;600;700&family=Roboto:wght@400;700&family=Slabo+27px&family=Lato:wght@400;700&family=Oswald:wght@400;700&family=Raleway:wght@400;700&family=Roboto+Slab:wght@400;700&family=Ubuntu:wght@400;700&family=Titillium+Web:wght@400;700&family=Oxygen:wght@400;700&family=Dosis:wght@400;700&family=Lobster&family=Catamaran:wght@400;700&family=Bree+Serif&family=Josefin+Sans:wght@400;700&family=Exo+2:wght@400;700&family=Anton&family=Libertinus+Keyboard&family=Cherry+Bomb+One&family=Kablammo&family=Coiny&family=Mea+Culpa&family=Fleur+De+Leah&family=Pattaya&family=Ephesis&family=Yesteryear&family=Italianno&family=Grand+Hotel&family=Montez&family=Norican&family=Licorice&family=Romanesco&family=Carattere&family=Beau+Rivage&family=Style+Script&family=WindSong&family=Updock&family=Lexend+Deca:wght@400;700&family=Poiret+One&family=Red+Hat+Display:wght@400;700&family=Noto+Sans+Display:wght@400;700&family=Nunito:wght@400;700&family=Poppins:wght@400;700&family=PT+Sans:wght@400;700&family=IBM+Plex+Sans:wght@400;700&family=Source+Sans+3:wght@400;700&family=Duru+Sans&family=Syne:wght@400;700&family=Farro:wght@400;700&family=Smooch+Sans:wght@400;700&family=Tenor+Sans&family=Arsenal&family=Faculty+Glyphic:wght@400;700&family=Playwrite+USA+Modern:wght@400;700&family=Playwrite+England+Joined:wght@400;700&family=Playwrite+France+Moderne:wght@400;700&family=Sansita:wght@400;700&family=Ribeye+Marrow&family=Sour+Gummy:wght@400;700&family=Neonderthaw&family=Tilt+Neon&family=Luckiest+Guy&family=Niconne&family=Shadows+Into+Light&family=Sacramento&display=swap&subset=latin-ext"
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
