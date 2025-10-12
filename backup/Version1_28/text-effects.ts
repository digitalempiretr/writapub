
export type TextEffect = {
  name: string;
  id: string;
  style: {
    color?: string;
    textShadow?: string;
    glowColor?: string; // Add this for effects like Neon
  };
};

export const textEffects: TextEffect[] = [
  {
    name: 'None',
    id: 'none',
    style: { textShadow: 'none' },
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
    name: 'Neon',
    id: 'neon',
    style: {
      color: '#ffffff',
      glowColor: '#0fa', // Explicitly define glow color
      textShadow: `
        0 0 7px {{color}},
        0 0 10px {{color}},
        0 0 21px {{color}},
        0 0 42px {{glow}},
        0 0 82px {{glow}},
        0 0 92px {{glow}},
        0 0 102px {{glow}},
        0 0 151px {{glow}}
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
