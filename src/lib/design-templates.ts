
import { fontOptions } from './font-options';
import { gradientTemplates } from './colors';

export type DesignTemplate = {
  id: string;
  name: string;
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
};

export const designTemplates: DesignTemplate[] = [
  {
    id: 'styles-Night-Chalk',
    name: "Night Chalkfeldgrau ",
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
    id: 'styles-jet-cloud-white',
    name: "Jet Cloud White",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#FAFAFA',
    },
    font: {
      value: 'duru-sans',
      color: '#312F2C',
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
    id: 'styles-Deep-Sea-Blue',
    name: "Deep Sea Blue",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#050761',
    },
    font: {
      value: 'duru-sans',
      color: '#40ffa7',
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
    id: 'styles-Icy-Horizon',
    name: "Icy Horizon",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#40ffa7',
    },
    font: {
      value: 'duru-sans',
      color: '#050761',
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
  id: 'styles-Feldgrau',
  name: "Feldgrau ",
  previewImage: "",
  background: {
    type: 'flat',
    value: '#33412f',
  },
  font: {
    value: 'duru-sans',
    color: '#Fba0a3',
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
    id: 'styles-Seaweed-Green',
    name: "Seaweed Green",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#0A406E',
    },
    font: {
      value: 'duru-sans',
      color: '#06CCA0',
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
    id: 'styles-Sunshine-Yellow',
    name: "Sunshine Yellow",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#002778',
    },
    font: {
      value: 'duru-sans',
      color: '#FFD40B',
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
    id: 'styles-Blue-Horizon',
    name: "Blue Horizon",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#2846D3',
    },
    font: {
      value: 'duru-sans',
      color: '#CECBC9',
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
    id: 'styles-Deep-Sea',
    name: "Deep Sea",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#03335F',
    },
    font: {
      value: 'duru-sans',
      color: '#0ECDE1',
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
    id: 'styles-Midnight-Wave',
    name: "Midnight Wave",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#334363',
    },
    font: {
      value: 'duru-sans',
      color: '#DE918C',
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
    id: 'styles-Starlit-Sky',
    name: "Starlit Sky",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#272D50',
    },
    font: {
      value: 'duru-sans',
      color: '#36C4C7',
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
    id: 'styles-Azure-Vibe',
    name: "Azure Vibe",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#453F90',
    },
    font: {
      value: 'duru-sans',
      color: '#CD3536',
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
    id: 'styles-Spring-Green',
    name: "Spring Green",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#004973',
    },
    font: {
      value: 'duru-sans',
      color: '#FCF900',
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
    id: 'styles-Deep-Blue',
    name: "Deep Blue",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#2C2B9B',
    },
    font: {
      value: 'duru-sans',
      color: '#DB141C',
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
    id: 'styles-Evening-Sky',
    name: "Evening Sky",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#1A2B76',
    },
    font: {
      value: 'duru-sans',
      color: '#B41EDF',
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
    id: 'styles-Autumn-Mist',
    name: "Autumn Mist",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#6070B6',
    },
    font: {
      value: 'duru-sans',
      color: '#F2EEF2',
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
    id: 'styles-Warm-Ember',
    name: "Warm Ember",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#D5301C',
    },
    font: {
      value: 'duru-sans',
      color: '#047976',
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
    id: 'styles-Crisp-Red',
    name: "Crisp Red",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#ED0400',
    },
    font: {
      value: 'duru-sans',
      color: '#FAC800',
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
    id: 'styles-Vibrant-Pink',
    name: "Vibrant Pink",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#DD2260',
    },
    font: {
      value: 'duru-sans',
      color: '#0C2955',
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
    id: 'styles-Soft-Yellow',
    name: "Soft Yellow",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#F4BE05',
    },
    font: {
      value: 'duru-sans',
      color: '#984DAE',
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
    id: 'styles-Delicate-Peach',
    name: "Delicate Peach",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#F7F1D2',
    },
    font: {
      value: 'duru-sans',
      color: '#DD9DBA',
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
    id: 'styles-Lime-Splash',
    name: "Lime Splash",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#DDFD00',
    },
    font: {
      value: 'duru-sans',
      color: '#F94071',
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
    id: 'styles-Gold-Shimmer',
    name: "Gold Shimmer",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#FFEF58',
    },
    font: {
      value: 'duru-sans',
      color: '#2D3440',
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
    id: 'styles-Pastel-Green',
    name: "Pastel Green",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#FDF7C1',
    },
    font: {
      value: 'duru-sans',
      color: '#49CDAE',
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
    id: 'styles-Forest-Green',
    name: "Forest Green",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#14473F',
    },
    font: {
      value: 'duru-sans',
      color: '#12BA24',
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
    id: 'styles-Teal-Oasis',
    name: "Teal Oasis",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#0FCE3E',
    },
    font: {
      value: 'duru-sans',
      color: '#104462',
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
    id: 'styles-Lush-Foliage',
    name: "Lush Foliage",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#4A5E46',
    },
    font: {
      value: 'duru-sans',
      color: '#B5CEC1',
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
    id: 'styles-Mint-Whisper',
    name: "Mint Whisper",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#192D1B',
    },
    font: {
      value: 'duru-sans',
      color: '#D6C3CD',
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
    id: 'styles-Soft-Sprout',
    name: "Soft Sprout",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#A2CA57',
    },
    font: {
      value: 'duru-sans',
      color: '#2B5251',
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
    id: 'styles-Cool-Dusk',
    name: "Cool Dusk",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#041F2A',
    },
    font: {
      value: 'duru-sans',
      color: '#96DEA7',
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
    id: 'styles-Fresh-Green',
    name: "Fresh Green",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#00FC69',
    },
    font: {
      value: 'duru-sans',
      color: '#5C0089',
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
    id: 'styles-Seafoam-Breeze',
    name: "Seafoam Breeze",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#062129',
    },
    font: {
      value: 'duru-sans',
      color: '#9DDBA8',
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
    id: 'styles-Peacock-Tail',
    name: "Peacock Tail",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#19CBB1',
    },
    font: {
      value: 'duru-sans',
      color: '#394155',
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
    id: 'styles-Misty-Evening',
    name: "Misty Evening",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#1B4946',
    },
    font: {
      value: 'duru-sans',
      color: '#DA9688',
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
    id: 'styles-Forest-Trail',
    name: "Forest Trail",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#2EC28A',
    },
    font: {
      value: 'duru-sans',
      color: '#1E515D',
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
    id: 'styles-Marine-Galaxy',
    name: "Marine Galaxy",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#02D7B5',
    },
    font: {
      value: 'duru-sans',
      color: '#383E53',
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
    id: 'styles-Cloudy-Night',
    name: "Cloudy Night",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#084047',
    },
    font: {
      value: 'duru-sans',
      color: '#DC948D',
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
    id: 'styles-Charcoal-Grass',
    name: "Charcoal Grass",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#004548',
    },
    font: {
      value: 'duru-sans',
      color: '#E87868',
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
    id: 'styles-Dusk-Wave',
    name: "Dusk Wave",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#68D9D6',
    },
    font: {
      value: 'duru-sans',
      color: '#8C53B5',
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
    id: 'styles-Aquamarine-Whisper',
    name: "Aquamarine Whisper",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#006B99',
    },
    font: {
      value: 'duru-sans',
      color: '#E0CAE8',
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
    id: 'styles-Blue-Mosaic',
    name: "Blue Mosaic",
    previewImage: "",
    background: {
      type: 'flat',
      value: '#3889AC',
    },
    font: {
      value: 'duru-sans',
      color: '#ECDDC8',
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

// Templates Start Here
{
  id: 'template-milky',
  name: "Milky",
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
  
  
];
