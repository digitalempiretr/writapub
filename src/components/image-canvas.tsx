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
  backgroundImageUrl?: string;
};

// Helper function to wrap text on canvas
const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
) => {
  context.font = font;
  const words = text.replace(/\n/g, ' \n ').split(" ");
  let line = "";
  let currentY = y;
  const lines = [];

  for (let n = 0; n < words.length; n++) {
    if (words[n] === '\n') {
        lines.push(line);
        line = "";
        continue;
    }
    const testLine = line + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  for (const l of lines) {
    context.fillText(l.trim(), x, currentY);
    currentY += lineHeight;
  }
  return { finalY: currentY, lines: lines };
};


export function ImageCanvas({
  text,
  title,
  font,
  backgroundColor,
  textColor,
  width,
  height,
  onCanvasReady,
  backgroundImageUrl
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      await document.fonts.load(`${font.bodyWeight} ${font.bodySize}px "${font.bodyFont}"`);
      await document.fonts.load(`${font.titleWeight} ${font.titleSize}px "${font.titleFont}"`);
      
      ctx.clearRect(0, 0, width, height);

      if (backgroundColor === 'paper-effect' && backgroundImageUrl) {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = backgroundImageUrl;
          img.onload = async () => {
              ctx.drawImage(img, 0, 0, width, height);

              const rectWidth = 830;
              const rectHeight = 1100;
              const rectX = (width - rectWidth) / 2;
              const rectY = (height - rectHeight) / 2;
              
              ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
              ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

              ctx.fillStyle = textColor;
              ctx.textAlign = 'left';
              ctx.textBaseline = 'top';
              
              const textMaxWidth = 730;
              const textBlockHeight = 950;
              
              ctx.font = `${font.bodyWeight} ${font.bodySize}px "${font.bodyFont}"`;

              const words = text.replace(/\n/g, ' \n ').split(' ');
              let line = '';
              const allLines = [];
              for(let i = 0; i < words.length; i++) {
                  if (words[i] === '\n') {
                      allLines.push(line);
                      line = '';
                      continue;
                  }
                  const testLine = line + words[i] + ' ';
                  if (ctx.measureText(testLine).width > textMaxWidth && i > 0) {
                      allLines.push(line);
                      line = words[i] + ' ';
                  } else {
                      line = testLine;
                  }
              }
              allLines.push(line);
              
              const totalTextHeight = allLines.length * font.lineHeight;
              const textX = rectX + (rectWidth - textMaxWidth) / 2;
              let startY = rectY + (rectHeight - Math.min(totalTextHeight, textBlockHeight)) / 2;
              
              wrapText(ctx, text, textX, startY, textMaxWidth, font.lineHeight, ctx.font);

              onCanvasReady(canvas);
          };
          img.onerror = () => {
              ctx.fillStyle = "#ccc";
              ctx.fillRect(0,0,width,height);
              ctx.fillStyle = "red";
              ctx.fillText("Image failed to load", 10, 10);
              onCanvasReady(canvas);
          }
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
        const titleFont = `${font.titleWeight} ${font.titleSize}px "${font.titleFont}"`;
        const { finalY } = wrapText(ctx, title, sidePadding, currentY, maxWidth, font.titleSize * 1.2, titleFont);
        currentY = finalY + font.lineHeight * 0.5;
      }

      // Draw Body Text
      const bodyFont = `${font.bodyWeight} ${font.bodySize}px "${font.bodyFont}"`;
      wrapText(ctx, text, sidePadding, currentY, maxWidth, font.lineHeight, bodyFont);

      onCanvasReady(canvas);
    };

    draw();
  }, [text, title, font, backgroundColor, textColor, width, height, onCanvasReady, backgroundImageUrl]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
}
