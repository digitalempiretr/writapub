import type { DesignTemplate } from './types';

export const seedData: Omit<DesignTemplate, 'id'>[] = [
    {
        name: 'Retro',
        category: 'Special Effects',
        previewImage: 'https://i.ibb.co/Txg2jcJz/bg.jpg',
        background: { type: 'image', value: 'https://i.ibb.co/Txg2jcJz/bg.jpg' },
        font: { value: 'special-elite', color: '#FFFFFF', fontSize: 48 },
        textBox: { color: '#000000', opacity: 0.5 },
        overlay: { color: '#000000', opacity: 0.3 },
        canvasSize: 'Post',
        effect: { id: 'none' }
      },
      {
        name: 'Minimalist Black',
        category: 'Color Styles',
        previewImage: '',
        background: { type: 'flat', value: '#0a0a0a' },
        font: { value: 'inter', color: '#fcfcfc', fontSize: 48 },
        textBox: { color: '#000000', opacity: 0 },
        overlay: { color: '#000000', opacity: 0 },
        canvasSize: 'Post',
        effect: { id: 'none' }
      },
      {
        name: 'Sunrise Gradient',
        category: 'Gradient Styles',
        previewImage: '',
        background: { type: 'gradient', value: 'linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)' },
        font: { value: 'instrument-serif', color: '#212121', fontSize: 48 },
        textBox: { color: '#ffffff', opacity: 0 },
        overlay: { color: '#000000', opacity: 0 },
        canvasSize: 'Post',
        effect: { id: 'none' }
      },
      {
        name: 'Oceanic Blue',
        category: 'Color Styles',
        previewImage: '',
        background: { type: 'flat', value: '#0077b6' },
        font: { value: 'lato', color: '#03045e', fontSize: 48 },
        textBox: { color: '#caf0f8', opacity: 0.7 },
        overlay: { color: '#000000', opacity: 0 },
        canvasSize: 'Post',
        effect: { id: 'none' }
      }
];
