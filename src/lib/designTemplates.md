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

export type TextEffect = {
  name: string;
  id: string;
  style: {
    color?: string;
    textShadow?: string;
    glowColor?: string; // Add this for effects like Neon
    fontFamily?: string;
    fontWeight?: string | number;
    fontSmoothing?: CSSProperties;
    fontSize?: number | string; // Base size for this effect
  };
  fontValue?: string; // Add this to link to a FontOption
  previewBg?: string;
};