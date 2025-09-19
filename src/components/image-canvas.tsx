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
    const words = text.split(/(\s+)/); // Split by whitespace, keeping the whitespace
    let line = '';
    const lines = [];
    const maxLines = Math.floor(maxHeight / lineHeight);

    for (const word of words) {
        if (lines.length >= maxLines) {
            break;
        }

        const testLine = line + word;
        const metrics = context.measureText(testLine);
        
        if (metrics.width > maxWidth && line.length > 0) {
            lines.push(line);
            line = word.trimStart();
        } else {
            line = testLine;
        }
    }
    
    if (lines.length < maxLines && line.length > 0) {
        lines.push(line);
    }
    
    const visibleText = lines.join('').trimEnd();
    let remainingText: string | null = null;
    
    if (visibleText.length < text.length) {
      // Find where visibleText ends and get the rest of the original text
      const lastChar = visibleText[visibleText.length - 1];
      const lastWord = visibleText.split(/(\s+)/).pop() || '';
      const textAfterVisible = text.substring(visibleText.length);

      // This logic is tricky. We need to find the exact point of split.
      // The easiest way is to count the words used.
      const visibleWords = visibleText.split(/(\s+)/);
      let originalWordsIndex = 0;
      let visibleWordsIndex = 0;
      
      while(originalWordsIndex < words.length && visibleWordsIndex < visibleWords.length) {
          if (words[originalWordsIndex] === visibleWords[visibleWordsIndex]) {
              visibleWordsIndex++;
          }
          originalWordsIndex++;
      }

      // Sometimes the last word is partially included. We need to handle that.
      if (text.startsWith(visibleText)) {
          remainingText = text.substring(visibleText.length).trim();
      } else {
           // Fallback for more complex splits
           const allWords = text.split(/(\s+)/);
           const visibleWordCount = visibleText.split(/(\s+)/).length;
           remainingText = allWords.slice(visibleWordCount).join('').trim();
      }
       if (remainingText === "") {
        remainingText = null;
      }
    }

    return { visibleText, remainingText };
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
  
  // First, calculate the number of lines and the total height
  const lines: string[] = [];
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const testLine = line + word + (i === words.length - 1 ? "" : " ");
    if (context.measureText(testLine).width > maxWidth && line !== "") {
      lines.push(line.trim());
      line = word + " ";
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());

  const totalTextHeight = (lines.length -1) * lineHeight;
  let currentY = y - totalTextHeight / 2;

  // Now, draw the text
  for(const line of lines) {
    context.fillText(line.trim(), x, currentY);
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
        ctx.textBaseline = 'middle';
        
        const textMaxWidth = 730;
        const textBlockHeight = isTitle ? 1000 : (isPaginated ? 1000 : 950);
        
        const lineHeight = isTitle ? font.titleSize * 1.2 : font.lineHeight;
        ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;
        
        const { visibleText, remainingText } = measureText(
          ctx,
          text,
          textMaxWidth,
          textBlockHeight,
          lineHeight,
        );
        
        const textX = rectX + (rectWidth - textMaxWidth) / 2;
        const startY = rectY + rectHeight / 2;
        
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
