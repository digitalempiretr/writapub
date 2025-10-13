export type TextEffect = {
  name: string;
  id: string;
  style: {
    color?: string;
    textShadow?: string;
    glowColor?: string;
  };
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
    name: 'WhiteGlow',
    id: 'whiteGlow',
    style: {
      color: '#fff',
      textShadow: `
        0 0 5px #fff,
        0 0 10px #ddd,
        0 0 15px #bbb
      `,
    },
    previewBg: '#333',
  },
  {
    name: 'Electric Lines',
    id: 'electricLines',
    style: {
      color: '#00e5ff',
      textShadow: `
        0 0 5px #00e5ff,
        1px 1px 10px #00b8d4,
        -1px -1px 10px #00b8d4
      `,
    },
    previewBg: '#001a1f',
  },
  {
    name: 'LayeredShadow',
    id: 'layeredShadow',
    style: {
      color: '#fff',
      textShadow: `
        3px 3px 0 #ff3f3f,
        6px 6px 0 #4caf50,
        9px 9px 0 #2196f3
      `,
    },
    previewBg: '#e0e0e0',
  },
  {
    name: 'Static Neon',
    id: 'staticNeon',
    style: {
      color: '#39ff14',
      textShadow: `
        0 0 5px #39ff14,
        0 0 10px #39ff14,
        0 0 20px #39ff14,
        0 0 40px #00ff00
      `,
    },
    previewBg: '#1a1a1a',
  },
  {
    name: 'Neon',
    id: 'neon',
    style: {
      color: '#ffffff',
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
    name: 'Fire',
    id: 'fire',
     style: {
      color: '#fefcc9',
      glowColor: '#ec760c',
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
    previewBg: '#2a0000',
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
  }
];

// Helper function to parse CSS text-shadow string
export const parseShadow = (shadowString: string) => {
    const shadows: any[] = [];
    if (!shadowString || shadowString === 'none') {
        return [];
    }
    // This regex is simplified and might not cover all edge cases, but works for the effects here.
    const shadowRegex = /(-?\d*\.?\d+)(px)?\s+(-?\d*\.?\d+)(px)?\s+(-?\d*\.?\d+)(px)?\s+(rgba?\(.+?\)|#?\w+)/g;
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
