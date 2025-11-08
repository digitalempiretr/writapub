
"use client";

import React, { useEffect, useRef } from "react";
import type { Shadow } from "@/components/3_text-settings";
import { CanvasElement } from "./5_elements-panel";


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
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  backgroundImageUrl?: string;
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
  elements: CanvasElement[];
  areElementsEnabled: boolean;
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
  elements,
  areElementsEnabled,
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [viewportHeight, setViewportHeight] = React.useState(1080); // Default, updated on client
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  useEffect(() => {
    setViewportHeight(window.innerHeight);
  }, []);

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (imageCache.current.has(src)) {
        const image = imageCache.current.get(src);
        if (image && image.complete) {
            resolve(image);
            return;
        } else if (image) {
            // Image is loading, wait for it
            image.onload = () => resolve(image);
            image.onerror = (err) => reject(err);
            return;
        }
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        imageCache.current.set(src, img);
        resolve(img);
      };
      img.onerror = (err) => {
        console.error("Failed to load image:", src, err);
        reject(err);
      };
      img.src = src;
    });
  };

  useEffect(() => {
    const draw = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      
      const finalFontWeight = isBold ? Math.min(Number(fontWeight) + 300, 900) : fontWeight;
      
      const scalingFactor = width / 1080;
      let baseFontSize = parseSize(propFontSize, viewportHeight);
      
      if (isTitle) {
          baseFontSize *= 1.5;
      }
      
      const finalFontSize = baseFontSize * scalingFactor;
      const finalLineHeight = finalFontSize * (typeof propLineHeight === 'number' ? propLineHeight : parseFloat(propLineHeight as string));

      const processedText = isUppercase ? text.toUpperCase() : text;

      await document.fonts.load(`${finalFontWeight} ${finalFontSize}px "${fontFamily}"`);
      
      ctx.clearRect(0, 0, width, height);
      
      const rectWidth = 830 * (width / 1080);
      const rectHeight = 1100 * (height / 1350);
      const rectX = (width - rectWidth) / 2;
      const rectY = (height - rectHeight) / 2;
      const textPadding = 50 * (width / 1080);
      const textMaxWidth = rectWidth - (textPadding * 2);

      ctx.font = `${finalFontWeight} ${finalFontSize}px "${fontFamily}"`;
      
      const linesToDraw = isTitle ? wrapText(ctx, processedText, textMaxWidth) : processedText.split('\n');


      const drawLayout = async () => {
        if (backgroundImageUrl && overlayColor && (overlayOpacity || overlayOpacity === 0)) {
          ctx.fillStyle = hexToRgba(overlayColor, overlayOpacity);
          ctx.fillRect(0, 0, width, height);
        }

        ctx.fillStyle = hexToRgba(rectColor, rectOpacity);
        ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

        if (areElementsEnabled) {
            for (const element of elements) {
                if (element.type === 'image' && element.url) {
                    try {
                        const img = await loadImage(element.url);
                        ctx.save();
                        ctx.globalAlpha = element.opacity;

                        let drawX = element.x;
                        const elWidth = element.width * scalingFactor;
                        const elHeight = element.height * scalingFactor;

                        if (element.alignment === 'center') {
                            drawX = (width - elWidth) / 2;
                        } else if (element.alignment === 'right') {
                            drawX = width - elWidth - element.x;
                        }

                        ctx.translate(drawX + elWidth / 2, element.y + elHeight / 2);
                        ctx.rotate(element.rotation * Math.PI / 180);
                        ctx.translate(-(drawX + elWidth / 2), -(element.y + elHeight / 2));

                        if (element.shape === 'circle') {
                            ctx.beginPath();
                            ctx.arc(drawX + elWidth / 2, element.y + elHeight / 2, Math.min(elWidth, elHeight) / 2, 0, Math.PI * 2, true);
                            ctx.closePath();
                            ctx.clip();
                        }
                        
                        ctx.drawImage(img, drawX, element.y, elWidth, elHeight);
                        ctx.restore();
                    } catch (error) {
                        console.error("Error drawing element image: ", error);
                    }
                }
            }
        }

        const finalTextColor = hexToRgba(textColor, textOpacity);
        ctx.textAlign = textAlign;
        ctx.textBaseline = 'top'; 
        ctx.font = `${finalFontWeight} ${finalFontSize}px "${fontFamily}"`;
        
        let textX;
        if (textAlign === 'left') {
            textX = rectX + textPadding;
        } else if (textAlign === 'right') {
            textX = rectX + rectWidth - textPadding;
        } else { // center
            textX = rectX + rectWidth / 2;
        }
        
        wrapAndDrawText(ctx, linesToDraw, textX, rectY, finalLineHeight, rectHeight, 
            textStroke, strokeColor, strokeWidth,
            textShadowEnabled, shadows, finalTextColor, finalFontSize
        );
        
        onCanvasReady(canvas);
      };

      if (backgroundImageUrl) {
        try {
          const img = await loadImage(backgroundImageUrl);
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
          await drawLayout();
        } catch (error) {
          ctx.fillStyle = "#ccc";
          ctx.fillRect(0,0,width,height);
          await drawLayout();
        }
      } else if (backgroundColor && backgroundColor.startsWith("linear-gradient")) {
          const regex = /(rgba?\(.+?\)|#([0-9a-fA-F]{3,8}))\s+(\d+)%/g;
          const stops: { color: string; stop: number }[] = [];
          let match;
          while ((match = regex.exec(backgroundColor)) !== null) {
              stops.push({ color: match[1], stop: parseInt(match[3]) / 100 });
          }

          if (stops.length > 0) {
              const gradient = ctx.createLinearGradient(0, 0, 0, height);
              stops.forEach(stop => {
                  gradient.addColorStop(stop.stop, stop.color);
              });
              ctx.fillStyle = gradient;
          } else {
              // Fallback for simpler gradients if regex fails
              const colors = backgroundColor.match(/(rgba?\(.+?\)|#([0-9a-fA-F]{3,8}))/g);
              if (colors && colors.length >= 2) {
                  const gradient = ctx.createLinearGradient(0, 0, 0, height);
                  gradient.addColorStop(0, colors[0]);
                  gradient.addColorStop(1, colors[1]);
                  ctx.fillStyle = gradient;
              } else {
                  ctx.fillStyle = "#ffffff";
              }
          }
          ctx.fillRect(0, 0, width, height);
          await drawLayout();
      } else {
        ctx.fillStyle = backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
        await drawLayout();
      }
    };

    draw();
  }, [text, isTitle, fontFamily, fontWeight, propFontSize, propLineHeight, viewportHeight, backgroundColor, textColor, textOpacity, width, height, onCanvasReady, backgroundImageUrl, rectColor, rectOpacity, overlayColor, overlayOpacity, textAlign, isBold, isUppercase, textShadowEnabled, shadows, textStroke, strokeColor, strokeWidth, fontSmoothing, elements, areElementsEnabled]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
      style={fontSmoothing}
    />
  );
}
export const ImageCanvas = React.memo(ImageCanvasComponent);

    