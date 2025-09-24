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
  onTextRemaining: (remainingText: string) => void;
  isLastCanvas: boolean;
};

// This function wraps text for titles.
const wrapText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] => {
  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = words[0] || '';

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = context.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
};


// This function measures the text and splits it if it exceeds the max lines.
const measureAndSplitText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number
): { textForCanvas: string; remainingText: string, lines: string[] } => {
  const words = text.split(/(\s+)/); // Split by whitespace, keeping the whitespace
  let line = '';
  let lines: string[] = [];
  let remainingWords = [...words];

  while (lines.length < maxLines && remainingWords.length > 0) {
    let currentWord = remainingWords.shift() || '';
    let testLine = line + currentWord;
    let metrics = context.measureText(testLine);
    
    if (metrics.width > maxWidth && line !== '') {
      lines.push(line);
      line = currentWord.trimStart(); // Start new line with the current word
    } else {
      line = testLine;
    }
  }
  
  if (line.trim() !== '' && lines.length < maxLines) {
    lines.push(line);
  } else if (line.trim() !== '') {
    // If the last line was too long, put the last word back
    const lastWord = line.split(/(\s+)/).pop() || '';
    const lineWithoutLastWord = line.substring(0, line.length - lastWord.length);
    lines.push(lineWithoutLastWord);
    remainingWords.unshift(lastWord);
    // also put back the words that were not processed
  }


  const textForCanvas = lines.join('\n');
  const remainingText = remainingWords.join('').trim();
  
  return { textForCanvas, remainingText, lines };
};


const wrapAndDrawText = (
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  y: number,
  lineHeight: number,
  rectHeight: number
) => {
  const totalTextHeight = lines.length * lineHeight;
  // Adjust start Y to be centered within the rectangle
  const startY = y + (rectHeight - totalTextHeight) / 2;

  let currentY = startY;

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
      const lineHeight = isTitle ? font.titleSize * 1.2 : font.lineHeight;

      // Ensure the font is loaded before using it
      await document.fonts.load(`${fontWeight} ${fontSize}px "${fontName}"`);
      
      ctx.clearRect(0, 0, width, height);
      
      const rectWidth = 830;
      const rectHeight = 1100;
      const rectX = (width - rectWidth) / 2;
      const rectY = (height - rectHeight) / 2;
      const textPadding = 50;
      const textMaxWidth = rectWidth - (textPadding * 2);

      ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;

      let remainingText = '';
      let linesToDraw: string[] = [];

      if (!isTitle) {
        const result = measureAndSplitText(ctx, text, textMaxWidth, 12);
        linesToDraw = result.lines;
        remainingText = result.remainingText;
      } else {
        linesToDraw = wrapText(ctx, text, textMaxWidth);
      }

      const drawLayout = () => {
        // Draw the white rectangle
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Set up text properties
        ctx.fillStyle = textColor;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top'; 
        ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;
        
        // Calculate text position
        const textX = rectX + textPadding;
        
        // Draw the text
        wrapAndDrawText(ctx, linesToDraw, textX, rectY, lineHeight, rectHeight);

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
