
"use client";

import { findImages } from "@/ai/flows/find-images-flow";
import { ImageCanvas } from "@/components/image-canvas";
import type { FontOption } from "@/lib/font-options";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, ImageIcon, LayoutTemplate, Type, X, RectangleVertical, Smartphone, Square, HeartIcon, PanelLeft, ZoomIn, ZoomOut, RotateCcw, Shapes, RefreshCcw, RefreshCcwIcon, Info } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { imageTemplates, ImageTemplate } from "@/lib/image-templates";
import { fontOptions } from "@/lib/font-options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { defaultText } from "@/lib/default-text";
import { DesignTemplate, designTemplates } from "@/lib/design-templates";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TextSettings, type Shadow } from "@/components/3_text-settings";
import { BackgroundSettings } from "@/components/2_background-settings";
import { DesignsPanel } from "@/components/1_templates";
import { MyDesignsPanel } from "@/components/4_favorites";
import { DownloadPanel } from "@/components/5_download-panel";
import { ElementsPanel, CanvasElement } from "@/components/5_elements-panel";
import { pageInitialColors } from "@/lib/colors";
import { CreativeMagicPanel } from "@/components/0_creative-magic-panel";
import { cn } from "@/lib/utils";
import { textEffects, parseShadow, TextEffect } from "@/lib/text-effects";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeartIconG, RefreshIcon  } from "@/components/ui/icons";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";


type Design = {
  text: string;
  isTitle: boolean;
};

type TextAlign = 'left' | 'center' | 'right';
type BackgroundType = 'flat' | 'gradient' | 'image';
type CanvasSize = { name: 'Post' | 'Story' | 'Square'; width: number; height: number };

const canvasSizes: CanvasSize[] = [
    { name: 'Post', width: 1080, height: 1350 },
    { name: 'Story', width: 1080, height: 1920 },
    { name: 'Square', width: 1080, height: 1080 },
];

const ZOOM_STEP = 0.1;
const MAX_ZOOM = 3.0;
const MIN_ZOOM = 0.25;

const measureAndSplitText = (
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  baseMaxLines: number,
  extendedMaxLines: number
): { textForCanvas: string; remainingText: string } => {
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

  const textForCanvas = lines.join('\n');
  const finalRemainingText = remainingWords.join(' ').replace(/ \n /g, '\n').trim();

  return { textForCanvas, remainingText: finalRemainingText };
};


