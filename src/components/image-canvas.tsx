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
      
      // Await fonts to be ready
      await document.fonts.ready;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw background
      if (backgroundColor.startsWith("linear-gradient")) {
        // Basic parsing for 2-color linear gradient
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
      const sidePadding = 30; // 20px inner spacing + 10px text margin
      const topPadding = 60;
      const maxWidth = width - (sidePadding * 2);
      let currentY = topPadding;

      ctx.fillStyle = textColor;
      ctx.textAlign = "left";
      ctx.textBaseline = "top";
      
      // Draw Title if it exists
      if (title) {
        ctx.font = `${font.titleWeight} ${font.titleSize}px ${font.titleFont}`;
        currentY = wrapText(ctx, title, sidePadding, currentY, maxWidth, font.titleSize * 1.2) + font.lineHeight * 0.5;
      }

      // Draw Body Text
      ctx.font = `${font.bodyWeight} ${font.bodySize}px ${font.bodyFont}`;
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
