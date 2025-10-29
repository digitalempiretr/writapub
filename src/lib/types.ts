
import type { CSSProperties } from 'react';

export type TextEffect = {
  name: string;
  id: string;
  style: {
    color?: string;
    textShadow?: string;
    glowColor?: string; 
    fontFamily?: string;
    fontWeight?: string | number;
    fontSmoothing?: CSSProperties;
    fontSize?: number | string; 
  };
  fontValue?: string; 
  previewBg?: string;
};

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

export type UserProfile = {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'admin' | 'user';
};
