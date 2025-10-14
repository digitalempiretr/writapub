
import type { CSSProperties } from 'react';

export type TextEffect = {
  name: string;
  id: string;
  style: {
    color?: string;
    textShadow?: string;
    glowColor?: string; // Add this for effects like Neon
    fontFamily?: string;
    fontWeight?: string | number;
    fontSmoothing?: CSSProperties;
    shadowBaseFontSize?: number; // Base font size the shadow px values are designed for
  };
  fontValue?: string; // Add this to link to a FontOption
  previewBg?: string;
};

export const textEffects: TextEffect[] = [
  {
    name: 'None',
    id: 'none',
    style: { color: '#000',textShadow: 'none'},
    previewBg: '#e2e8f0',
  },
  {
    name: '3D Cartoon',
    id: '3dcartoon',
    fontValue: 'luckiest-guy',
    style: {
      color: '#ffffff',
      fontFamily: "'Luckiest Guy'",
      fontWeight: 400,
      shadowBaseFontSize: 48, // The px values below are tuned for a 144pt font
      textShadow: `
        0px -1.5px 0 #212121,  
        0px 1.5px 0 #212121,
        -1.5px 0px 0 #212121,  
        1.5px 0px 0 #212121,
        -1.5px -1.5px 0 #212121,  
        1.5px -1.5px 0 #212121,
        -1.5px 1.5px 0 #212121,
        1.5px 1.5px 0 #212121,
        -1.5px 4.5px 0 #212121,
        0px 4.5px 0 #212121,
        1.5px 4.5px 0 #212121,
        0 4.5px 1px rgba(0,0,0,0.1),
        0 0 1.5px rgba(0,0,0,0.1),
        0 1.5px 3px rgba(0,0,0,0.3),
        0 3px 1.5px rgba(0,0,0,0.2),
        0 4.5px 4.5px rgba(0,0,0,0.25),
        0 6px 6px rgba(0,0,0,0.2),
        0 9px 9px rgba(0,0,0,0.15)
      `,
      fontSmoothing: {
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
    },
    previewBg: '#fc3153',
  },
  {
    name: 'Roses',
    id: 'roses',
    fontValue: 'niconne',
    style: {
      color: '#fcedd8',
      fontFamily: "'Niconne', cursive",
      glowColor: '#228DFF',
      textShadow: `     
        1px 1px 0px #eb452b,
        2px 2px 0px #efa032,
        3px 3px 0px #46b59b,
        4px 4px 0px #017e7f,
        5px 5px 0px #052939,
        6px 6px 0px #c11a2b,
        7px 7px 0px #c11a2b,
        8px 8px 0px #c11a2b,
        9px 9px 0px #c11a2b 
      `,
    },
    previewBg: '#121221',
  },
  {
    name: 'Neon',
    id: 'neon',
    fontValue: 'neonderthaw',
    style: {
      color: '#ffffff',
      fontFamily: "'Neonderthaw', cursive",
      glowColor: '#228DFF',
      textShadow: `     
        0 0 10px {{color}},
        0 0 20px  {{color}},
        0 0 30px  {{color}},
        0 0 40px  {{glow}},
        0 0 70px  {{glow}},
        0 0 80px  {{glow}},
        0 0 100px {{glow}},
        0 0 150px {{glow}}   
      `,
    },
    previewBg: '#121221',
  },
   {
    name: 'Retro',
    id: 'retro',
    style: {
      color: '#e24a91',
      textShadow: `
        -2px 2px 0px #4d82c2,
        -4px 4px 0px #315e9a
      `,
    },
    previewBg: '#f0f0f0',
  },
  {
    name: 'Shadow',
    id: 'shadow',
    style: {
      color: '#000000',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
  },
  {
    name: 'Outline',
    id: 'outline',
    style: {
      color: '#ffffff',
      textShadow: `
        -1px -1px 0 #000,  
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000
      `,
    },
  },
  {
    name: 'Fire',
    id: 'fire',
     style: {
      color: '#fefcc9',
      glowColor: '#ec760c', // Define a glow for fire
      textShadow: `
        0 0 5px {{color}}, 
        0 0 10px {{color}}, 
        0 0 15px {{color}}, 
        0 0 20px #feec85, 
        0 0 30px #ffae34, 
        0 0 40px {{glow}}, 
        0 0 55px {{glow}}, 
        0 0 75px #973716
      `,
    },
  },
];

// Helper function to parse CSS text-shadow string
export const parseShadow = (shadowString: string) => {
    const shadows: any[] = [];
    if (!shadowString || shadowString === 'none') {
        return [];
    }
    const shadowRegex = /(-?\d*\.?\d+)(px)?\s+(-?\d*\.?\d+)(px)?(?:\s+(-?\d*\.?\d+)(px)?)?\s+(rgba?\(.+?\)|#?\w+)/g;
    let match;

    while ((match = shadowRegex.exec(shadowString)) !== null) {
        shadows.push({
            id: Date.now() + Math.random(),
            offsetX: parseFloat(match[1]),
            offsetY: parseFloat(match[3]),
            blur: parseFloat(match[5]) || 0,
            color: match[7],
        });
    }
    return shadows;
};

    