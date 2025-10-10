
"use client";

import React, { useEffect, useRef } from "react";

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
  overlayColor?: string;
  overlayOpacity?: number;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isUppercase: boolean;
  textShadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
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


// This function measures the text and splits it if it exceeds the max lines, preserving newlines.
const measureAndSplitText = (
    context: CanvasRenderingContext2D,
    text: string,
    maxWidth: number,
    baseMaxLines: number,
    extendedMaxLines: number
): { textForCanvas: string; remainingText: string; lines: string[] } => {
    const paragraphs = text.split('\n');
    let allWords: string[] = [];
    paragraphs.forEach((p, index) => {
        if (p.trim() !== '') {
            allWords.push(...p.split(' '));
        }
        if (index < paragraphs.length - 1) {
            allWords.push('\n');
        }
    });

    let lines: string[] = [];
    let currentLine = '';
    let wordBuffer = [...allWords];
    let remainingWords: string[] = [];

    while (wordBuffer.length > 0) {
        const word = wordBuffer.shift();
        if (word === undefined) break;

        if (word === '\n') {
            lines.push(currentLine);
            currentLine = '';
            if (lines.length >= extendedMaxLines) {
                remainingWords = wordBuffer;
                break;
            }
            continue;
        }

        const testLine = currentLine ? `${currentLine} ${word}` : word;
        if (context.measureText(testLine).width <= maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }

        if (lines.length >= baseMaxLines) {
            const potentialRemainingWords = [currentLine, ...wordBuffer];
            const potentialRemainingText = potentialRemainingWords.join(' ').replace(/\n/g, ' \n ').trim();
            const firstSentenceMatch = potentialRemainingText.match(/^([^.!?]+[.!?])/);

            let extend = false;
            if (firstSentenceMatch) {
                const firstSentence = firstSentenceMatch[1];
                const sentenceWords = firstSentence.trim().split(' ');
                if (sentenceWords.length <= 2) {
                    extend = true;
                }
            }

            if (lines.length >= extendedMaxLines || (!extend && lines.length >= baseMaxLines)) {
                 remainingWords = [currentLine, ...wordBuffer];
                 currentLine = ''; 
                 break;
            }
        }
    }
    
    if (currentLine) {
        lines.push(currentLine);
    }
    
    const finalRemainingText = remainingWords.join(' ').replace(/ \n /g, '\n').trim();

    return { textForCanvas: lines.join('\n'), remainingText: finalRemainingText, lines: lines };
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
  overlayColor,
  overlayOpacity,
  textAlign,
  isBold,
  isUppercase,
  textShadow,
  shadowColor,
  shadowBlur,
  shadowOffsetX,
  shadowOffsetY,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const indexRef = useRef<number | null>(null);

  useEffect(() => {
    // Find index once and store it
    if (canvasRef.current && indexRef.current === null) {
      const parentElement = canvasRef.current.closest('[data-index]');
      if (parentElement) {
        const idx = parseInt(parentElement.getAttribute('data-index') || '0', 10);
        indexRef.current = idx;
      } else {
        indexRef.current = 0; // fallback
      }
    }

    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const baseWeight = isTitle ? font.titleWeight : font.bodyWeight;
      const fontWeight = isBold ? Math.min(Number(baseWeight) + 300, 900) : baseWeight;
      const fontSize = isTitle ? font.titleSize : font.bodySize;
      const fontName = font.fontFamily;
      const lineHeight = isTitle ? font.titleSize * 1.2 : font.lineHeight;

      const processedText = isUppercase ? text.toUpperCase() : text;

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
        const result = measureAndSplitText(ctx, processedText, textMaxWidth, 12, 14);
        linesToDraw = result.lines;
        remainingText = result.remainingText;
      } else {
        linesToDraw = wrapText(ctx, processedText, textMaxWidth);
      }

      const drawLayout = () => {
        // Draw overlay if an image is used
        if (backgroundImageUrl && overlayColor && (overlayOpacity || overlayOpacity === 0)) {
          ctx.fillStyle = hexToRgba(overlayColor, overlayOpacity);
          ctx.fillRect(0, 0, width, height);
        }

        // Draw the text box rectangle
        ctx.fillStyle = hexToRgba(rectColor, rectOpacity);
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        // Set up text properties
        ctx.fillStyle = textColor;
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'top'; 
        ctx.font = `${fontWeight} ${fontSize}px "${fontName}"`;
        
        // Apply shadow if enabled
        if (textShadow) {
            ctx.shadowColor = shadowColor;
            ctx.shadowBlur = shadowBlur;
            ctx.shadowOffsetX = shadowOffsetX;
            ctx.shadowOffsetY = shadowOffsetY;
        }

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

        // Reset shadow for subsequent canvas drawings
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        
        if (!isTitle && indexRef.current !== null) {
          onTextRemaining(remainingText, indexRef.current);
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
        const colors = backgroundColor.match(/#([0-9a-fA-F]{3,6})/g);
        if (colors && colors.length >= 2) {
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(0.5, colors[1]);
          gradient.addColorStop(1, colors[2] || colors[1]);
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
  }, [text, isTitle, font, backgroundColor, textColor, width, height, onCanvasReady, backgroundImageUrl, onTextRemaining, rectColor, rectOpacity, overlayColor, overlayOpacity, textAlign, isBold, isUppercase, textShadow, shadowColor, shadowBlur, shadowOffsetX, shadowOffsetY]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
}
