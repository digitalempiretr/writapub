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
    fontSize?: number | string; // Base size for this effect
  };
  fontValue?: string; // Add this to link to a FontOption
  previewBg?: string;
};

export const textEffects: TextEffect[] = [
  {
    name: 'None',
    id: 'none',
    style: { color: '#000000',textShadow: 'none'},
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
      fontSize: 90,
      textShadow: `
          0em -0.031em 0 #212121, 0em -0.031em 0 #212121, 0em  0.031em 0 #212121, 0em  0.031em 0 #212121,
        -0.031em 0em 0 #212121, 0.031em 0em 0 #212121, -0.031em 0em 0 #212121, 0.031em 0em 0 #212121,
        -0.031em -0.031em 0 #212121, 0.031em -0.031em 0 #212121, -0.031em 0.031em 0 #212121, 0.031em 0.031em 0 #212121,
        -0.031em 0.094em 0 #212121, 0em    0.094em 0 #212121, 0.031em 0.094em 0 #212121,
        0 0.099em 0.005em rgba(0,0,0,.1), 0 0 0.031em rgba(0,0,0,.1), 0 0.031em 0.016em rgba(0,0,0,.3),
        0 0.063em 0.031em rgba(0,0,0,.2), 0 0.094em 0.094em rgba(0,0,0,.25), 0 0.125em 0.125em rgba(0,0,0,.2),
        0 0.188em 0.188em rgba(0,0,0,.15)
      `,
      fontSmoothing: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
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
      fontWeight: 700,
      fontSize: 60,
      textShadow: `     
          0.021em 0.021em 0em #eb452b,
          0.042em 0.042em 0em #efa032,
          0.063em 0.063em 0em #46b59b,
          0.083em 0.083em 0em #017e7f,
          0.104em 0.104em 0em #052939,
          0.125em 0.125em 0em #c11a2b,
          0.146em 0.146em 0em #c11a2b,
          0.167em 0.167em 0em #c11a2b,
          0.188em 0.188em 0em #c11a2b 
      `,
    },
    previewBg: '#121221',
  },
  {
    name: 'Neon',
    id: 'neon',
    fontValue: 'tilt-neon',
    style: {
      color: '#ffffff',
      fontFamily: "'Tilt Neon', cursive",
      glowColor: '#228DFF',
      fontSize: 48,
      textShadow: `     
        0 0 10px {{color}}, 0 0 20px  {{color}}, 0 0 30px  {{color}}, 0 0 40px  {{glow}},
        0 0 70px  {{glow}}, 0 0 80px  {{glow}}, 0 0 100px {{glow}}, 0 0 150px {{glow}}   
      `,
    },
    previewBg: '#121221',
  },
  {
    name: 'Neon 2',
    id: 'neon2',
    fontValue: 'tilt-neon',
    style: {
      color: '#fff6a9',
      fontFamily: "'Tilt Neon', cursive",
      glowColor: '#228DFF',
      fontSize: 'calc(20px + 10vh)',
      textShadow: `     
          0 0 0.05em #ffa500,
          0 0 0.15em #ffa500,
          0 0 0.20em #ffa500,
          0 0 0.40em #ffa500,
          0 0 0.60em #ff0000,
          0 0 0.10em #ff8d00,
          0 0 0.98em #ff0000   
      `,
    },
    previewBg: '#121221',
  },
   {
    name: 'Retro',
    id: 'retro',
    style: {
      color: '#e24a91',
      textShadow: ` -2px 2px 0px #4d82c2, -4px 4px 0px #315e9a `,
    },
    previewBg: '#f0f0f0',
  },
  {
    name: 'Golden Glow',
    id: 'goldenGlow',
    fontValue: 'tilt-neon',
    style: { 
      color: ' #ffcc00', 
      fontFamily: "'Tilt Neon', cursive",
      fontSize: 48,
      textShadow: ` 
        0 0 0.2em #ffcc00,
        0 0 0.4em #ffb700,
        0 0 0.6em #e6ac00,
        0 0 0.8em #b38f00
    `  },
    previewBg: '#212121',
  },
  {
    name: 'Outline',
    id: 'outline',
    style: {
      color: '#ffffff',
      textShadow: `
        0.057em 0.057em 0 #4074b5,
        0.057em -0.057em 0 #4074b5,
      -0.057em 0.057em 0 #4074b5,
      -0.057em -0.057em 0 #4074b5,
        0.057em 0em 0 #4074b5,
        0em 0.057em 0 #4074b5,
      -0.057em 0em 0 #4074b5,
        0em -0.057em 0 #4074b5
      `,
    },
    previewBg: '#ffffff',
  },
  {
    name: 'Fire',
    id: 'fire',
     style: {
      color: '#fefcc9',
      glowColor: '#ec760c',
      textShadow: `
        0 0 5px {{color}}, 0 0 10px {{color}}, 0 0 15px {{color}}, 0 0 20px #feec85, 
        0 0 30px #ffae34, 0 0 40px {{glow}}, 0 0 55px {{glow}}, 0 0 75px #973716
      `,
    },
  },
];

type Unit = 'px' | 'em' | 'rem';

export const parseShadow = (shadowString: string) => {
    const shadows: any[] = [];
    if (!shadowString || shadowString === 'none') {
        return [];
    }
    const shadowRegex = /(-?\d*\.?\d+)(em|px|rem)?\s+(-?\d*\.?\d+)(em|px|rem)?(?:\s+(-?\d*\.?\d+)(em|px|rem)?)?\s+(rgba?\(.+?\)|#?\w+)/g;
    let match;

    while ((match = shadowRegex.exec(shadowString)) !== null) {
        shadows.push({
            id: Date.now() + Math.random(),
            offsetX: parseFloat(match[1]),
            offsetXUnit: (match[2] as Unit) || 'px',
            offsetY: parseFloat(match[3]),
            offsetYUnit: (match[4] as Unit) || 'px',
            blur: parseFloat(match[5]) || 0,
            blurUnit: (match[6] as Unit) || 'px',
            color: match[7],
        });
    }
    return shadows;
};
