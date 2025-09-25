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
  onTextRemaining: (remainingText: string, fromIndex: number) => void;
  rectColor: string;
  rectOpacity: number;
  textAlign: 'left' | 'center' | 'right';
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
    const remainingWords = [...words];
    let wordIndex = 0;

    while (lines.length < maxLines && wordIndex < remainingWords.length) {
        let currentWord = remainingWords[wordIndex] || '';
        let testLine = line + currentWord;
        let metrics = context.measureText(testLine);
        
        if (metrics.width > maxWidth && line !== '') {
            lines.push(line);
            line = currentWord.trimStart(); 
        } else {
            line = testLine;
        }
        wordIndex++;
    }
  
    if (line.trim() !== '' && lines.length < maxLines) {
        lines.push(line);
    } else if (line.trim() !== '') {
      // The line is longer than maxWidth but it's the only line left, so we need to backtrack
      const lineWords = line.trimEnd().split(' ');
      const lastWord = lineWords.pop() || '';
      const lineWithoutLastWord = lineWords.join(' ');
      
      lines.push(lineWithoutLastWord);

      // find the word index to restart from
      let consumedWords = 0;
      for(let i=0; i<lines.length; i++) {
        consumedWords += lines[i].split(' ').length;
      }
      wordIndex = words.slice(0, words.join('').lastIndexOf(lastWord)).filter(w => w.trim() !== '').length;
    }

    const textForCanvas = lines.join('\n');
    let consumedChars = 0;
    for(const l of lines) {
        consumedChars += l.length;
    }
    const remainingText = text.substring(consumedChars).trim();
  
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
  const totalTextHeight = (lines.length * lineHeight) - (lineHeight - context.measureText('M').width); // A more accurate height
  // Adjust start Y to be centered within the rectangle
  const startY = y + (rectHeight - totalTextHeight) / 2;

  let currentY = startY;

  for(const line of lines) {
    context.fillText(line.trim(), x, currentY);
    currentY += lineHeight;
  }
};

function hexToRgba(hex: string, alpha: number) {
    let r = 0, g = 0, b = 0;
    // 3 digits
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    }
    // 6 digits
    else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

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
  rectColor,
  rectOpacity,
  textAlign,
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
        // Draw the text box rectangle
        ctx.fillStyle = hexToRgba(rectColor, rectOpacity);
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Set up text properties
        ctx.fillStyle = textColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'top'; 
        ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;
        
        // Calculate text position based on alignment
        let textX;
        if (textAlign === 'left') {
            textX = rectX + textPadding;
        } else if (textAlign === 'right') {
            textX = rectX + rectWidth - textPadding;
        } else { // center
            textX = rectX + rectWidth / 2;
        }
        
        // Draw the text
        wrapAndDrawText(ctx, linesToDraw, textX, rectY, lineHeight, rectHeight);
        
        if (!isTitle) {
          // Pass the original index to onTextRemaining
          const canvasIndex = parseInt(canvas.dataset.index || '0', 10);
          onTextRemaining(remainingText, canvasIndex);
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
  }, [text, isTitle, font, backgroundColor, textColor, width, height, onCanvasReady, backgroundImageUrl, onTextRemaining, rectColor, rectOpacity, textAlign]);

  // We need a way to pass the index to the effect
  const index = React.useMemo(() => {
    if (canvasRef.current && canvasRef.current.parentElement) {
      // A bit of a hack, but we can try to find the index from the DOM structure
      // This is not ideal but works for the carousel item structure
      const carouselItem = canvasRef.current.closest('[role="group"]');
      if (carouselItem && carouselItem.parentElement) {
        return Array.from(carouselItem.parentElement.children).indexOf(carouselItem);
      }
    }
    return 0;
  }, []);


  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
      data-index={index}
    />
  );
}
