"use client";

import { useEffect, useRef } from "react";

export type FontOption = {
  value: string;
  label: string;
  titleFont: string;
  bodyFont: string;
  bodyWeight: string | number;
  titleWeight: string | number;
  titleSize: number;
  bodySize: number;
  lineHeight: number;
};

type ImageCanvasProps = {
  text: string;
  title?: string;
  font: FontOption;
  backgroundColor: string;
  textColor: string;
  width: number;
  height: number;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
};

// Helper function to wrap text on canvas
const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.replace(/\n/g, ' ').split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, currentY);
  return currentY + lineHeight;
};

// Helper function to draw the special paper effect template
const drawPaperEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    text: string,
    font: FontOption,
    title?: string,
) => {
    return new Promise<void>((resolve) => {
        // Background
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, width, height);

        // Background Image
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = "https://picsum.photos/seed/1/1080/1350";
        img.onload = () => {
            ctx.globalAlpha = 0.5; // Grayscale effect by reducing opacity on black bg
            ctx.drawImage(img, 0, 0, width, height);
            ctx.globalAlpha = 1.0;

            // Border
            ctx.strokeStyle = '#8B5CF6'; // purple-500
            ctx.lineWidth = 16;
            ctx.strokeRect(0, 0, width, height);

            // Paper
            const paperWidth = width * 0.85;
            const paperHeight = height * 0.7; // Adjusted for better fit
            const paperX = (width - paperWidth) / 2;
            const paperY = (height - paperHeight) / 2;

            ctx.fillStyle = 'white';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 30;
            ctx.shadowOffsetX = 5;
            ctx.shadowOffsetY = 5;
            ctx.fillRect(paperX, paperY, paperWidth, paperHeight);
            
            // Reset shadow for text
            ctx.shadowColor = 'transparent';

            // Paper crease
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(paperX, paperY + paperHeight / 2);
            ctx.lineTo(paperX + paperWidth, paperY + paperHeight / 2);
            ctx.stroke();

            // Text
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            const textPadding = 40;
            const maxWidth = paperWidth - textPadding * 2;
            
            const combinedText = (title ? `${title.toUpperCase()}\n\n` : '') + text.toUpperCase();

            ctx.font = `${font.bodyWeight} ${font.bodySize}px "${font.bodyFont}"`;

            // Manual wrapping for downloaded canvas
            const words = combinedText.split(' ');
            let line = '';
            const lines = [];

            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (word.includes('\n')) {
                    const parts = word.split('\n');
                    const testLineBeforeBreak = line + parts[0];
                    if (ctx.measureText(testLineBeforeBreak).width > maxWidth) {
                        lines.push(line.trim());
                        line = parts[0] + ' ';
                    } else {
                        line = testLineBeforeBreak + ' ';
                    }
                    
                    lines.push(line.trim());
                    line = ''; // Start new line after break
                    
                    if(parts[1]) {
                       line += parts[1] + ' ';
                    }
                     // Handle multiple breaks
                    for(let j = 2; j < parts.length; j++) {
                        lines.push('');
                        line += parts[j] + ' ';
                    }

                } else {
                    const testLine = line + word + ' ';
                    if (ctx.measureText(testLine).width > maxWidth && line.length > 0) {
                        lines.push(line.trim());
                        line = word + ' ';
                    } else {
                        line = testLine;
                    }
                }
            }
            lines.push(line.trim());

            const totalHeight = lines.length * font.lineHeight;
            let startY = paperY + (paperHeight - totalHeight) / 2;

            lines.forEach((l) => {
                ctx.fillText(l, paperX + textPadding, startY);
                startY += font.lineHeight;
            });

            resolve();
        };
        img.onerror = () => {
             // Draw fallback if image fails
             ctx.fillStyle = "#ccc";
             ctx.fillRect(0,0,width,height);
             resolve();
        }
    });
}


export function ImageCanvas({
  text,
  title,
  font,
  backgroundColor,
  textColor,
  width,
  height,
  onCanvasReady,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      await document.fonts.ready;
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor === 'paper-effect') {
          await drawPaperEffect(ctx, width, height, text, font, title);
          onCanvasReady(canvas);
          return;
      }


      // Draw background
      if (backgroundColor.startsWith("linear-gradient")) {
        const colors = backgroundColor.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g);
        if (colors && colors.length >= 2) {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(1, colors[1]);
          ctx.fillStyle = gradient;
        } else {
           ctx.fillStyle = "#ffffff";
        }
      } else {
        ctx.fillStyle = backgroundColor;
      }
      ctx.fillRect(0, 0, width, height);
      
      // Text properties
      const sidePadding = 30;
      const topPadding = 60;
      const maxWidth = width - (sidePadding * 2);
      let currentY = topPadding;

      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      
      // Draw Title if it exists
      if (title) {
        ctx.font = `${font.titleWeight} ${font.titleSize}px "${font.titleFont}"`;
        currentY = wrapText(ctx, title, sidePadding, currentY, maxWidth, font.titleSize * 1.2) + font.lineHeight * 0.5;
      }

      // Draw Body Text
      ctx.font = `${font.bodyWeight} ${font.bodySize}px "${font.bodyFont}"`;
      wrapText(ctx, text, sidePadding, currentY, maxWidth, font.lineHeight);

      onCanvasReady(canvas);
    };

    draw();
  }, [text, title, font, backgroundColor, textColor, width, height, onCanvasReady]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
}
