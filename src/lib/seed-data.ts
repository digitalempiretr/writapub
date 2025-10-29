import { gradientTemplates } from "./colors";

export const designTemplatesSeed = [
    {
      id: 'template-retro',
      name: "Retro",
      category: 'Special Effects',
      previewImage: "https://i.ibb.co/3s6qP5s/template-retro.jpg",
      canvasSize: 'Post',
      background: {
        type: 'image',
        value: "https://i.ibb.co/KjNBYSM/bg-clouds.jpg",
      },
      font: {
        value: 'anton',
        color: '#EADDD7',
        fontSize: 48,
      },
      textBox: {
        color: '#D44D5C',
        opacity: 0.8,
      },
      overlay: {
        color: '#4C6099',
        opacity: 0.5,
      },
      effect: {
        id: 'retro',
      }
    },
    {
      id: 'template-soft-blur',
      name: "Soft Blur",
      category: 'Special Effects',
      previewImage: "https://i.ibb.co/689X1kT/template-soft-blur.jpg",
      canvasSize: 'Post',
      background: {
        type: 'image',
        value: "https://i.ibb.co/gFTNhzN/bg-pink-Dock.jpg",
      },
      font: {
        value: 'poppins',
        color: '#333',
        fontSize: 48,
      },
      textBox: {
        color: '#FFFFFF',
        opacity: 0.7,
      },
      overlay: {
        color: '#F4F4F4',
        opacity: 0.3,
      },
      effect: {
        id: 'softBlur',
      }
    },
    {
      id: 'template-neon',
      name: "Neon",
      category: 'Special Effects',
      previewImage: "https://i.ibb.co/CbfVfHk/template-neon.jpg",
      canvasSize: 'Post',
      background: {
        type: 'image',
        value: 'https://i.ibb.co/G44Pqbx/bg2.jpg',
      },
      font: {
        value: 'tilt-neon',
        color: '#FFFFFF',
        fontSize: 48,
      },
      textBox: {
        color: '#000000',
        opacity: 0,
      },
      overlay: {
        color: '#000000',
        opacity: 0.4,
      },
      effect: {
        id: 'neon',
      }
    },
     {
      id: 'template-minimal-black',
      name: "Minimalist Black",
      category: 'Color Styles',
      previewImage: 'https://i.ibb.co/pPmnGq1/template-minimal-black.jpg',
      canvasSize: 'Post',
      background: {
        type: 'flat',
        value: '#000000',
      },
      font: {
        value: 'inter',
        color: '#FFFFFF',
        fontSize: 48,
      },
      textBox: {
        color: '#000000',
        opacity: 0,
      },
      overlay: {
        color: '#000000',
        opacity: 0,
      },
    },
    {
      id: 'template-oceanic-blue',
      name: "Oceanic Blue",
      category: 'Color Styles',
      previewImage: 'https://i.ibb.co/f2c90zQ/template-oceanic-blue.jpg',
      canvasSize: 'Post',
      background: {
        type: 'flat',
        value: '#0A2540',
      },
      font: {
        value: 'lato',
        color: '#FFFFFF',
        fontSize: 48,
      },
      textBox: {
        color: '#FFFFFF',
        opacity: 0.9,
      },
      overlay: {
        color: '#000000',
        opacity: 0,
      },
    },
    {
      id: 'template-sunrise-gradient',
      name: "Sunrise Gradient",
      category: 'Gradient Styles',
      previewImage: 'https://i.ibb.co/yQ0C1Pr/template-sunrise-gradient.jpg',
      canvasSize: 'Post',
      background: {
        type: 'gradient',
        value: gradientTemplates.find(g => g.name === 'Peach')?.css || 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)',
      },
      font: {
        value: 'playfair-display',
        color: '#4A2C2A',
        fontSize: 52,
      },
      textBox: {
        color: '#FFFFFF',
        opacity: 0.5,
      },
      overlay: {
        color: '#FFFFFF',
        opacity: 0,
      },
    }
  ];
