"use client";

import { useEffect, useRef } from "react";

export type FontOption = {
  value: string;
  label: string;
  fontFamily: string;
  bodyWeight: string | number;
  titleWeight: string | number;
  titleSize: number;
  bodySize: number;
  lineHeight: number;
};

type ImageCanvasProps = {
  text: string;
  isTitle: boolean;
  font: FontOption;
  backgroundColor?: string;
  textColor: string;
  width: number;
  height: number;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  onTextRemaining: (remainingText: string | null) => void;
  backgroundImageUrl?: string;
  isPaginated?: boolean;
};

// This function calculates how much text fits and returns the remaining text.
const measureText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxHeight: number,
  lineHeight: number
): { visibleText: string; remainingText: string | null } => {
  const words = text.replace(/\n/g, ' \n ').split(" ");
  let currentLine = "";
  let visibleText = "";
  let lineCount = 0;
  const maxLines = Math.floor(maxHeight / lineHeight);

  for (let n = 0; n < words.length; n++) {
    if (lineCount >= maxLines) {
      const remainingWords = words.slice(n);
      return {
        visibleText,
        remainingText: remainingWords.join(" ").replace(/ \n /g, '\n').trim()
      };
    }
    
    if (words[n] === '\n') {
      visibleText += currentLine.trim() + '\n';
      lineCount++;
      currentLine = "";
      continue;
    }

    const testLine = currentLine + words[n] + " ";
    const metrics = context.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      visibleText += currentLine;
      lineCount++;
      currentLine = words[n] + " ";
    } else {
      currentLine = testLine;
    }
  }

  visibleText += currentLine;
  
  // Check if the last line exceeds the max lines
  if(lineCount + 1 > maxLines && visibleText.trim().length < text.trim().length) {
    const lastWordIndex = visibleText.trim().lastIndexOf(' ');
    const remaining = text.substring(lastWordIndex).trim();
    return {
      visibleText: visibleText.substring(0, lastWordIndex).trim(),
      remainingText: remaining,
    }
  }


  return { visibleText: visibleText.trim(), remainingText: null };
};

const wrapAndDrawText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const words = text.split(" ");
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
};

export function ImageCanvas({
  text,
  isTitle,
  font,
  backgroundColor,
  textColor,
  width,
  height,
  onCanvasReady,
  onTextRemaining,
  backgroundImageUrl,
  isPaginated = false,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const fontWeight = isTitle ? font.titleWeight : font.bodyWeight;
      const fontSize = isTitle ? font.titleSize : font.bodySize;
      const fontName = font.fontFamily;

      await document.fonts.load(`${fontWeight} ${fontSize}px "${fontName}"`);
      
      ctx.clearRect(0, 0, width, height);

      const drawLayout = () => {
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
        const textBlockHeight = isTitle ? 1000 : (isPaginated ? 1000 : 950);
        
        const lineHeight = isTitle ? font.titleSize * 1.2 : font.lineHeight;
        ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;
        
        // Measure and split text
        const { visibleText, remainingText } = measureText(
          ctx,
          text,
          textMaxWidth,
          textBlockHeight,
          lineHeight,
        );

        // Calculate vertical center
        const lines = visibleText.split('\n');
        const totalTextHeight = lines.reduce((acc, line) => {
            const metrics = ctx.measureText(line);
            // This is a simplification; a more accurate measurement would be needed for complex scripts
            const fontHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
            return acc + Math.max(lineHeight, fontHeight);
        }, 0);
        
        const textX = rectX + (rectWidth - textMaxWidth) / 2;
        let startY = rectY + (rectHeight - totalTextHeight) / 2;
        
        // Draw the visible text
        wrapAndDrawText(ctx, visibleText, textX, startY, textMaxWidth, lineHeight);

        onCanvasReady(canvas);
        onTextRemaining(remainingText);
      };


      if (backgroundImageUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = backgroundImageUrl;
        img.onload = () => {
          const canvasAspect = width / height;
          const imageAspect = img.width / img.height;
          let sx, sy, sWidth, sHeight;

          if (imageAspect > canvasAspect) {
            // Image is wider than canvas
            sHeight = img.height;
            sWidth = img.height * canvasAspect;
            sx = (img.width - sWidth) / 2;
            sy = 0;
          } else {
            // Image is taller than or same aspect as canvas
            sWidth = img.width;
            sHeight = img.width / canvasAspect;
            sx = 0;
            sy = (img.height - sHeight) / 2;
          }
          
          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, width, height);
          drawLayout();
        };
        img.onerror = () => {
          ctx.fillStyle = "#ccc";
          ctx.fillRect(0,0,width,height);
          drawLayout();
        }
      } else if (backgroundColor && backgroundColor.startsWith("linear-gradient")) {
        const colors = backgroundColor.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/g);
        if (colors && colors.length >= 2) {
          const gradient = ctx.createLinearGradient(0, 0, width, height);
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(1, colors[1]);
          ctx.fillStyle = gradient;
        } else {
           ctx.fillStyle = "#ffffff";
        }
        ctx.fillRect(0, 0, width, height);
        drawLayout();
      } else {
        ctx.fillStyle = backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
        drawLayout();
      }
    };

    draw();
  }, [text, isTitle, font, backgroundColor, textColor, width, height, onCanvasReady, onTextRemaining, backgroundImageUrl, isPaginated]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
}
