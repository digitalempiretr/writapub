
import { fontOptions } from './font-options';
import { gradientTemplates } from './colors';
import { TextEffect } from './text-effects';

export type DesignTemplate = {
  id: string;
  name: string;
  category: 'Special Effects' | 'Color Styles' | 'Image Templates';
  previewImage: string;
  background: {
    type: 'flat' | 'gradient' | 'image';
    value: string;
  };
  font: {
    value: string;
    color: string;
  };
  textBox: {
    color: string;
    opacity: number;
  };
  overlay: {
    color: string;
    opacity: number;
  };
  effect?: {
    id: string;
  };
};

export const designTemplates: DesignTemplate[] = [
  // Special Effects Category
  {
    id: 'template-neon-blue',
    name: "Blue Neon",
    category: 'Special Effects',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#121221',
    },
    font: {
      value: 'luckiest-guy',
      color: '#ffffff',
    },
    textBox: {
      color: '#f4ede4',
      opacity: 0,
    },
    overlay: {
      color: '#008080',
      opacity: 0,
    },
    effect: {
      id: 'neon',
    }
  },
  {
    id: 'red-3d-cartoon',
    name: "Red 3D Cartoon",
    category: 'Special Effects',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#FF5757',
    },
    font: {
      value: 'luckiest-guy',
      color: '#ffffff',
    },
    textBox: {
      color: '#f4ede4',
      opacity: 0,
    },
    overlay: {
      color: '#008080',
      opacity: 0,
    },
    effect: {
      id: '3dcartoon',
    }
  },
   {
    id: 'template-roses',
    name: "Roses",
    category: 'Special Effects',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#121221',
    },
    font: {
      value: 'niconne', 
      color: '#fcedd8',
    },
    textBox: {
      color: '#f4ede4',
      opacity: 0,
    },
    overlay: {
      color: '#008080',
      opacity: 0,
    },
    effect: {
      id: 'roses',
    }
  },

  // Image Templates Category
  {
    id: 'template-milky',
    name: "Milky",
    category: 'Image Templates',
    previewImage: "https://i.ibb.co/zhYZ5H5V/milky-1.jpg",
    background: {
      type: 'image',
      value: 'https://i.ibb.co/kVJS28vc/6.jpg',
    },
    font: {
      value: 'style-script',
      color: '#3f5b4d',
    },
    textBox: {
        color: '#e5e5ff',
        opacity: 0,
      },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
  {
    id: 'template-art-school-of-athens',
    name: "Art School Of Athens",
    category: 'Image Templates',
    previewImage: "https://i.ibb.co/sd7gmFQk/Art-School-Of-Athens.jpg",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-painter-fresco-159862.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    font: {
      value: 'duru-sans',
      color: '#FFFFFF',
    },
    textBox: {
        color: '#383839',
        opacity: 0.53,
      },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
  {
    id: 'template-marble',
    name: "Marble",
    category: 'Image Templates',
    previewImage: "https://i.ibb.co/Q763twkW/marble-template.jpg",
    background: {
      type: 'image',
      value: 'https://i.ibb.co/DDZ3y2Lk/7.jpg',
    },
    font: {
      value: 'duru-sans',
      color: '#706051',
    },
    textBox: {
        color: '#a79c92',
        opacity: 0.5,
      },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
  {
    id: 'template-birdseyesea',
    name: "Birds Eye Sea",
    category: 'Image Templates',
    previewImage: "https://i.ibb.co/qYdKfn9F/Birds-Eye-Sea.jpg",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    font: {
      value: 'duru-sans',
      color: '#FFFFFF',
    },
    textBox: {
        color: '#7585A3',
        opacity: 0,
      },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },  

  // Color Styles Category
  {
    id: 'styles-Night-Chalk',
    name: "Night Chalk",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#212121',
    },
    font: {
      value: 'duru-sans',
      color: '#F4ede4',
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
  {
    id: 'styles-oat-foam',
    name: "Oat Foam",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#F4ede4',
    },
    font: {
      value: 'duru-sans',
      color: '#212121',
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
    {
    id: 'styles-Oceanic-Blue',
    name: "Oceanic Blue",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#143A63',
    },
    font: {
      value: 'duru-sans',
      color: '#FD6749',
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
},
{
    id: 'styles-Cerulean-Dream',
    name: "Cerulean Dream",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#3567DB',
    },
    font: {
      value: 'duru-sans',
      color: '#FEDAFB',
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
},
{
    id: 'styles-Mystic-Night',
    name: "Mystic Night",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#1C2551',
    },
    font: {
      value: 'duru-sans',
      color: '#23CBD2',
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
},
  {
    id: 'template-purpGrad',
    name: "Purple Gradient",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'gradient',
      value: gradientTemplates.find(g => g.name === 'Purple')?.css || 'linear-gradient(to right, #8e2de2, #4a00e0)',
    },
    font: {
      value: 'poppins',
      color: '#E2A9F1',
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
  },
];

    