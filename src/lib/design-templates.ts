
import { fontOptions } from './font-options';
import { gradientTemplates } from './colors';

export type DesignTemplate = {
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
    name: "Classic Read",
    previewImage: "https://i.ibb.co/60jqfPL0/12.jpg",
    background: {
      type: 'image',
      value: 'https://i.ibb.co/60jqfPL0/12.jpg',
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
    name: "Bold Statement",
    previewImage: "https://i.ibb.co/395BJVBs/24.jpg",
    background: {
      type: 'image',
      value: 'https://i.ibb.co/395BJVBs/24.jpg',
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
