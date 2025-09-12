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
  const words = text.replace(/\n/g, ' \n ').split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    if (words[n] === '\n') {
        context.fillText(line, x, currentY);
        line = "";
        currentY += lineHeight;
        continue;
    }
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
            ctx.drawImage(img, 0, 0, width, height);

            // Centered Rectangle
            const rectWidth = 830;
            const rectHeight = 1100;
            const rectX = (width - rectWidth) / 2;
            const rectY = (height - rectHeight) / 2;
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

            // Text
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'left';
            ctx.textBaseline = 'top';
            
            const textMaxWidth = 730;
            const textPaddingHorizontal = (rectWidth - textMaxWidth) / 2;
            const textX = rectX + textPaddingHorizontal;
            
            let combinedText = (title ? `${title}\n\n` : '') + text;
            
            // Measure total text height to center it vertically
            const measureLines = (textToMeasure: string, maxWidth: number, fontStyle: string) => {
                ctx.font = fontStyle;
                const words = textToMeasure.replace(/\n/g, ' \n ').split(' ');
                let line = '';
                const lines = [];
                for(let i = 0; i < words.length; i++) {
                    if (words[i] === '\n') {
                        lines.push(line);
                        line = '';
                        continue;
                    }
                    const testLine = line + words[i] + ' ';
                    if (ctx.measureText(testLine).width > maxWidth && i > 0) {
                        lines.push(line);
                        line = words[i] + ' ';
                    } else {
                        line = testLine;
                    }
                }
                lines.push(line);
                return lines;
            }
            
            const titleLines = title ? measureLines(title, textMaxWidth, `${font.titleWeight} ${font.titleSize}px "${font.titleFont}"`) : [];
            const bodyLines = measureLines(text, textMaxWidth, `${font.bodyWeight} ${font.bodySize}px "${font.bodyFont}"`);
            
            const titleHeight = title ? (titleLines.length * (font.titleSize * 1.2)) + (font.lineHeight * 0.5) : 0;
            const bodyHeight = bodyLines.length * font.lineHeight;
            const totalTextHeight = titleHeight + bodyHeight;

            let startY = rectY + (rectHeight - totalTextHeight) / 2;

            if (title) {
                ctx.font = `${font.titleWeight} ${font.titleSize}px "${font.titleFont}"`;
                startY = wrapText(ctx, title, textX, startY, textMaxWidth, font.titleSize * 1.2) + font.lineHeight * 0.5;
            }

            ctx.font = `${font.bodyWeight} ${font.bodySize}px "${font.bodyFont}"`;
            wrapText(ctx, text, textX, startY, textMaxWidth, font.lineHeight);
            
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
