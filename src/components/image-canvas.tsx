
"use client";

import React, { useEffect, useRef } from "react";
import type { Shadow } from "@/components/3_text-settings";
import { fabric } from 'fabric';

export type FontOption = {
  value: string;
  label: string;
  fontFamily: string;
  weight: string | number;
  size: number | string; // Base size for body text, title will be a multiple of this
  lineHeight: number | string; // This should be a multiplier, e.g., 1.4
};

export type ImageCanvasProps = {
  text: string;
  isTitle: boolean;
  fontFamily: string;
  fontWeight: string | number;
  fontSize: number | string;
  lineHeight: number | string; // This is now a multiplier
  backgroundColor?: string;
  textColor: string;
  textOpacity: number;
  width: number;
  height: number;
  onCanvasReady: (canvas: HTMLCanvasElement, fabricInstance: fabric.Canvas) => void;
  backgroundImageUrl?: string;
  onTextRemaining: (remainingText: string, fromIndex: number) => void;
  rectColor: string;
  rectOpacity: number;
  overlayColor?: string;
  overlayOpacity?: number;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isUppercase: boolean;
  textShadowEnabled: boolean;
  shadows: Shadow[];
  textStroke: boolean;
  strokeColor: string;
  strokeWidth: number;
  fontSmoothing?: React.CSSProperties;
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
  rectHeight: number,
  textStroke: boolean,
  strokeColor: string,
  strokeWidth: number,
  textShadowEnabled: boolean,
  shadows: Shadow[],
  finalTextColor: string,
  finalFontSize: number
) => {
  const totalTextHeight = (lines.length * lineHeight) - (lineHeight - context.measureText('M').width); // A more accurate height
  const startY = y + (rectHeight - totalTextHeight) / 2;

  const drawTextLines = (colorOverride?: string) => {
    let currentY = startY;
    for (const line of lines) {
      if (textStroke && !colorOverride) {
        context.strokeStyle = strokeColor;
        context.lineWidth = strokeWidth;
        context.strokeText(line.trim(), x, currentY);
      }
      context.fillStyle = colorOverride || finalTextColor;
      context.fillText(line.trim(), x, currentY);
      currentY += lineHeight;
    }
  };

  if (textShadowEnabled && shadows.length > 0) {
    shadows.slice().reverse().forEach(shadow => {
      context.shadowColor = shadow.color;
      
      const getPixelValue = (value: number, unit: 'px' | 'em' | 'rem' = 'px') => {
        if (unit === 'em' || unit === 'rem') {
          return value * finalFontSize;
        }
        return value;
      };

      context.shadowBlur = getPixelValue(shadow.blur, shadow.blurUnit);
      context.shadowOffsetX = getPixelValue(shadow.offsetX, shadow.offsetXUnit);
      context.shadowOffsetY = getPixelValue(shadow.offsetY, shadow.offsetYUnit);

      drawTextLines(shadow.color);
    });
  }

  // Reset shadows and draw the main text on top
  context.shadowColor = 'transparent';
  context.shadowBlur = 0;
  context.shadowOffsetX = 0;
  context.shadowOffsetY = 0;
  
  drawTextLines();
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

// This function safely parses a string like 'calc(20px + 5vh)' into a pixel value.
const parseSize = (size: string | number, viewportHeight: number): number => {
    if (typeof size === 'number') {
      return size;
    }

    try {
        const cleanedSize = size.replace(/calc/g, '').replace(/[()]/g, '');
        const parts = cleanedSize.split('+').map(s => s.trim());
        let total = 0;

        for (const part of parts) {
            if (part.includes('vh')) {
                const value = parseFloat(part.replace('vh', ''));
                total += (value / 100) * viewportHeight;
            } else if (part.includes('px')) {
                total += parseFloat(part.replace('px', ''));
            } else {
                total += parseFloat(part);
            }
        }
        return total;
    } catch (e) {
        console.error("Could not parse size:", size, e);
        return typeof size === 'number' ? size : 48; // Fallback
    }
};

const ImageCanvasComponent = ({
  text,
  isTitle,
  fontFamily,
  fontWeight,
  fontSize: propFontSize,
  lineHeight: propLineHeight,
  backgroundColor,
  textColor,
  textOpacity,
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
  textShadowEnabled,
  shadows,
  textStroke,
  strokeColor,
  strokeWidth,
  fontSmoothing,
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<fabric.Canvas | null>(null);
  const indexRef = useRef<number | null>(null);
  const [viewportHeight, setViewportHeight] = React.useState(1080); // Default, updated on client

  useEffect(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    if (canvasRef.current && !fabricCanvasRef.current) {
        const fabricInstance = new fabric.Canvas(canvasRef.current, {
            width,
            height,
            selection: false,
        });
        fabricCanvasRef.current = fabricInstance;

        const parentElement = canvasRef.current.closest('[data-index]');
        if (parentElement) {
            const idx = parseInt(parentElement.getAttribute('data-index') || '0', 10);
            indexRef.current = idx;
        } else {
            indexRef.current = 0; // fallback
        }
        onCanvasReady(canvasRef.current, fabricInstance);
    }
}, [width, height, onCanvasReady]);


  useEffect(() => {
    const draw = async () => {
      const fabricCanvas = fabricCanvasRef.current;
      if (!fabricCanvas) return;
      
      const finalFontWeight = isBold ? Math.min(Number(fontWeight) + 300, 900) : fontWeight;
      
      const scalingFactor = width / 1080;
      let baseFontSize = parseSize(propFontSize, viewportHeight);
      
      if (isTitle) {
          baseFontSize *= 1.5;
      }
      
      const finalFontSize = baseFontSize * scalingFactor;
      const finalLineHeight = (typeof propLineHeight === 'number' ? propLineHeight : parseFloat(propLineHeight));
      const processedText = isUppercase ? text.toUpperCase() : text;

      await document.fonts.load(`${finalFontWeight} ${finalFontSize}px "${fontFamily}"`);
      
      fabricCanvas.clear();
      
      const rectWidth = 830 * (width / 1080);
      const textPadding = 50 * (width / 1080);
      const textMaxWidth = rectWidth - (textPadding * 2);

      const textBox = new fabric.Textbox(processedText, {
        left: width / 2,
        top: height / 2,
        width: textMaxWidth,
        fontSize: finalFontSize,
        fontFamily: fontFamily,
        fontWeight: finalFontWeight.toString(),
        lineHeight: finalLineHeight,
        fill: hexToRgba(textColor, textOpacity),
        textAlign: textAlign,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
        ...fontSmoothing,
      });

      if (textShadowEnabled && shadows.length > 0) {
        textBox.shadow = shadows.map(s => {
          const getPixelValue = (value: number, unit: 'px' | 'em' | 'rem' = 'px') => {
            if (unit === 'em' || unit === 'rem') return value * finalFontSize;
            return value;
          };
          return new fabric.Shadow({
            color: s.color,
            blur: getPixelValue(s.blur, s.blurUnit),
            offsetX: getPixelValue(s.offsetX, s.offsetXUnit),
            offsetY: getPixelValue(s.offsetY, s.offsetYUnit),
          });
        }).join(', ');
      } else {
        textBox.shadow = undefined;
      }

      if (textStroke) {
        textBox.stroke = strokeColor;
        textBox.strokeWidth = strokeWidth;
      } else {
        textBox.stroke = undefined;
        textBox.strokeWidth = 0;
      }


      let textForThisCanvas = processedText;
      let remainingText = '';
      
      if (!isTitle) {
        const maxLines = 12; // Adjust based on your logic
        if (textBox.isTruncated) {
          const lines = textBox.getLines();
          textForThisCanvas = lines.slice(0, maxLines).join('\n');
          remainingText = lines.slice(maxLines).join('\n');
          textBox.set('text', textForThisCanvas);
        }
      }
      
      const textHeight = textBox.height || 0;
      
      const drawLayout = () => {
        if (rectOpacity > 0) {
          const rect = new fabric.Rect({
            left: (width - rectWidth) / 2,
            top: (height - textHeight) / 2 - textPadding,
            width: rectWidth,
            height: textHeight + (textPadding * 2),
            fill: hexToRgba(rectColor, rectOpacity),
            selectable: false,
            evented: false,
          });
          fabricCanvas.add(rect);
        }

        fabricCanvas.add(textBox);
        fabricCanvas.centerObject(textBox);

        if (overlayOpacity && overlayOpacity > 0 && overlayColor) {
            const overlay = new fabric.Rect({
                left: 0,
                top: 0,
                width: width,
                height: height,
                fill: hexToRgba(overlayColor, overlayOpacity),
                selectable: false,
                evented: false,
            });
            fabricCanvas.add(overlay);
            overlay.moveTo(-1); // Send to back but above background
        }
        
        fabricCanvas.renderAll();
        if (!isTitle && indexRef.current !== null) {
          onTextRemaining(remainingText, indexRef.current);
        }
      };

      const setGradientBackground = (colors: string[]) => {
        fabricCanvas.setBackgroundColor({
          source: new fabric.Gradient({
            type: 'linear',
            gradientUnits: 'pixels',
            coords: { x1: 0, y1: 0, x2: 0, y2: height },
            colorStops: [
              { offset: 0, color: colors[0] },
              { offset: 0.5, color: colors[1] },
              { offset: 1, color: colors[2] || colors[1] },
            ]
          }),
        }, () => {
          fabricCanvas.renderAll();
          drawLayout();
        });
      };
      
      if (backgroundImageUrl) {
          fabric.Image.fromURL(backgroundImageUrl, (img) => {
              fabricCanvas.setBackgroundImage(img, fabricCanvas.renderAll.bind(fabricCanvas), {
                  scaleX: width / (img.width || 1),
                  scaleY: height / (img.height || 1),
              });
              drawLayout();
          }, { crossOrigin: 'anonymous' });

      } else if (backgroundColor && backgroundColor.startsWith("linear-gradient")) {
        const colors = backgroundColor.match(/#([0-9a-fA-F]{3,8})/g);
        if(colors && colors.length >= 2){
          setGradientBackground(colors);
        } else {
          fabricCanvas.backgroundColor = backgroundColor;
          fabricCanvas.renderAll();
          drawLayout();
        }
      } else {
        fabricCanvas.backgroundImage = null;
        fabricCanvas.backgroundColor = backgroundColor || '#ffffff';
        drawLayout();
      }
    };

    draw();
  }, [text, isTitle, fontFamily, fontWeight, propFontSize, propLineHeight, viewportHeight, backgroundColor, textColor, textOpacity, width, height, backgroundImageUrl, onTextRemaining, rectColor, rectOpacity, overlayColor, overlayOpacity, textAlign, isBold, isUppercase, textShadowEnabled, shadows, textStroke, strokeColor, strokeWidth, fontSmoothing]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={fontSmoothing}
    />
  );
}
export const ImageCanvas = React.memo(ImageCanvasComponent);
