import type { DesignTemplate } from './types';

// Omit 'id' as Firestore will generate it automatically.
export const seedData: Omit<DesignTemplate, 'id' | 'userId'>[] = [
  // Authors Templates
  {
    name: "Daktilo",
    category: 'Authors Templates',
    previewImage: "https://i.ibb.co/N6Qvdnbw/daktilo-template.jpg",
    canvasSize: 'Post',
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
    effect: {
      id: 'none',
    }
  },
  {
    name: "Milky",
    category: 'Authors Templates',
    previewImage: "https://i.ibb.co/zhYZ5H5V/milky-1.jpg",
    canvasSize: 'Post',
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
    effect: {
      id: 'none',
    }
  },
  // Special Effects
  {
    name: 'Retro',
    category: 'Special Effects',
    previewImage: 'https://i.ibb.co/Txg2jcJz/bg.jpg',
    background: { type: 'image', value: 'https://i.ibb.co/Txg2jcJz/bg.jpg' },
    font: { value: 'special-elite', color: '#FFFFFF', fontSize: 48 },
    textBox: { color: '#000000', opacity: 0.5 },
    overlay: { color: '#000000', opacity: 0.3 },
    canvasSize: 'Post',
    effect: { id: 'retro' }
  },
  // Color Styles
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
    name: 'Oceanic Blue',
    category: 'Color Styles',
    previewImage: '',
    background: { type: 'flat', value: '#0077b6' },
    font: { value: 'lato', color: '#03045e', fontSize: 48 },
    textBox: { color: '#caf0f8', opacity: 0.7 },
    overlay: { color: '#000000', opacity: 0 },
    canvasSize: 'Post',
    effect: { id: 'none' }
  },
  // Gradient Styles
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
];
