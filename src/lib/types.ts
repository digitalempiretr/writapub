
export type Design = {
  text: string;
  isTitle: boolean;
};

export type TextAlign = 'left' | 'center' | 'right';
export type BackgroundType = 'flat' | 'gradient' | 'image';
export type CanvasSize = { name: 'Post' | 'Story' | 'Square'; width: number; height: number };

export type Shadow = {
  id: number;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  offsetXUnit: string;
  offsetYUnit: string;
  blurUnit: string;
};
