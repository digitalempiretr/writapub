
export type CanvasSize = { name: 'Post' | 'Story' | 'Square'; width: number; height: number };

export const canvasSizes: CanvasSize[] = [
    { name: 'Post', width: 1080, height: 1350 },
    { name: 'Story', width: 1080, height: 1920 },
    { name: 'Square', width: 1080, height: 1080 },
];
