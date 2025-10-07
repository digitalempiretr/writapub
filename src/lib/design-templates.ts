
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
    id: 'template-1',
    name: "Classic Read",
    previewImage: "https://i.ibb.co/60jqfPL/12.jpg",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/1209843/pexels-photo-1209843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    font: {
      value: 'special-elite',
      color: '#1A2E3B',
    },
    textBox: {
      color: '#EDE8E4',
      opacity: 0.75,
    },
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  },
  {
    id: 'template-2',
    name: "Bold Statement",
    previewImage: "https://i.ibb.co/JqWk8Vk/image.png",
    background: {
      type: 'image',
      value: 'https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    font: {
      value: 'anton',
      color: '#FFFFFF',
    },
    textBox: {
      color: '#000000',
      opacity: 0,
    },
    overlay: {
      color: '#000000',
      opacity: 0.3,
    },
  },
    {
    id: 'template-3',
    name: "Serene Gradient",
    previewImage: "https://i.ibb.co/k4H8kcn/template-3-preview.jpg",
    background: {
      type: 'gradient',
      value: gradientTemplates.find(g => g.name === 'Royal')?.css || gradientTemplates[0].css,
    },
    font: {
      value: 'josefin-sans',
      color: '#FFFFFF', 
    },
    textBox: {
      color: '#FFFFFF',
      opacity: 0.15,
    },
    overlay: {
      color: '#000000',
      opacity: 0,
    },
  },
];