export default function Home() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState(defaultText);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  
  const carouselApi = useRef<CarouselApi | null>(null);
  const searchCarouselApi = useRef<CarouselApi | null>(null);


  const [currentSlide, setCurrentSlide] = useState(0);
  const [myDesigns, setMyDesigns] = useLocalStorage<DesignTemplate[]>('writa-designs', []);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);

  const [backgroundType, setBackgroundType] = useState<BackgroundType>('image');
  const [currentTemplate, setCurrentTemplate] = useState<ImageTemplate | null>(imageTemplates[1]);
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const handleSelectCarousel = useCallback(() => {
    if (!carouselApi.current) {
      return
    }
    setCurrentSlide(carouselApi.current.selectedScrollSnap())
  }, []);

  useEffect(() => {
    if (!carouselApi.current) {
      return
    }

    handleSelectCarousel();
    carouselApi.current.on("select", handleSelectCarousel)

    return () => {
      carouselApi.current?.off("select", handleSelectCarousel)
    }
  }, [carouselApi, handleSelectCarousel]);

  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions.find(f => f.value === 'duru-sans') || fontOptions[0]);

  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [isBold, setIsBold] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [backgroundTab, setBackgroundTab] = useState<BackgroundType>("image");
  const [bgColor, setBgColor] = useState(pageInitialColors.bgColor);
  const [textColor, setTextColor] = useState(pageInitialColors.textColor);
  const [textOpacity, setTextOpacity] = useState(1);
  const [gradientBg, setGradientBg] = useState(pageInitialColors.gradientBg);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[1].imageUrls.post);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(canvasSizes[0]);
  
  const [isTextBoxEnabled, setIsTextBoxEnabled] = useState(false);
  const [rectBgColor, setRectBgColor] = useState(pageInitialColors.rectBgColor);
  const [rectOpacity, setRectOpacity] = useState(0);

  const [isOverlayEnabled, setIsOverlayEnabled] = useState(false);
  const [overlayColor, setOverlayColor] = useState(pageInitialColors.overlayColor);
  const [overlayOpacity, setOverlayOpacity] = useState(0.25);

  const [textShadowEnabled, setTextShadowEnabled] = useState(false);
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: Date.now(), color: '#000000', offsetX: 5, offsetY: 5, blur: 5, offsetXUnit: 'px', offsetYUnit: 'px', blurUnit: 'px' }
  ]);
  const [activeEffect, setActiveEffect] = useState<TextEffect>(textEffects[0]);

  const [textStroke, setTextStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('designs');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [fileName, setFileName] = useState("writa");
  const [zoomLevel, setZoomLevel] = useState(0.5);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [areElementsEnabled, setAreElementsEnabled] = useState(true);

  const [pinchState, setPinchState] = useState<{ distance: number; zoom: number } | null>(null);


  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const designsRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();


  const handleGenerate = useCallback(() => {
    setIsLoading(true);
    setDesigns([]); // Clear previous designs
    let newDesigns: Design[] = [];
  
    // Create a temporary canvas context for text measurement
    const tempCanvas = document.createElement('canvas');
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) {
        setIsLoading(false);
        return;
    }
  
    let remainingText = text.trim();
  
    // 1. Handle the title
    if (title.trim()) {
        newDesigns.push({ text: title.trim(), isTitle: true });
    }
  
    // 2. Process the body text
    const scalingFactor = canvasSize.width / 1080;
    const baseFontSize = typeof activeFont.size === 'number' ? activeFont.size : 48;
    const finalFontSize = baseFontSize * scalingFactor;
    const finalFontWeight = isBold ? Math.min(Number(activeFont.weight) + 300, 900) : activeFont.weight;
  
    document.fonts.load(`${finalFontWeight} ${finalFontSize}px "${activeFont.fontFamily}"`).then(() => {
        ctx.font = `${finalFontWeight} ${finalFontSize}px "${activeFont.fontFamily}"`;
  
        const rectWidth = 830 * (canvasSize.width / 1080);
        const textMaxWidth = rectWidth - (100 * (canvasSize.width / 1080));
        const currentLineHeight = typeof activeFont.lineHeight === 'number' ? activeFont.lineHeight : parseFloat(activeFont.lineHeight as string);
  
        // Continue processing only if there's text left
        while (remainingText.length > 0) {
            const maxLineHeight = 2.5;
            const minLineHeight = 1.2;
            const maxLinesForMinHeight = 14;
            const maxLinesForMaxHeight = 8;
            const slope = (maxLinesForMaxHeight - maxLinesForMinHeight) / (maxLineHeight - minLineHeight);
            let dynamicMaxLines = Math.floor(maxLinesForMinHeight + slope * (currentLineHeight - minLineHeight));
            dynamicMaxLines = Math.max(maxLinesForMaxHeight, Math.min(maxLinesForMinHeight, dynamicMaxLines));
    
            const result = measureAndSplitText(ctx, remainingText, textMaxWidth, dynamicMaxLines, dynamicMaxLines + 2);
            
            newDesigns.push({ text: result.textForCanvas, isTitle: false });
            remainingText = result.remainingText;
    
            if (newDesigns.length > 50) { 
                console.error("Exceeded 50 slides, breaking loop.");
                break;
            }
        }
    
        setDesigns(newDesigns);
        setIsLoading(false);
    
        // Scroll to the first slide after generation
        setTimeout(() => carouselApi.current?.scrollTo(0), 100);
    });
  }, [text, title, canvasSize, activeFont, isBold]);
  
   const closePanel = useCallback(() => {
    setIsMobilePanelOpen(false);
  }, []);

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobilePanelOpen &&
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(event.target as Node)
      ) {
        const targetElement = event.target as Element;
        if (
          targetElement.closest('[role="dialog"]') ||
          targetElement.closest('[role="alertdialog"]') ||
          targetElement.closest('[data-radix-popper-content-wrapper]')
        ) {
          return;
        }
        closePanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobilePanelOpen, closePanel]);

  const handleDownload = useCallback((index: number) => {
    const canvas = canvasRefs.current[index];
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName}-${index + 1}.png`;
      link.click();
    }
  }, [fileName]);

  const handleDownloadAll = useCallback(() => {
    designs.forEach((_, index) => {
      setTimeout(() => handleDownload(index), index * 300);
    });
  }, [designs, handleDownload]);


  const handleLogDesign = useCallback(() => {
    let bgValue = '';
    if (backgroundType === 'flat') bgValue = bgColor;
    else if (backgroundType === 'gradient') bgValue = gradientBg;
    else if (backgroundType === 'image') bgValue = imageBgUrl;
  
    const templateToLog = {
      previewImage: "''", // Placeholder
      category: "UNCATEGORIZED",
      canvasSize: canvasSize.name,
      background: {
        type: backgroundType,
        value: bgValue,
      },
      font: {
        value: activeFont.value,
        color: textColor,
        fontSize: typeof activeFont.size === 'number' ? activeFont.size : 48,
      },
      textBox: {
        color: rectBgColor,
        opacity: rectOpacity,
      },
      overlay: {
        color: overlayColor,
        opacity: overlayOpacity,
      },
       effect: {
        id: activeEffect.id
      }
    };

    const templateString = `
{
  id: 'template-NEW_ID',
  name: "New Template Name",
  category: 'Special Effects', // Or 'Color Styles' or 'Image Templates'
  previewImage: "",
  canvasSize: '${templateToLog.canvasSize}',
  background: {
    type: '${templateToLog.background.type}',
    value: ${templateToLog.background.type === 'gradient' 
      ? `gradientTemplates.find(g => g.name === 'YOUR_GRADIENT_NAME')?.css || '${templateToLog.background.value}'`
      : `'${templateToLog.background.value}'`
    },
  },
  font: {
    value: '${templateToLog.font.value}',
    color: '${templateToLog.font.color}',
    fontSize: ${templateToLog.font.fontSize},
  },
  textBox: {
    color: '${templateToLog.textBox.color}',
    opacity: ${templateToLog.textBox.opacity},
  },
  overlay: {
    color: '${templateToLog.overlay.color}',
    opacity: ${templateToLog.overlay.opacity},
  },
  effect: {
    id: '${templateToLog.effect?.id}',
  }
},`;
  
    console.log("Copy this code snippet to add to design-templates.ts:");
    console.log(templateString);
  
    toast({
      title: "Design Logged to Console",
      description: "Open developer tools (F12) to see the design code.",
      duration: 5000,
    });
  }, [backgroundType, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, toast, activeEffect, canvasSize]);

  const handleEffectChange = (effect: TextEffect) => {
    setActiveEffect(effect);

    if (effect.fontValue) {
        const newFont = fontOptions.find(f => f.value === effect.fontValue);
        if (newFont) {
            const newSize = typeof effect.style.fontSize === 'number' ? effect.style.fontSize : newFont.size;
            setActiveFont({ ...newFont, size: newSize });
        }
    } else if (typeof effect.style.fontSize === 'number') {
        setActiveFont(prevFont => ({...prevFont, size: effect.style.fontSize!}));
    }

    if (effect.id === 'none') {
        setTextShadowEnabled(false);
        setTextColor(pageInitialColors.textColor);
    } else {
        if (effect.style.color) {
            setTextColor(effect.style.color);
        }
        if (effect.style.textShadow) {
            setTextShadowEnabled(true);
            const finalShadowString = effect.style.textShadow
              .replace(/{{color}}/g, effect.style.color || textColor)
              .replace(/{{glow}}/g, effect.style.glowColor || effect.style.color || textColor);

            const parsedShadows = parseShadow(finalShadowString);
            setShadows(parsedShadows);
        } else {
            setTextShadowEnabled(false);
        }
    }
};

  const handleTextColorChange = (newColor: string) => {
    setTextColor(newColor);
    if (activeEffect && activeEffect.id !== 'none' && activeEffect.style.textShadow) {
      const finalShadowString = activeEffect.style.textShadow
        .replace(/{{color}}/g, newColor)
        .replace(/{{glow}}/g, activeEffect.style.glowColor || newColor);
      const newShadows = parseShadow(finalShadowString);
      setShadows(newShadows);
    }
  };
  
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'image',
          url: reader.result as string,
          x: 50,
          y: 50,
          width: 150,
          height: 150,
          rotation: 0,
          opacity: 1,
          shape: 'square',
          alignment: 'left',
        };
        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateElement = (id: string, newProps: Partial<CanvasElement>) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  const renderCanvas = useCallback((design: Design, index: number) => {
    let currentBg: string | undefined;
    let finalImageUrl: string | undefined;

    switch(backgroundType) {
        case "flat":
            currentBg = bgColor;
            finalImageUrl = undefined;
            break;
        case "gradient":
            currentBg = gradientBg;
            finalImageUrl = undefined;
            break;
        case "image":
            currentBg = imageBgUrl; 
            finalImageUrl = imageBgUrl;
            break;
        default:
            currentBg = bgColor;
            finalImageUrl = undefined;
            break;
    }
    
    return (
        <ImageCanvas
          isTitle={design.isTitle}
          fontFamily={activeFont.fontFamily}
          fontWeight={activeFont.weight}
          fontSize={activeFont.size}
          lineHeight={activeFont.lineHeight}
          text={design.text}
          textColor={textColor}
          textOpacity={textOpacity}
          backgroundColor={currentBg}
          backgroundImageUrl={finalImageUrl}
          width={canvasSize.width}
          height={canvasSize.height}
          onCanvasReady={(canvas) => {
            canvasRefs.current[index] = canvas;
          }}
          rectColor={rectBgColor}
          rectOpacity={isTextBoxEnabled ? rectOpacity : 0}
          overlayColor={overlayColor}
          overlayOpacity={isOverlayEnabled ? overlayOpacity : 0}
          textAlign={textAlign}
          isBold={isBold}
          isUppercase={isUppercase}
          textShadowEnabled={textShadowEnabled}
          shadows={shadows}
          textStroke={textStroke}
          strokeColor={strokeColor}
          strokeWidth={strokeWidth}
          fontSmoothing={activeEffect.style.fontSmoothing}
          elements={elements}
          areElementsEnabled={areElementsEnabled}
        />
    )
  }, [
    backgroundType, activeFont, bgColor, textColor, textOpacity, 
    gradientBg, imageBgUrl, rectBgColor, rectOpacity, overlayColor, 
    overlayOpacity, textAlign, isBold, isUppercase, textShadowEnabled, 
    shadows, textStroke, strokeColor, strokeWidth, 
    isTextBoxEnabled, isOverlayEnabled, activeEffect, canvasSize, elements, areElementsEnabled
  ]);
  
  const handleMobileTabClick = (tab: string) => {
    if (activeSettingsTab === tab && isMobilePanelOpen) {
      // Don't close if it's already open and the same tab is clicked
    } else {
      setActiveSettingsTab(tab);
      setIsMobilePanelOpen(true);
    }
  };
  
  const handleDesktopTabClick = (tab: string) => {
      setActiveSettingsTab(tab);
      if (!isSidebarOpen) {
          setIsSidebarOpen(true);
      }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
        const newZoom = direction === 'in' ? prev + ZOOM_STEP : prev - ZOOM_STEP;
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPanning(true);
        if (designsRef.current) {
          designsRef.current.style.cursor = 'grab';
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsPanning(false);
         if (designsRef.current) {
          designsRef.current.style.cursor = 'default';
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      e.preventDefault();
       if (designsRef.current) {
        designsRef.current.style.cursor = 'grabbing';
      }
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning && e.buttons === 1) {
      e.preventDefault();
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
       if (designsRef.current) {
        designsRef.current.style.cursor = 'grab';
      }
    }
  };
  
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (!touch1 || !touch2) return;
  
      const midX = (touch1.clientX + touch2.clientX) / 2;
      const midY = (touch1.clientY + touch2.clientY) / 2;
      setPanStart({ x: midX - panOffset.x, y: midY - panOffset.y });
      setPinchState({
        distance: getDistance(touch1, touch2),
        zoom: zoomLevel,
      });
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      if (!touch1 || !touch2) return;
  
      const midX = (touch1.clientX + touch2.clientX) / 2;
      const midY = (touch1.clientY + touch2.clientY) / 2;
      setPanOffset({
        x: midX - panStart.x,
        y: midY - panStart.y,
      });
  
      if (pinchState) {
        const newDist = getDistance(touch1, touch2);
        const scale = newDist / pinchState.distance;
        let newZoom = pinchState.zoom * scale;
        newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
        setZoomLevel(newZoom);
      }
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      setPinchState(null);
    }
  };


  const resetPanAndZoom = useCallback((size: CanvasSize) => {
    let newZoom;
    if (isMobile) {
        switch(size.name) {
            case 'Story': newZoom = 0.8; break;
            case 'Post': newZoom = 1.0; break;
            case 'Square': newZoom = 1.0; break;
            default: newZoom = 1.0; break;
        }
    } else {
        switch(size.name) {
            case 'Story': newZoom = 0.4; break;
            case 'Post': newZoom = 0.5; break;
            case 'Square': newZoom = 0.6; break;
            default: newZoom = 0.5; break;
        }
    }
    setZoomLevel(newZoom);
    setPanOffset({ x: 0, y: 0 });
    return newZoom;
  }, [isMobile]);

  useEffect(() => {
    if(isClient){
      resetPanAndZoom(canvasSize);
    }
  }, [isClient, canvasSize, resetPanAndZoom]);

  const handleCanvasSizeChange = (size: CanvasSize) => {
    setCanvasSize(size);
    resetPanAndZoom(size);
    if (size.name === 'Square') {
      setActiveFont(prevFont => ({...prevFont, size: 36}));
    } else {
      setActiveFont(prevFont => ({...prevFont, size: 48}));
    }
  }
  const applyTemplate = (template: DesignTemplate) => {
    // Set background
    setBackgroundType(template.background.type);
    if (template.background.type === 'flat') {
      setBgColor(template.background.value);
    } else if (template.background.type === 'gradient') {
      setGradientBg(template.background.value);
    } else {
      setImageBgUrl(template.background.value);
    }
  
    // Set font
    const newFont = fontOptions.find(f => f.value === template.font.value) || activeFont;
    setActiveFont({ ...newFont, size: template.font.fontSize });
  
    // Set textbox
    setIsTextBoxEnabled(template.textBox.opacity > 0);
    setRectBgColor(template.textBox.color);
    setRectOpacity(template.textBox.opacity);
  
    // Set overlay
    setIsOverlayEnabled(template.overlay.opacity > 0);
    setOverlayColor(template.overlay.color);
    setOverlayOpacity(template.overlay.opacity);
  
    // Set effect
    if (template.effect) {
      const effect = textEffects.find(e => e.id === template.effect!.id);
      if (effect) {
        handleEffectChange(effect);
      }
    } else {
      handleEffectChange(textEffects[0]);
    }
    
    // This needs to be last to override effect color
    setTextColor(template.font.color);

    // Set Canvas Size
    const newCanvasSize = canvasSizes.find(s => s.name === template.canvasSize) || canvasSize;
    handleCanvasSizeChange(newCanvasSize);
  
    toast({
      title: "Template Applied",
      description: `The "${template.name}" template has been applied.`,
    });
  };

  const handleSaveDesign = () => {
    let bgValue = '';
    if (backgroundType === 'flat') bgValue = bgColor;
    else if (backgroundType === 'gradient') bgValue = gradientBg;
    else if (backgroundType === 'image') bgValue = imageBgUrl;

    const newDesign: DesignTemplate = {
      id: `design-${Date.now()}`,
      name: `Favorite ${myDesigns.length + 1}`,
      category: 'Favorites',
      previewImage: '', // Canvas preview will be generated later
      background: { type: backgroundType, value: bgValue },
      font: { 
        value: activeFont.value, 
        color: textColor,
        fontSize: typeof activeFont.size === 'number' ? activeFont.size : 48,
      },
      textBox: { color: rectBgColor, opacity: rectOpacity },
      overlay: { color: overlayColor, opacity: overlayOpacity },
      canvasSize: canvasSize.name,
      effect: { id: activeEffect.id },
    };

    setMyDesigns(prevDesigns => [newDesign, ...prevDesigns]);
    toast({
      title: "Favorite Saved!",
      description: "Your current design has been saved to your favorites.",
    });
  };
  
  const handleDeleteDesign = (id: string) => {
    setMyDesigns(prev => prev.filter(d => d.id !== id));
    setDesignToDelete(null);
    toast({
      title: "Favorite Deleted",
      variant: "destructive",
    });
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingDesignId(id);
    setEditingName(name);
  };
  
  const handleUpdateDesign = (id: string) => {
    setMyDesigns(prev => prev.map(d => d.id === id ? { ...d, name: editingName } : d));
    setEditingDesignId(null);
    setEditingName('');
  };
  
  const handleCancelEdit = () => {
    setEditingDesignId(null);
    setEditingName('');
  };

  const handleBgColorSelect = (color: string) => {
    setBgColor(color);
    setBackgroundType('flat');
  };

  const handleGradientBgSelect = (css: string) => {
    setGradientBg(css);
    setBackgroundType('gradient');
  };

  const handleImageBgUrlSelect = (template: ImageTemplate) => {
    const sizeName = canvasSize.name.toLowerCase() as 'post' | 'story' | 'square';
    setImageBgUrl(template.imageUrls[sizeName]);
    setBackgroundType('image');
  };

  const handleSearchImages = useCallback(async (query: string, page = 1) => {
    if (!query) {
      toast({
        title: "Search query is empty",
        description: "Please enter a term to search for images.",
        variant: "destructive",
      });
      return;
    }
    setIsSearching(true);
    setSearchPage(page);
    setSearchQuery(query);

    try {
      const results = await findImages({ query, page: page, per_page: 9 });
      if (page === 1) {
        setSearchedImages(results.imageUrls);
      } else {
        setSearchedImages(prev => [...prev, ...results.imageUrls]);
      }
      if (results.imageUrls.length === 0 && page === 1) {
        toast({ title: "No images found." });
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Search Failed",
        description: error.message || "Could not fetch images from Pexels.",
        variant: "destructive",
        });
    } finally {
      setIsSearching(false);
    }
  }, [toast]);

  const handleKeywordSearch = useCallback((keyword: string) => {
    handleSearchImages(keyword, 1);
  }, [handleSearchImages]);

  const handleFeelLucky = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const url = `https://picsum.photos/seed/${randomSeed}`;
    const luckyTemplate: ImageTemplate = {
      name: 'Lucky',
      imageUrls: {
        post: `${url}/1080/1350`,
        story: `${url}/1080/1920`,
        square: `${url}/1080/1080`,
      }
    };
    handleImageBgUrlSelect(luckyTemplate);
    setRectBgColor("#f4fdff");
    setRectOpacity(0.6);
  };


  const renderActiveTabContent = () => {
    const props = {
        title,
        setTitle,
        text, 
        setText, 
        handleGenerate, 
        isLoading,
        backgroundTab, 
        setBackgroundTab: setBackgroundTab as (value: string) => void, 
        handleFeelLucky,
        bgColor, 
        handleBgColorSelect: handleBgColorSelect, 
        imageBgUrl, 
        handleImageBgUrlSelect: handleImageBgUrlSelect,
        searchQuery, 
        setSearchQuery, 
        handleSearchImages: () => handleSearchImages(searchQuery, 1),
        isSearching, 
        searchedImages,
        handleKeywordSearch: handleKeywordSearch, 
        searchPage, 
        isOverlayEnabled, 
        setIsOverlayEnabled,
        overlayColor, 
        setOverlayColor, 
        overlayOpacity, 
        setOverlayOpacity, 
        gradientBg,
        handleGradientBgSelect: handleGradientBgSelect, 
        setSearchCarouselApi: (api: CarouselApi | undefined) => { if (api) searchCarouselApi.current = api }, 
        textColor, 
        setTextColor: handleTextColorChange, 
        textOpacity,
        setTextOpacity, 
        activeFont, 
        setActiveFont, 
        fontOptions, 
        isBold, 
        setIsBold,
        isUppercase, 
        setIsUppercase, 
        textAlign, 
        setTextAlign, 
        textShadowEnabled,
        setTextShadowEnabled, 
        shadows, 
        setShadows, 
        textStroke, 
        setTextStroke,
        strokeColor, 
        setStrokeColor, 
        strokeWidth, 
        setStrokeWidth, 
        isTextBoxEnabled,
        setIsTextBoxEnabled, 
        rectBgColor, 
        setRectBgColor, 
        rectOpacity,
        setRectOpacity, 
        activeEffect, 
        setActiveEffect: handleEffectChange, 
        designs, 
        handleDownloadAll,
        currentSlide,
        handleDownload,
        fileName, 
        setFileName, 
        handleApplyTemplate: applyTemplate, 
        myDesigns,
        handleSaveDesign: handleSaveDesign, 
        handleDeleteDesign: handleDeleteDesign, 
        handleUpdateDesign: handleUpdateDesign, 
        editingDesignId,
        handleEditClick, 
        handleCancelEdit: handleCancelEdit, 
        editingName, 
        setEditingName, 
        designToDelete,
        setDesignToDelete, 
        handleLogDesign, 
        handleImageUpload,
        elements, 
        setElements, 
        selectedElement, 
        setSelectedElement, 
        updateElement,
        areElementsEnabled, 
        setAreElementsEnabled,
    };

    switch (activeSettingsTab) {
      case 'designs': return <DesignsPanel handleApplyTemplate={applyTemplate} />;
      case 'favorites': return <MyDesignsPanel {...props} />;
      case 'background': return <BackgroundSettings {...props} />;
      case 'text': return <TextSettings {...props} />;
      case 'elements': return <ElementsPanel {...props} />;
      case 'download': return <DownloadPanel {...props} />;
      default: return null;
    }
  };

  const settingsTabs = [
    { value: "designs", icon: <LayoutTemplate className="h-5 w-5"/>, label: "Templates" },
    { value: "background", icon: <ImageIcon className="h-5 w-5"/>, label: "Background" },
    { value: "text", icon: <Type className="h-5 w-5"/>, label: "Text" },
    { value: "elements", icon: <Shapes className="h-5 w-5" />, label: "Elements" },
    { value: "favorites", icon: <HeartIcon className="h-5 w-5"/>, label: "Favorites" },
    { value: "download", icon: <Download className="h-5 w-5"/>, label: "Download" },
  ];
  
  const activeTabLabel = settingsTabs.find(tab => tab.value === activeSettingsTab)?.label;

  const renderBulletNavigation = () => {
    if (!carouselApi.current) return null;
    
    const totalSlides = designs.length;
    if (totalSlides <= 1) return null;

    const visibleDots = 7;
    const half = Math.floor(visibleDots / 2);

    let start = Math.max(currentSlide - half, 0);
    let end = start + visibleDots;

    if (end > totalSlides) {
      end = totalSlides;
      start = Math.max(end - visibleDots, 0);
    }
    
    const dots = [];
    for (let i = start; i < end; i++) {
        dots.push(
            <div
                key={i}
                data-active={i === currentSlide}
                onClick={() => carouselApi.current?.scrollTo(i)}
                className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
        );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-4">
        {start > 0 && (
          <>
            <div
              key={0}
              onClick={() => carouselApi.current?.scrollTo(0)}
              className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
            {start > 1 && <span className="text-foreground -translate-y-1">...</span>}
          </>
        )}
        {dots}
        {end < totalSlides && (
          <>
            {end < totalSlides - 1 && <span className="text-foreground -translate-y-1">...</span>}
            <div
              key={totalSlides - 1}
              onClick={() => carouselApi.current?.scrollTo(totalSlides - 1)}
              className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
          </>
        )}
      </div>
    );
  };
  
  if (!isClient) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
        background: 
        'linear-gradient(to top right, var(--primary), var(--secondary), var(--accent)'
      }}>
          <div className="w-64 h-64">
              <Lottie animationData={webflowAnimation} loop={true} />
          </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
       {/******************************************************
      *
      * HEADER
      *
      *******************************************************/}
      <header className="w-full text-left p-4 md:px-8 h-[6vh] md:h-[5vh] flex items-center justify-between flex-shrink-0 z-20 bg-background">
        <Logo className="text-[1.5rem] text-primary" />
        
      </header>

      <div className="flex-1 flex overflow-hidden" style={{ height: isMobile ? 'calc(100vh - 10vh - 56px)' : 'auto' }}>
      {/******************************************************
      *
      * DESKTOP SIDEBAR
      * This section is only visible on screens wider than 767px (md breakpoint).
      * It contains the main settings tabs and their content.
      *
      *******************************************************/}
      {designs.length > 0 && (
          <div className={cn("hidden md:flex flex-shrink-0 bg-sidebar transition-all duration-300 ease-in-out z-50", isSidebarOpen ? "w-[40vw]" : "w-[3vw]")}>
              <Tabs
                  orientation="vertical"
                  value={activeSettingsTab}
                  onValueChange={handleDesktopTabClick}
                  className="flex w-full"
              >
                  <div className="flex flex-col items-center p-0 space-y-2 bg-sidebar">
                      <TabsList className="flex flex-col h-full justify-start items-center p-0 bg-sidebar space-y-1">
                          {settingsTabs.map(tab => (
                              <TooltipProvider key={tab.value}>
                                  <Tooltip>
                                      <TooltipTrigger asChild>
                                          <TabsTrigger 
                                              value={tab.value} 
                                              className="w-12 h-12 data-[state=active]:bg-primary/20"
                                              onClick={() => handleDesktopTabClick(tab.value)}
                                          >
                                              {tab.icon}
                                          </TabsTrigger>
                                      </TooltipTrigger>
                                      {!isSidebarOpen && <TooltipContent side="right"><p>{tab.label}</p></TooltipContent>}
                                  </Tooltip>
                              </TooltipProvider>
                          ))}
                      </TabsList>
                  </div>
                  
                  {isSidebarOpen && (
                      <div className="flex-grow flex flex-col w-full bg-sidebar">
                          <div className="p-4 flex-shrink-0 flex justify-between items-center bg-sidebar">
                              <h3 className="text-lg font-semibold capitalize text-sidebar-foreground">{activeTabLabel}</h3>
                              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="h-8 w-8 rounded-full">
                                  <X className="h-5 w-5" />
                                  <span className="sr-only">Close Panel</span>
                              </Button>
                          </div>
                          <TabsContent value={activeSettingsTab} className="mt-0 flex-grow overflow-y-auto">
                              {renderActiveTabContent()}
                          </TabsContent>
                      </div>
                  )}
              </Tabs>
          </div>
      )}
      {/******************************************************
      *
      * END DESKTOP SIDEBAR
      *
      *******************************************************/}

        {/******************************************************
        *
        * Main Content Area
        *
        *******************************************************/}
        <main 
          ref={designsRef}
          className={cn("flex-1 flex items-center justify-center overflow-hidden h-full p-4 relative cursor-default")}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        >
        {designs.length > 0 && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-30 bg-muted p-1 flex gap-1 rounded-md">
                <div className="bg-card/20 backdrop-blur-sm p-1 flex gap-1 flex-shrink-0 rounded-md">
                    {canvasSizes.map(size => (
                    <TooltipProvider key={size.name}>
                        <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-8 w-8 text-primary",
                                canvasSize.name === size.name && "bg-primary-foreground/20"
                            )}
                            onClick={() => handleCanvasSizeChange(size)}
                            >
                            {size.name === 'Post' && <Smartphone className="h-5 w-5" />}
                            {size.name === 'Story' && <RectangleVertical className="h-5 w-5" />}
                            {size.name === 'Square' && <Square className="h-5 w-5" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{size.name} Format</p>
                        </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    ))}
                </div>
                <div className="bg-card/20 backdrop-blur-sm p-1 flex items-center gap-1 rounded-md">
                <TooltipProvider>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleZoom('out')} disabled={zoomLevel <= MIN_ZOOM}>
                            <ZoomOut className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Zoom Out (-)</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => resetPanAndZoom(canvasSize)}>
                            <RotateCcw className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Reset Zoom</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleZoom('in')} disabled={zoomLevel >= MAX_ZOOM}>
                            <ZoomIn className="h-5 w-5" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Zoom In (+)</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                </div>
            </div>
        )}

          {designs.length === 0 ? (
            <div className="w-full max-w-2xl">
              <CreativeMagicPanel 
                  title={title}
                  setTitle={setTitle}
                  text={text}
                  setText={setText}
                  handleGenerate={handleGenerate}
                  isLoading={isLoading}
              />
            </div>
          ) : (
            <div 
              id="designs-container"
              className="w-full h-full flex flex-col items-center justify-center"
              onWheel={(e) => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
                  return;
                }
                e.preventDefault();
                const direction = e.deltaY > 0 ? 'out' : 'in';
                handleZoom(direction);
              }}
            >
                <div 
                  className="relative" 
                  style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})` }}
                >
                  <Carousel className="w-full" setApi={setApi => carouselApi.current = setApi}>
                    <CarouselContent>
                      {designs.map((design, index) => (
                        <CarouselItem key={index} data-index={index}>
                          <div 
                            className="p-1 group relative"
                          >
                            <Card className="overflow-hidden border-0">
                              <CardContent className="p-0 relative bg-card" style={{ aspectRatio: `${canvasSize.width}/${canvasSize.height}`}}>
                                {renderCanvas(design, index)}
                              </CardContent>
                            </Card>
                            <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <AlertDialog>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-14 w-14 flex items-center justify-center rounded-full bg-gray/20 backdrop-blur-sm text-white hover:bg-red/50 hover:text-red-400 [&_svg]:size-8"
                                        >
                                          <HeartIconG className="h-12 w-12" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                     <p>Save to Favorites</p>
                                    </TooltipContent>
                                  </Tooltip>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will save the current background, font, and color settings as a new favorite template.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleSaveDesign}>Save</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                                </TooltipProvider>
                              </AlertDialog>
                            </div>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
                
                {renderBulletNavigation()}

            </div>
          )}
        </main>
      </div>

      {isGeneratingAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
            background: 
            'linear-gradient(to top right,  var(--primary),  var(--secondary)'
          }}>
              <div className="w-64 h-64">
                  <Lottie animationData={webflowAnimation} loop={true} />
              </div>
          </div>
      )}

      {/******************************************************
      *
      * MOBILE TAB SYSTEM
      * This section is only visible on screens narrower than 768px (md breakpoint).
      * It uses a Sheet component to display settings from the bottom.
      *
      *******************************************************/}
      {isClient && designs.length > 0 && (
          <div ref={mobilePanelRef} className="md:hidden">
              <Sheet open={isMobilePanelOpen} onOpenChange={(isOpen) => {
                  if (!isOpen) {
                      setActiveSettingsTab('');
                  }
                  setIsMobilePanelOpen(isOpen);
              }}>
                  <SheetContent side="bottom" className="h-auto max-h-[40vh] p-0 flex flex-col bg-background">
                      <SheetHeader className="p-4 border-b flex-row justify-between items-center bg-background">
                          <SheetTitle className="capitalize">{activeTabLabel}</SheetTitle>
                      </SheetHeader>
                      <div className="flex-grow overflow-y-auto">
                          {renderActiveTabContent()}
                      </div>
                  </SheetContent>
              </Sheet>

              <div className={cn("fixed bottom-0 left-0 right-0 z-30 bg-background border-t", isMobilePanelOpen ? "hidden" : "block")}>
                  <Tabs value={activeSettingsTab ?? ''} className="w-full">
                      <TabsList className="grid w-full grid-cols-6 h-14 rounded-none bg-background">
                          {settingsTabs.map(tab => (
                              <TabsTrigger key={tab.value} value={tab.value} onClick={() => handleMobileTabClick(tab.value)}>
                                  {tab.icon}
                              </TabsTrigger>
                          ))}
                      </TabsList>
                  </Tabs>
              </div>
          </div>
      )}
      {/******************************************************
      *
      * END MOBILE TAB SYSTEM
      *
      *******************************************************/}
    </div>
  );
}

    

