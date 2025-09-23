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
  backgroundImageUrl?: string;
  isPaginated?: boolean;
  onTextRemaining: (remainingText: string) => void;
  isLastCanvas: boolean;
};

// This function measures the text and splits it if it exceeds the max lines.
const measureAndSplitText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): { textForCanvas: string; remainingText: string } => {
  const paragraphs = text.split('\n\n');
  let currentLines: string[] = [];
  let remainingParagraphs = [];
  let textForCanvas = '';
  let remainingText = '';

  let linesProcessed = false;

  for (let pIndex = 0; pIndex < paragraphs.length; pIndex++) {
    const paragraph = paragraphs[pIndex];
    const words = paragraph.split(' ');
    let line = '';

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      let testLine = line + word + ' ';
      
      if (context.measureText(testLine).width > maxWidth && i > 0) {
        if (currentLines.length < maxLines) {
          currentLines.push(line);
          line = word + ' ';
        } else {
          remainingParagraphs.push([line.trim(), ...words.slice(i)].join(' '));
          linesProcessed = true;
          break;
        }
      } else {
        line = testLine;
      }
    }

    if (linesProcessed) {
      break;
    }

    if (currentLines.length < maxLines) {
      currentLines.push(line);
      // Add a blank line for paragraph breaks, if we have room
      if (pIndex < paragraphs.length - 1 && currentLines.length < maxLines) {
        currentLines.push('');
      }
    } else {
      remainingParagraphs.push(line.trim());
    }
  }

  textForCanvas = currentLines.map(l => l.trim()).join('\n');
  
  if (remainingParagraphs.length > 0) {
    remainingText = remainingParagraphs.join(' ') + '\n\n' + paragraphs.slice(paragraphs.findIndex(p => p.startsWith(remainingParagraphs[0])) + 1).join('\n\n');
  }

  // Check if remaining paragraphs are just empty strings
  if (paragraphs.slice(paragraphs.findIndex(p => p.startsWith(remainingParagraphs[0])) + 1).join('\n\n').trim() === "") {
    remainingText = remainingParagraphs.join(" ");
  }

  return { textForCanvas, remainingText: remainingText.trim() };
};


const wrapAndDrawText = (
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) => {
  const lines = text.split("\n");
  const totalTextHeight = (lines.length -1) * lineHeight;
  let currentY = y - totalTextHeight / 2;

  for(const line of lines) {
    context.fillText(line, x, currentY);
    currentY += lineHeight;
  }
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
  backgroundImageUrl,
  onTextRemaining,
  isLastCanvas,
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
      
      const textMaxWidth = 730;
      ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;

      let textToDraw = text;
      let remainingText = '';

      if (!isTitle) {
        const result = measureAndSplitText(ctx, text, textMaxWidth, 12);
        textToDraw = result.textForCanvas;
        remainingText = result.remainingText;
      }

      const drawLayout = () => {
        const rectWidth = 830;
        const rectHeight = 1100;
        const rectX = (width - rectWidth) / 2;
        const rectY = (height - rectHeight) / 2;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        const lineHeight = isTitle ? font.titleSize * 1.2 : font.lineHeight;
        ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;
        
        const textX = rectX + (rectWidth - textMaxWidth) / 2;
        const startY = rectY + rectHeight / 2;
        
        wrapAndDrawText(ctx, textToDraw, textX, startY, textMaxWidth, lineHeight);

        if (isLastCanvas && !isTitle) {
          onTextRemaining(remainingText);
        }
        
        onCanvasReady(canvas);
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
            sHeight = img.height;
            sWidth = img.height * canvasAspect;
            sx = (img.width - sWidth) / 2;
            sy = 0;
          } else {
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
  }, [text, isTitle, font, backgroundColor, textColor, width, height, onCanvasReady, backgroundImageUrl, onTextRemaining, isLastCanvas]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
}
