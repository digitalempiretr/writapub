
export type TextEffect = {
  name: string;
  id: string;
  style: React.CSSProperties;
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
      color: '#000',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
  },
  {
    name: 'Outline',
    id: 'outline',
    style: {
      color: '#fff',
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
      color: '#fff',
      textShadow: `
        0 0 7px #fff,
        0 0 10px #fff,
        0 0 21px #fff,
        0 0 42px #0fa,
        0 0 82px #0fa,
        0 0 92px #0fa,
        0 0 102px #0fa,
        0 0 151px #0fa
      `,
    },
  },
  {
    name: 'Fire',
    id: 'fire',
     style: {
      color: '#fefcc9',
      textShadow: `
        0 0 5px #fefcc9, 
        0 0 10px #fefcc9, 
        0 0 15px #fefcc9, 
        0 0 20px #feec85, 
        0 0 30px #ffae34, 
        0 0 40px #ec760c, 
        0 0 55px #cd4606, 
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
