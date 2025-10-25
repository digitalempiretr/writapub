
import { fontOptions } from './font-options';
import { gradientTemplates } from './colors';
import { TextEffect } from './text-effects';

export type DesignTemplate = {
  id: string;
  name: string;
  category: 'Special Effects' | 'Color Styles' | 'Authors Templates' | 'Gradient Styles' | 'Favorites';
  previewImage: string;
  background: {
    type: 'flat' | 'gradient' | 'image';
    value: string;
  };
  font: {
    value: string;
    color: string;
    fontSize: number;
  };
  textBox: {
    color: string;
    opacity: number;
  };
  overlay: {
    color: string;
    opacity: number;
  };
  canvasSize: 'Post' | 'Story' | 'Square';
  effect?: {
    id: string;
  };
};

export const designTemplates: DesignTemplate[] = [
   // Authors Templates Category
   {
    id: 'daktilo',
    name: "Daktilo",
    category: 'Authors Templates', // Or 'Color Styles' or 'Special Effects'
    previewImage: "https://i.ibb.co/N6Qvdnbw/daktilo-template.jpg",
    background: {
      type: 'image',
      value: 'https://i.ibb.co/nMxGgznf/book-shadow-post.jpg',
    },
    font: {
      value: 'special-elite',
      color: '#0F2027',
      fontSize: 48,
    },
    textBox: {
      color: '#f4ede4',
      opacity: 0,
    },
    overlay: {
      color: '#008080',
      opacity: 0,
    },
    canvasSize: 'Post',
    effect: {
      id: 'none',
    }
  },
  {
    id: 'template-milky',
    name: "Milky",
    category: 'Authors Templates',
    previewImage: "https://i.ibb.co/zhYZ5H5V/milky-1.jpg",
    background: {
      type: 'image',
      value: 'https://i.ibb.co/kVJS28vc/6.jpg',
    },
    font: {
      value: 'style-script',
      color: '#3f5b4d',
      fontSize: 58,
    },
    textBox: {
      color: '#e5e5ff',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
  },
  {
    id: 'template-art-school-of-athens',
    name: "Art School Of Athens",
    category: 'Authors Templates',
    previewImage: "https://i.ibb.co/sd7gmFQk/Art-School-Of-Athens.jpg",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/159862/art-school-of-athens-raphael-italian-painter-fresco-159862.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    font: {
      value: 'duru-sans',
      color: '#FFFFFF',
      fontSize: 48,
    },
    textBox: {
        color: '#383839',
        opacity: 0.53,
      },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
  },
  {
    id: 'template-marble',
    name: "Marble",
    category: 'Authors Templates',
    previewImage: "https://i.ibb.co/Q763twkW/marble-template.jpg",
    background: {
      type: 'image',
      value: 'https://i.ibb.co/DDZ3y2Lk/7.jpg',
    },
    font: {
      value: 'duru-sans',
      color: '#706051',
      fontSize: 48,
    },
    textBox: {
        color: '#a79c92',
        opacity: 0.5,
      },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
  },
  {
    id: 'template-birdseyesea',
    name: "Birds Eye Sea",
    category: 'Authors Templates',
    previewImage: "https://i.ibb.co/qYdKfn9F/Birds-Eye-Sea.jpg",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/1655166/pexels-photo-1655166.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    font: {
      value: 'duru-sans',
      color: '#FFFFFF',
      fontSize: 48,
    },
    textBox: {
        color: '#7585A3',
        opacity: 0,
      },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
  },  

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
      fontSize: 48,
    },
    textBox: {
      color: '#f4ede4',
      opacity: 0,
    },
    overlay: {
      color: '#008080',
      opacity: 0,
    },
    canvasSize: 'Post',
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
      fontSize: 48,
    },
    textBox: {
      color: '#f4ede4',
      opacity: 0,
    },
    overlay: {
      color: '#008080',
      opacity: 0,
    },
    canvasSize: 'Post',
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
      fontSize: 70,
    },
    textBox: {
      color: '#f4ede4',
      opacity: 0,
    },
    overlay: {
      color: '#008080',
      opacity: 0,
    },
    canvasSize: 'Post',
    effect: {
      id: 'roses',
    }
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
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
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
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
},
  {
    id: 'styles-jet-cloud-white',
    name: "Jet Cloud White",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#FAFAFA',
    },
    font: {
      value: 'duru-sans',
      color: '#312F2C',
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
},
  {
    id: 'styles-Deep-Sea-Blue',
    name: "Deep Sea Blue",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#050761',
    },
    font: {
      value: 'duru-sans',
      color: '#40ffa7',
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
},
  {
    id: 'styles-Icy-Horizon',
    name: "Icy Horizon",
    category: 'Color Styles',
    previewImage: "",
    background: {
      type: 'flat',
      value: '#40ffa7',
    },
    font: {
      value: 'duru-sans',
      color: '#050761',
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
},
{
  id: 'styles-Feldgrau',
  name: "Feldgrau ",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#33412f',
  },
  font: {
    value: 'duru-sans',
    color: '#Fba0a3',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
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
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
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
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
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
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
},
{
  id: 'styles-Seaweed-Green',
  name: "Seaweed Green",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#0A406E',
  },
  font: {
    value: 'duru-sans',
    color: '#06CCA0',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Sunshine-Yellow',
  name: "Sunshine Yellow",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#002778',
  },
  font: {
    value: 'duru-sans',
    color: '#FFD40B',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Blue-Horizon',
  name: "Blue Horizon",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#2846D3',
  },
  font: {
    value: 'duru-sans',
    color: '#CECBC9',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Deep-Sea',
  name: "Deep Sea",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#03335F',
  },
  font: {
    value: 'duru-sans',
    color: '#0ECDE1',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Midnight-Wave',
  name: "Midnight Wave",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#334363',
  },
  font: {
    value: 'duru-sans',
    color: '#DE918C',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Starlit-Sky',
  name: "Starlit Sky",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#272D50',
  },
  font: {
    value: 'duru-sans',
    color: '#36C4C7',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Azure-Vibe',
  name: "Azure Vibe",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#453F90',
  },
  font: {
    value: 'duru-sans',
    color: '#CD3536',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Spring-Green',
  name: "Spring Green",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#004973',
  },
  font: {
    value: 'duru-sans',
    color: '#FCF900',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Deep-Blue',
  name: "Deep Blue",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#2C2B9B',
  },
  font: {
    value: 'duru-sans',
    color: '#DB141C',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Evening-Sky',
  name: "Evening Sky",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#1A2B76',
  },
  font: {
    value: 'duru-sans',
    color: '#B41EDF',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Autumn-Mist',
  name: "Autumn Mist",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#6070B6',
  },
  font: {
    value: 'duru-sans',
    color: '#F2EEF2',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Warm-Ember',
  name: "Warm Ember",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#D5301C',
  },
  font: {
    value: 'duru-sans',
    color: '#047976',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Crisp-Red',
  name: "Crisp Red",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#ED0400',
  },
  font: {
    value: 'duru-sans',
    color: '#FAC800',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Vibrant-Pink',
  name: "Vibrant Pink",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#DD2260',
  },
  font: {
    value: 'duru-sans',
    color: '#0C2955',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Soft-Yellow',
  name: "Soft Yellow",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#F4BE05',
  },
  font: {
    value: 'duru-sans',
    color: '#984DAE',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Delicate-Peach',
  name: "Delicate Peach",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#F7F1D2',
  },
  font: {
    value: 'duru-sans',
    color: '#DD9DBA',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Lime-Splash',
  name: "Lime Splash",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#DDFD00',
  },
  font: {
    value: 'duru-sans',
    color: '#F94071',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Gold-Shimmer',
  name: "Gold Shimmer",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#FFEF58',
  },
  font: {
    value: 'duru-sans',
    color: '#2D3440',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Pastel-Green',
  name: "Pastel Green",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#FDF7C1',
  },
  font: {
    value: 'duru-sans',
    color: '#49CDAE',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Forest-Green',
  name: "Forest Green",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#14473F',
  },
  font: {
    value: 'duru-sans',
    color: '#12BA24',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Teal-Oasis',
  name: "Teal Oasis",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#0FCE3E',
  },
  font: {
    value: 'duru-sans',
    color: '#104462',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Lush-Foliage',
  name: "Lush Foliage",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#4A5E46',
  },
  font: {
    value: 'duru-sans',
    color: '#B5CEC1',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Mint-Whisper',
  name: "Mint Whisper",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#192D1B',
  },
  font: {
    value: 'duru-sans',
    color: '#D6C3CD',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Soft-Sprout',
  name: "Soft Sprout",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#A2CA57',
  },
  font: {
    value: 'duru-sans',
    color: '#2B5251',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Cool-Dusk',
  name: "Cool Dusk",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#041F2A',
  },
  font: {
    value: 'duru-sans',
    color: '#96DEA7',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Fresh-Green',
  name: "Fresh Green",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#00FC69',
  },
  font: {
    value: 'duru-sans',
    color: '#5C0089',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Seafoam-Breeze',
  name: "Seafoam Breeze",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#062129',
  },
  font: {
    value: 'duru-sans',
    color: '#9DDBA8',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Peacock-Tail',
  name: "Peacock Tail",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#19CBB1',
  },
  font: {
    value: 'duru-sans',
    color: '#394155',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Misty-Evening',
  name: "Misty Evening",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#1B4946',
  },
  font: {
    value: 'duru-sans',
    color: '#DA9688',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Forest-Trail',
  name: "Forest Trail",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#2EC28A',
  },
  font: {
    value: 'duru-sans',
    color: '#1E515D',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Marine-Galaxy',
  name: "Marine Galaxy",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#02D7B5',
  },
  font: {
    value: 'duru-sans',
    color: '#383E53',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Cloudy-Night',
  name: "Cloudy Night",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#084047',
  },
  font: {
    value: 'duru-sans',
    color: '#DC948D',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Charcoal-Grass',
  name: "Charcoal Grass",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#004548',
  },
  font: {
    value: 'duru-sans',
    color: '#E87868',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Dusk-Wave',
  name: "Dusk Wave",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#68D9D6',
  },
  font: {
    value: 'duru-sans',
    color: '#8C53B5',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Aquamarine-Whisper',
  name: "Aquamarine Whisper",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#006B99',
  },
  font: {
    value: 'duru-sans',
    color: '#E0CAE8',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},
{
  id: 'styles-Blue-Mosaic',
  name: "Blue Mosaic",
  category: 'Color Styles',
  previewImage: "",
  background: {
    type: 'flat',
    value: '#3889AC',
  },
  font: {
    value: 'duru-sans',
    color: '#ECDDC8',
    fontSize: 48,
  },
  textBox: {
    color: '#7585A3',
    opacity: 0,
  },
  overlay: {
    color: '#7585A3',
    opacity: 0,
  },
  canvasSize: 'Post',
},

  // Gradient Styles Category
  {
    id: 'template-purpGrad',
    name: "Purple Gradient",
    category: 'Gradient Styles',
    previewImage: "",
    background: {
      type: 'gradient',
      value: gradientTemplates.find(g => g.name === 'Purple')?.css || 'linear-gradient(to right, #8e2de2, #4a00e0)',
    },
    font: {
      value: 'poppins',
      color: '#E2A9F1',
      fontSize: 48,
    },
    textBox: {
      color: '#7585A3',
      opacity: 0,
    },
    overlay: {
      color: '#7585A3',
      opacity: 0,
    },
    canvasSize: 'Post',
  },
];
