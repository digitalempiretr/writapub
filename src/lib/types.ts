export type DesignTemplate = {
    id: string;
    name: string;
    category: 'Special Effects' | 'Color Styles' | 'Authors Templates' | 'Gradient Styles' | 'Favorites';
    previewImage: string;
    userId?: string;
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
  