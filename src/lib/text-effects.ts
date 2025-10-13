
export type TextEffect = {
  name: string;
  id: string;
  style: {
    color?: string;
    textShadow?: string;
    glowColor?: string; // Add this for effects like Neon
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
         -10px 10px 0px {{color}},
         -20px 20px 0px {{glow}},
         -30px 30px 0px #00bdbd
      `,
      glowColor: '#01cccc'
    },
    previewBg: '#6CFAFC',
  },
  {
    name: '3D Cartoon',
    id: '3dcartoon',
    style: {
      color: '#fff',
      textShadow: `
        0px -6px 0 #212121,  
        0px -6px 0 #212121,
        0px  6px 0 #212121,
        0px  6px 0 #212121,
       -6px  0px 0 #212121,  
        6px  0px 0 #212121,
       -6px  0px 0 #212121,
        6px  0px 0 #212121,
       -6px -6px 0 #212121,  
        6px -6px 0 #212121,
       -6px  6px 0 #212121,
        6px  6px 0 #212121,
       -6px  18px 0 #212121,
        0px  18px 0 #212121,
        6px  18px 0 #212121,
        0 19px 1px rgba(0,0,0,.1),
        0 0 6px rgba(0,0,0,.1),
        0 6px 3px rgba(0,0,0,.3),
        0 12px 6px rgba(0,0,0,.2),
        0 18px 18px rgba(0,0,0,.25),
        0 24px 24px rgba(0,0,0,.2),
        0 36px 36px rgba(0,0,0,.15)
    `,
    },
    previewBg: '#fc3153',
  },
  {
    name: 'SuperHero',
    id: 'SuperHero',
    style: {
      color: '#fff',
      textShadow: `
        0 0 5px {{color}},
        0 0 10px {{glow}},
        0 0 15px #bbb
      `,
      glowColor: '#ddd'
    },
    previewBg: '#333',
  },
  {
    name: 'Electric Lines',
    id: 'electricLines',
    style: {
      color: '#00e5ff',
      textShadow: `
        0 0 5px {{color}},
        1px 1px 10px {{glow}},
        -1px -1px 10px {{glow}}
      `,
      glowColor: '#00b8d4'
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
      glowColor: '#00ff00',
      textShadow: `
        0 0 5px {{color}},
        0 0 10px {{color}},
        0 0 20px {{color}},
        0 0 40px {{glow}}
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
    
    // This regex is more robust: it handles unitless numbers, px units, and rgba values with decimals.
    const shadowRegex = /(-?\d*\.?\d+)(px)?\s+(-?\d*\.?\d+)(px)?(?:\s+(-?\d*\.?\d+)(px)?)?\s+(rgba?\([\d\s,.]+\)|#?\w+)/g;
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
