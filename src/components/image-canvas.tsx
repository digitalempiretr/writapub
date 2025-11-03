
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
  text?: string;
  isTitle?: boolean;
  fontFamily?: string;
  fontWeight?: string | number;
  fontSize?: number | string;
  lineHeight?: number | string; 
  backgroundColor?: string;
  textColor?: string;
  textOpacity?: number;
  width: number;
  height: number;
  onCanvasReady: (canvas: HTMLCanvasElement) => void;
  backgroundImageUrl?: string;
  rectColor?: string;
  rectOpacity?: number;
  overlayColor?: string;
  overlayOpacity?: number;
  textAlign?: 'left' | 'center' | 'right';
  isBold?: boolean;
  isUppercase?: boolean;
  textShadowEnabled?: boolean;
  shadows?: Shadow[];
  textStroke?: boolean;
  strokeColor?: string;
  strokeWidth?: number;
  fontSmoothing?: React.CSSProperties;
  elements: CanvasElement[];
  areElementsEnabled: boolean;
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

const ImageCanvasComponent = ({
  backgroundColor,
  width,
  height,
  onCanvasReady,
  backgroundImageUrl,
  overlayColor,
  overlayOpacity,
  elements,
  areElementsEnabled,
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageCache = useRef<Map<string, HTMLImageElement>>(new Map());

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
      
      ctx.clearRect(0, 0, width, height);
      
      const drawLayout = async () => {
        if (backgroundImageUrl && overlayColor && (overlayOpacity || overlayOpacity === 0)) {
          ctx.fillStyle = hexToRgba(overlayColor, overlayOpacity);
          ctx.fillRect(0, 0, width, height);
        }
      
        if (areElementsEnabled) {
          for (const element of elements) {
            if (element.type === 'image' && element.url) {
              try {
                const img = await loadImage(element.url);
                ctx.save();
                ctx.globalAlpha = element.opacity;
      
                const scalingFactor = width / 1080;
                let drawX = element.x * scalingFactor;
                let drawY = element.y * scalingFactor;
                const elWidth = element.width * scalingFactor;
                const elHeight = element.height * scalingFactor;
      
                if (element.alignment === 'center') {
                  drawX = (width - elWidth) / 2;
                } else if (element.alignment === 'right') {
                  drawX = width - elWidth - element.x * scalingFactor;
                }
      
                ctx.translate(drawX + elWidth / 2, drawY + elHeight / 2);
                ctx.rotate(element.rotation * Math.PI / 180);
                ctx.translate(-(drawX + elWidth / 2), -(drawY + elHeight / 2));
      
                if (element.shape === 'circle') {
                  ctx.beginPath();
                  ctx.arc(drawX + elWidth / 2, drawY + elHeight / 2, Math.min(elWidth, elHeight) / 2, 0, Math.PI * 2, true);
                  ctx.closePath();
                  ctx.clip();
                }
                
                ctx.drawImage(img, drawX, drawY, elWidth, elHeight);
                ctx.restore();
              } catch (error) {
                console.error("Error drawing element image: ", error);
              }
            }
          }
        }
        
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
        const colors = backgroundColor.match(/#([0-9a-fA-F]{3,8})/g);
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
        await drawLayout();
      } else {
        ctx.fillStyle = backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
        await drawLayout();
      }
    };

    draw();
  }, [backgroundColor, width, height, onCanvasReady, backgroundImageUrl, overlayColor, overlayOpacity, elements, areElementsEnabled]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="w-full h-full"
    />
  );
}
export const ImageCanvas = React.memo(ImageCanvasComponent);
