
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

export type FontSmoothing = {
  webkitFontSmoothing?: 'auto' | 'none' | 'antialiased' | 'subpixel-antialiased';
  mozOsxFontSmoothing?: 'auto' | 'grayscale';
};

interface ImageCanvasProps {
  text: string;
  isTitle: boolean;
  fontFamily: string;
  fontWeight: string | number;
  fontSize: number | string;
  lineHeight: number | string;
  backgroundColor?: string;
  backgroundImageUrl?: string;
  textColor: string;
  textOpacity: number;
  width: number;
  height: number;
  onCanvasReady: (fabricInstance: fabric.Canvas) => void;
  onTextRemaining: (remainingText: string) => void;
  rectColor: string;
  rectOpacity: number;
  overlayColor: string;
  overlayOpacity: number;
  textAlign: 'left' | 'center' | 'right';
  isBold: boolean;
  isUppercase: boolean;
  textShadowEnabled: boolean;
  shadows: Shadow[];
  textStroke: boolean;
  strokeColor: string;
  strokeWidth: number;
  fontSmoothing?: FontSmoothing;
}

const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ImageCanvas = ({
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

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: width,
      height: height,
      backgroundColor: backgroundColor,
      selection: false,
    });
    fabricCanvasRef.current = canvas;
    if (onCanvasReady) {
      onCanvasReady(canvas);
    }

    // Dispose fabric canvas on unmount
    return () => {
      canvas.dispose();
    };
  }, [width, height, backgroundColor, onCanvasReady]);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.clear();
    canvas.backgroundColor = backgroundColor;

    const addBackgroundImage = (callback: () => void) => {
      if (backgroundImageUrl) {
        fabric.Image.fromURL(backgroundImageUrl, (img) => {
          if (img.width && img.height) {
            const scaleX = canvas.width! / img.width;
            const scaleY = canvas.height! / img.height;
            const scale = Math.max(scaleX, scaleY);

            img.set({
              scaleX: scale,
              scaleY: scale,
              originX: 'center',
              originY: 'center',
              top: canvas.height! / 2,
              left: canvas.width! / 2,
              selectable: false,
              evented: false,
            });
            canvas.add(img);
            canvas.sendToBack(img);
          }
          callback();
        }, { crossOrigin: 'anonymous' });
      } else {
        callback();
      }
    };

    const addOverlaysAndText = () => {
        // Add overlay if enabled and opacity > 0
        if (overlayOpacity > 0) {
          const overlayRect = new fabric.Rect({
            left: 0,
            top: 0,
            width: canvas.width,
            height: canvas.height,
            fill: hexToRgba(overlayColor, overlayOpacity),
            selectable: false,
            evented: false,
          });
          canvas.add(overlayRect);
        }

        // Add text box rectangle if enabled and opacity > 0
        if (rectOpacity > 0) {
          const rect = new fabric.Rect({
            left: width * 0.1,
            top: height * 0.1,
            width: width * 0.8,
            height: height * 0.8,
            fill: hexToRgba(rectColor, rectOpacity),
            selectable: false,
            evented: false,
            rx: 20, // Border radius
            ry: 20,
          });
          canvas.add(rect);
        }

        let finalFontSize = typeof propFontSize === 'string' ? parseFloat(propFontSize) : propFontSize;
        let finalLineHeight = typeof propLineHeight === 'string' ? parseFloat(propLineHeight) : propLineHeight;
        let finalFontWeight = isBold ? (fontWeight === 'normal' ? 'bold' : 'bold') : (fontWeight === 'bold' ? 'normal' : fontWeight);

        const textOptions: fabric.ITextboxOptions = {
          left: width / 2,
          top: height / 2,
          width: width * 0.8,
          fontSize: finalFontSize,
          fontFamily: fontFamily,
          fontWeight: finalFontWeight.toString(),
          lineHeight: finalLineHeight,
          fill: hexToRgba(textColor, textOpacity),
          textAlign: textAlign,
          originX: 'center',
          originY: 'center',
          selectable: true,
          splitByGrapheme: true,
          ...fontSmoothing,
        };
        
        if (textShadowEnabled && shadows && shadows.length > 0) {
            textOptions.shadow = new fabric.Shadow({
              color: shadows[0].color,
              offsetX: shadows[0].offsetX,
              offsetY: shadows[0].offsetY,
              blur: shadows[0].blur,
            });
          } else {
            textOptions.shadow = undefined;
          }
  
          if (textStroke) {
            textOptions.stroke = strokeColor;
            textOptions.strokeWidth = strokeWidth;
          } else {
            textOptions.stroke = undefined;
            textOptions.strokeWidth = 0;
          }

        const processedText = isUppercase ? text.toUpperCase() : text;
        const textbox = new fabric.Textbox(processedText, textOptions);

        // Adjust font size to fit within the textbox height
        const adjustFontSize = () => {
            const availableHeight = height * 0.9;
            while(textbox.height! > availableHeight && textbox.fontSize! > 10) {
              textbox.fontSize = textbox.fontSize! - 1;
              textbox.initDimensions(); // Recalculate dimensions
            }

            // Handle text splitting after font size adjustment
            let remainingText = '';
            if (textbox.isTruncated) {
                // This logic is complex and fabric's internal splitting might be better
                // For now, we'll assume fabric handles it. If not, this needs a robust implementation.
                // A simple split for demonstration:
                const allLines = textbox.text!.split(textbox.lineSeparator);
                // `hiddenTextarea` might not be available or reliable.
                // This part of the logic needs to be revisited with fabric v5 in mind.
                // The original logic was flawed.
            }
            onTextRemaining(remainingText);
        };

        adjustFontSize();
        canvas.add(textbox);
        canvas.centerObject(textbox);
        canvas.renderAll();
    }

    addBackgroundImage(addOverlaysAndText);

  }, [
    text, isTitle, fontFamily, fontWeight, propFontSize, propLineHeight,
    backgroundColor, textColor, textOpacity, width, height, backgroundImageUrl,
    onTextRemaining, rectColor, rectOpacity, overlayColor, overlayOpacity,
    textAlign, isBold, isUppercase, textShadowEnabled, shadows, textStroke,
    strokeColor, strokeWidth, fontSmoothing, // onCanvasReady removed from deps
  ]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="max-w-full max-h-full object-contain"
    />
  );
};
