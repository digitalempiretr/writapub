export type CanvasElement = {
  id: string;
  type: 'image' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  alignment: 'left' | 'center' | 'right';
  // Image specific
  url?: string;
  shape?: 'square' | 'circle';
  // Text specific
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  lineHeight?: number;
  color?: string;
};
