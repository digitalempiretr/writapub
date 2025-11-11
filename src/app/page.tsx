
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, ImageIcon, LayoutTemplate, Type, X, RectangleVertical, Smartphone, Square, HeartIcon, PanelLeft, ZoomIn, ZoomOut, RotateCcw, Shapes, RefreshCcw, RefreshCcwIcon, Info, Share2 } from "lucide-react";
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
import { pageInitialColors, gradientTemplates } from "@/lib/colors";
import { CreativeMagicPanel } from "@/components/0_creative-magic-panel";
import { cn } from "@/lib/utils";
import { textEffects, parseShadow, TextEffect } from "@/lib/text-effects";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { HeartIconG, RefreshIcon  } from "@/components/ui/icons";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MakeCarouselSidebar } from "@/components/makeCarousel-sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NavBullets } from "@/components/ui/nav-bullets";


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

/**
 * Measures and splits a given text to fit within a specified width and line count.
 * @param {CanvasRenderingContext2D} context - The canvas rendering context for text measurement.
 * @param {string} text - The input text to be split.
 * @param {number} maxWidth - The maximum width the text can occupy.
 * @param {number} baseMaxLines - The base maximum number of lines for a slide.
 * @param {number} extendedMaxLines - The extended maximum number of lines to avoid awkward sentence breaks.
 * @returns {{ textForCanvas: string; remainingText: string }} - An object containing the text for the current canvas and the remaining text.
 */
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


/**
 * The main component for the Writa application, handling state and UI for the design editor.
 */
export default function Home() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState(defaultText);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [searchCarouselApi, setSearchCarouselApi] = useState<CarouselApi>();


  const [currentSlide, setCurrentSlide] = useState(0);
  const [myDesigns, setMyDesigns] = useLocalStorage<DesignTemplate[]>('writa-designs', []);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);

  const [backgroundType, setBackgroundType] = useState<BackgroundType>('image');
  const [currentTemplate, setCurrentTemplate] = useState<ImageTemplate | null>(imageTemplates[1]);
  
  /**
   * Effect to set the isClient flag to true once the component mounts on the client.
   * This is used to prevent hydration errors by ensuring browser-specific APIs are only called on the client.
   */
  useEffect(() => {
    setIsClient(true)
  }, [])

  /**
   * Handles the carousel's "select" event to update the current slide index.
   */
  const handleSelectCarousel = useCallback(() => {
    if (!carouselApi) {
      return
    }
    setCurrentSlide(carouselApi.selectedScrollSnap())
  }, [carouselApi]);

  /**
   * Effect to set up and clean up the carousel's "select" event listener.
   */
  useEffect(() => {
    if (!carouselApi) {
      return
    }

    handleSelectCarousel();
    carouselApi.on("select", handleSelectCarousel)

    return () => {
      carouselApi?.off("select", handleSelectCarousel)
    }
  }, [carouselApi, handleSelectCarousel]);

  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions.find(f => f.value === 'duru-sans') || fontOptions[0]);
  const [fontSize, setFontSize] = useState(48);

  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [isBold, setIsBold] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [backgroundTab, setBackgroundTab] = useState<BackgroundType>("image");
  const [bgColor, setBgColor] = useState(pageInitialColors.bgColor);
  const [textColor, setTextColor] = useState(pageInitialColors.textColor);
  const [textOpacity, setTextOpacity] = useState(1);
  const [gradientBg, setGradientBg] = useState(gradientTemplates[0].css);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[1].imageUrls.post);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(canvasSizes[0]);
  
  const [isTextBoxEnabled, setIsTextBoxEnabled] = useState(false);
  const [rectBgColor, setRectBgColor] = useState(pageInitialColors.rectBgColor);
  const [rectOpacity, setRectOpacity] = useState(0);

  const [textBoxPadding, setTextBoxPadding] = useState(50);
  const [textBoxBorderRadius, setTextBoxBorderRadius] = useState(0);
  const [isTextBoxBorderEnabled, setIsTextBoxBorderEnabled] = useState(false);
  const [textBoxBorderColor, setTextBoxBorderColor] = useState('#000000');
  const [textBoxBorderWidth, setTextBoxBorderWidth] = useState(2);


  const [isOverlayEnabled, setIsOverlayEnabled] = useState(false);
  const [overlayColor, setOverlayColor] = useState(pageInitialColors.overlayColor);
  const [overlayOpacity, setOverlayOpacity] = useState(0.25);

  const [textShadowEnabled, setTextShadowEnabled] = useState(false);
  const [shadows, setShadows] = useState<Shadow[]>([]);
  
  useEffect(() => {
    if (shadows.length === 0) {
      // Initialize with a default shadow only on the client side
      setShadows([{ id: Date.now(), color: '#000000', offsetX: 5, offsetY: 5, blur: 5, offsetXUnit: 'px', offsetYUnit: 'px', blurUnit: 'px' }]);
    }
  }, [shadows]);


  const [activeEffect, setActiveEffect] = useState<TextEffect>(textEffects[0]);

  const [textStroke, setTextStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('designs');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [fileName, setFileName] = useState("Untitled design");
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


  /**
   * Generates design slides from the user's title and text input.
   */
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
    const finalFontSize = fontSize * scalingFactor;
    const finalFontWeight = isBold ? Math.min(Number(activeFont.weight) + 300, 900) : activeFont.weight;
  
    document.fonts.load(`${finalFontWeight} ${finalFontSize}px "${activeFont.fontFamily}"`).then(() => {
        ctx.font = `${finalFontWeight} ${finalFontSize}px "${activeFont.fontFamily}"`;
  
        const rectHeight = 1100 * (canvasSize.height / 1350);
        const rectWidth = 830 * (canvasSize.width / 1080);
        const textMaxWidth = rectWidth - (textBoxPadding * 2 * scalingFactor);
        const currentLineHeight = typeof activeFont.lineHeight === 'number' ? activeFont.lineHeight : parseFloat(activeFont.lineHeight as string);
        const finalLineHeight = finalFontSize * currentLineHeight;
  
        // Dynamically calculate max lines based on available height
        const dynamicMaxLines = Math.floor(rectHeight / finalLineHeight);
        const baseMaxLines = Math.max(1, dynamicMaxLines - 2); // Leave some buffer
        const extendedMaxLines = dynamicMaxLines; // Allow using full height if needed
  
        // Continue processing only if there's text left
        while (remainingText.length > 0) {
            const result = measureAndSplitText(ctx, remainingText, textMaxWidth, baseMaxLines, extendedMaxLines);
            
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
        setTimeout(() => carouselApi?.scrollTo(0), 100);
    });
  }, [text, title, canvasSize, activeFont, isBold, carouselApi, textBoxPadding, fontSize]);
  
  useEffect(() => {
    if (designs.length > 0) {
      const timeoutId = setTimeout(() => {
        handleGenerate();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBold, isUppercase, textAlign, activeEffect]);


  /**
   * Closes the mobile settings panel.
   */
   const closePanel = useCallback(() => {
    setIsMobilePanelOpen(false);
  }, []);

  /**
   * Effect to handle clicks outside the mobile panel to close it.
   */
   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!isMobilePanelOpen) return;

      const targetElement = event.target as Element;

      // Check if the click is on the sheet itself or a popover/dialog triggered from within the sheet
      const isClickInsideSheet = mobilePanelRef.current && mobilePanelRef.current.contains(targetElement);
      const isClickOnDialog = targetElement.closest('[role="dialog"], [data-radix-dialog-overlay]');
      const isClickOnPopover = targetElement.closest('[data-radix-popper-content-wrapper]');

      if (!isClickInsideSheet && !isClickOnDialog && !isClickOnPopover) {
          closePanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobilePanelOpen, closePanel]);

  /**
   * Triggers the download of a single canvas slide as a PNG image.
   * @param {number} index - The index of the design to download.
   */
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

  /**
   * Triggers the download of all generated canvas slides sequentially.
   */
  const handleDownloadAll = useCallback(() => {
    designs.forEach((_, index) => {
      setTimeout(() => handleDownload(index), index * 300);
    });
  }, [designs, handleDownload]);


  /**
   * Logs the current design's configuration to the console for development purposes.
   */
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
        fontSize: fontSize,
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
  }, [backgroundType, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, toast, activeEffect, canvasSize, fontSize]);

  /**
   * Applies the styles from a selected text effect to the canvas text.
   */
  const handleEffectChange = (effect: TextEffect) => {
    setActiveEffect(effect);

    if (effect.fontValue) {
        const newFont = fontOptions.find(f => f.value === effect.fontValue);
        if (newFont) {
            setActiveFont(newFont);
        }
    }
    if (typeof effect.style.fontSize === 'number') {
        setFontSize(effect.style.fontSize);
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

  /**
   * Updates the text color and recalculates shadow colors if an effect is active.
   * @param {string} newColor - The new color for the text.
   */
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
  
  /**
   * Handles the file upload event for images, creating a new canvas element.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The file input change event.
   */
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

  /**
   * Updates the properties of a specific canvas element.
   * @param {string} id - The ID of the element to update.
   * @param {Partial<CanvasElement>} newProps - The new properties to apply.
   */
  const updateElement = (id: string, newProps: Partial<CanvasElement>) => {
    setElements(prev =>
      prev.map(el => (el.id === id ? { ...el, ...newProps } : el))
    );
  };

  /**
   * Renders a single canvas slide with the current settings.
   * @param {Design} design - The design object containing text and title info.
   * @param {number} index - The index of the slide.
   * @returns {JSX.Element} - The ImageCanvas component.
   */
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
          fontSize={fontSize}
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
          textBoxPadding={textBoxPadding}
          textBoxBorderRadius={textBoxBorderRadius}
          isTextBoxBorderEnabled={isTextBoxBorderEnabled}
          textBoxBorderColor={textBoxBorderColor}
          textBoxBorderWidth={textBoxBorderWidth}
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
    isTextBoxEnabled, isOverlayEnabled, activeEffect, canvasSize, elements, areElementsEnabled,
    textBoxPadding, textBoxBorderRadius, isTextBoxBorderEnabled, textBoxBorderColor, textBoxBorderWidth, fontSize
  ]);
  
  /**
   * Handles tab clicks in the mobile view, opening the settings panel.
   * @param {string} tab - The value of the tab being clicked.
   */
  const handleMobileTabClick = (tab: string) => {
    if (activeSettingsTab === tab && isMobilePanelOpen) {
      // Don't close if it's already open and the same tab is clicked
    } else {
      setActiveSettingsTab(tab);
      setIsMobilePanelOpen(true);
    }
  };
  
  /**
   * Handles tab clicks in the desktop view, changing the active settings panel.
   */
  const handleDesktopTabClick = (tab: string) => {
      setActiveSettingsTab(tab);
      if (!isSidebarOpen) {
          setIsSidebarOpen(true);
      }
  };

  /**
   * Handles zooming in or out of the canvas area.
   * @param {'in' | 'out'} direction - The direction of the zoom.
   */
  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
        const newZoom = direction === 'in' ? prev + ZOOM_STEP : prev - ZOOM_STEP;
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    });
  };

  /**
   * Effect to handle keyboard events for panning.
   */
  useEffect(() => {
    /**
     * Handles keydown events for panning (spacebar).
     * @param {KeyboardEvent} e - The keyboard event.
     */
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
    /**
     * Handles keyup events to stop panning.
     * @param {KeyboardEvent} e - The keyboard event.
     */
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

  /**
   * Initiates panning when the user holds down the mouse button while panning is active.
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event.
   */
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      e.preventDefault();
       if (designsRef.current) {
        designsRef.current.style.cursor = 'grabbing';
      }
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  /**
   * Updates the pan offset as the user moves the mouse.
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event.
   */
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning && e.buttons === 1) {
      e.preventDefault();
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  /**
   * Ends the panning action when the mouse button is released.
   * @param {React.MouseEvent<HTMLDivElement>} e - The mouse event.
   */
  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
       if (designsRef.current) {
        designsRef.current.style.cursor = 'grab';
      }
    }
  };
  
  /**
   * Calculates the distance between two touch points for pinch-to-zoom.
   * @param {Touch} touch1 - The first touch point.
   * @param {Touch} touch2 - The second touch point.
   * @returns {number} - The distance between the touches.
   */
  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  /**
   * Handles the start of a touch event, initiating panning or pinch-to-zoom.
   * @param {React.TouchEvent<HTMLDivElement>} e - The touch event.
   */
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.nativeEvent.touches.length === 2) {
      e.preventDefault(); // Prevent default scroll/zoom
      const touch1 = e.nativeEvent.touches[0];
      const touch2 = e.nativeEvent.touches[1];
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
  
  /**
   * Handles the movement of touches, updating pan and zoom levels.
   * @param {React.TouchEvent<HTMLDivElement>} e - The touch event.
   */
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.nativeEvent.touches.length === 2) {
      e.preventDefault(); // Prevent default scroll/zoom
      const touch1 = e.nativeEvent.touches[0];
      const touch2 = e.nativeEvent.touches[1];
      if (!touch1 || !touch2) return;
  
      // Panning
      const midX = (touch1.clientX + touch2.clientX) / 2;
      const midY = (touch1.clientY + touch2.clientY) / 2;
      setPanOffset({
        x: midX - panStart.x,
        y: midY - panStart.y,
      });
  
      // Zooming
      if (pinchState) {
        const newDist = getDistance(touch1, touch2);
        const scale = newDist / pinchState.distance;
        let newZoom = pinchState.zoom * scale;
        newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
        setZoomLevel(newZoom);
      }
    }
  };
  
  /**
   * Ends the pinch-to-zoom action when touches are released.
   * @param {React.TouchEvent<HTMLDivElement>} e - The touch event.
   */
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length < 2) {
      setPinchState(null);
    }
  };


  /**
   * Resets the pan and zoom levels to a default state based on canvas size and device type.
   * @param {CanvasSize} size - The current canvas size.
   * @returns {number} The new zoom level.
   */
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

  /**
   * Effect to reset pan and zoom when the canvas size or client status changes.
   */
  useEffect(() => {
    if(isClient){
      resetPanAndZoom(canvasSize);
    }
  }, [isClient, canvasSize, resetPanAndZoom]);

  /**
   * Changes the canvas size and resets pan/zoom accordingly.
   * @param {CanvasSize} size - The new canvas size to apply.
   */
  const handleCanvasSizeChange = (size: CanvasSize) => {
    setCanvasSize(size);
  }
  /**
   * Applies all styles from a selected design template.
   * @param {DesignTemplate} template - The template to apply.
   */
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
    setActiveFont(newFont);
    
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

  /**
   * Saves the current design settings as a new favorite in local storage.
   */
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
        fontSize: fontSize,
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
  
  /**
   * Deletes a favorite design from local storage.
   * @param {string} id - The ID of the design to delete.
   */
  const handleDeleteDesign = (id: string) => {
    setMyDesigns(prev => prev.filter(d => d.id !== id));
    setDesignToDelete(null);
    toast({
      title: "Favorite Deleted",
      variant: "destructive",
    });
  };

  /**
   * Enters edit mode for a favorite design's name.
   * @param {string} id - The ID of the design to edit.
   * @param {string} name - The current name of the design.
   */
  const handleEditClick = (id: string, name: string) => {
    setEditingDesignId(id);
    setEditingName(name);
  };
  
  /**
   * Updates the name of a favorite design in local storage.
   * @param {string} id - The ID of the design to update.
   */
  const handleUpdateDesign = (id: string) => {
    setMyDesigns(prev => prev.map(d => d.id === id ? { ...d, name: editingName } : d));
    setEditingDesignId(null);
    setEditingName('');
  };
  
  /**
   * Cancels the editing of a favorite design's name.
   */
  const handleCancelEdit = () => {
    setEditingDesignId(null);
    setEditingName('');
  };

  /**
   * Handles the selection of a solid background color.
   */
  const handleBgColorSelect = (color: string) => {
    setBgColor(color);
    setBackgroundType('flat');
  };

  /**
   * Handles the selection of a gradient background.
   */
  const handleGradientBgSelect = (css: string) => {
    setGradientBg(css);
    setBackgroundType('gradient');
  };

  /**
   * Handles the selection of a predefined image background.
   * @param {ImageTemplate} template - The selected image template.
   */
  const handleImageBgUrlSelect = (template: ImageTemplate) => {
    const sizeName = canvasSize.name.toLowerCase() as 'post' | 'story' | 'square';
    setImageBgUrl(template.imageUrls[sizeName]);
    setBackgroundType('image');
  };

  /**
   * Searches for images using the Pexels API.
   * @param {string} query - The search term.
   * @param {number} [page=1] - The page number for pagination.
   */
    const handleSearchImages = useCallback(async (query: string, page: number = 1) => {
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
        if(page === 1) {
            setSearchQuery(query);
            setSearchedImages([]); 
        }

        try {
            const results = await findImages({ query, page: page, per_page: 4 });
            if (results.imageUrls.length === 0 && page === 1) {
                toast({ title: "No images found." });
                setSearchedImages([]);
            } else {
                 setSearchedImages(prev => {
                    const newImages = [...results.imageUrls, ...prev];
                    const uniqueImages = Array.from(new Set(newImages));
                    return uniqueImages.slice(0, 12); 
                });
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
            if (page === 1) {
                 setTimeout(() => searchCarouselApi?.scrollTo(0), 100);
            }
        }
    }, [toast, searchCarouselApi]);

  /**
   * Initiates an image search based on a keyword click.
   * @param {string} keyword - The keyword to search for.
   */
  const handleKeywordSearch = useCallback((keyword: string) => {
    handleSearchImages(keyword, 1);
  }, [handleSearchImages]);

  /**
   * Selects a random image from Picsum Photos and applies a default style.
   */
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


  /**
   * Renders the content of the currently active settings tab.
   * @returns {JSX.Element | null} The component for the active tab.
   */
  const renderActiveTabContent = () => {
    const props = {
        title,
        setTitle,
        text, 
        setText, 
        handleGenerate, 
        isLoading,
        backgroundTab, 
        setBackgroundTab,
        handleFeelLucky,
        bgColor, 
        handleBgColorSelect,
        imageBgUrl, 
        handleImageBgUrlSelect,
        searchQuery, 
        setSearchQuery, 
        handleSearchImages,
        isSearching, 
        searchedImages,
        handleKeywordSearch, 
        searchPage, 
        isOverlayEnabled, 
        setIsOverlayEnabled,
        overlayColor, 
        setOverlayColor, 
        overlayOpacity, 
        setOverlayOpacity, 
        gradientBg,
        handleGradientBgSelect, 
        setSearchCarouselApi: setSearchCarouselApi, 
        textColor, 
        setTextColor: handleTextColorChange, 
        textOpacity,
        setTextOpacity, 
        activeFont, 
        setActiveFont,
        fontSize,
        setFontSize,
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
        setRectBgColor, _rectOpacity: rectOpacity,
        setRectOpacity: setRectOpacity,
        textBoxPadding,
        setTextBoxPadding,
        textBoxBorderRadius,
        setTextBoxBorderRadius,
        isTextBoxBorderEnabled,
        setIsTextBoxBorderEnabled,
        textBoxBorderColor,
        setTextBoxBorderColor,
        textBoxBorderWidth,
        setTextBoxBorderWidth,
        activeEffect, 
        setActiveEffect: handleEffectChange, 
        designs, 
        handleDownloadAll,
        currentSlide,
        handleDownload,
        handleApplyTemplate: applyTemplate, 
        myDesigns,
        handleSaveDesign: handleSaveDesign, 
        handleDeleteDesign: handleDeleteDesign, 
        handleUpdateDesign: handleUpdateDesign, 
        editingDesignId,
        handleEditClick, _handleCancelEdit: handleCancelEdit,
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
  
  /**
   * Render a loading animation if the component is not yet mounted on the client.
   */
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
      {/* 
      ********************************************************************************
      * HEADER
      * Displays the application logo.
      ********************************************************************************
      */}
      <header className="w-full text-left p-8 px-4 md:px-4 h-[5vh] md:h-[5vh] flex items-center justify-between flex-shrink-0 z-20 bg-sidebar shadow-sm md:shadow-none ">
        <Logo className="text-[1.2rem] md:text-[1.5rem] text-primary pe-12" />
        {designs.length > 0 && (
           <div className="flex items-center gap-2 w-full max-w-xs">
            <Input
              id="file-name-header"
              name="file-name"
              type="text"
              placeholder="Enter file name..."
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-sidebar hover:border-primary text-primary h-8 rounded-sm focus:border-indigo-600 focus:outline-hidden text-md bold text-right"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded bg-transparent">
                  <Download className="h-4 w-4" color="var(--primary)" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleDownload(currentSlide)} disabled={designs.length === 0}>
                   <Download className="mr-2 h-4 w-4" />
                  <span>Download Current</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadAll} disabled={designs.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download All Designs</span>
                </DropdownMenuItem>
                
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </header>

      <div className="flex-1 flex overflow-hidden" style={{ height: isMobile ? 'calc(100vh - 10vh - 56px)' : 'auto' }}>
      {/*
      ********************************************************************************
      * DESKTOP SIDEBAR
      * This section is only visible on screens wider than 767px (md breakpoint).
      * It contains the main settings tabs and their content.
      ********************************************************************************
      */}
      {designs.length > 0 && (
          <MakeCarouselSidebar
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            activeSettingsTab={activeSettingsTab}
            handleDesktopTabClick={handleDesktopTabClick}
            settingsTabs={settingsTabs}
            activeTabLabel={activeTabLabel}
            renderActiveTabContent={renderActiveTabContent}
          />
      )}
      {/*
      ********************************************************************************
      * END DESKTOP SIDEBAR
      ********************************************************************************
      */}

      {/*
      ********************************************************************************
      * Main Content Area
      * This area handles the display of either the initial text input
      * form or the generated design carousel. It also includes
      * controls for panning and zooming the canvas.
      ********************************************************************************
      */}
        <main 
          ref={designsRef}
          className={cn("flex-1 flex items-center justify-center overflow-hidden h-full p-4 relative cursor-default bg-[url(https://www.transparenttextures.com/patterns/project-paper.png)]")}
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
            <div className="md:w-auto md:justify-center absolute top-0.5 md:top-1.5 left-1/2 -translate-x-1/2 z-30 bg-muted p-1 flex gap-1 md:rounded-md w-full justify-between px-4">
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
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary z-30" onClick={() => handleZoom('out')} disabled={zoomLevel <= MIN_ZOOM}>
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
                  <Carousel className="w-full" setApi={setCarouselApi}>
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
                
                <div className="hidden md:flex md:justify-center md:items-center md:gap-2 mt-4">
                  <NavBullets api={carouselApi} current={currentSlide} total={designs.length} />
                </div>
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

      {/* Mobile-only bullet navigation */}
      {isClient && designs.length > 0 && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 z-20">
            <NavBullets api={carouselApi} current={currentSlide} total={designs.length} />
        </div>
      )}

      {/*
      ********************************************************************************
      * MOBILE TAB SYSTEM
      * This section is only visible on screens narrower than 768px (md breakpoint).
      * It uses a Sheet component to display settings from the bottom.
      ********************************************************************************
      */}
      {isClient && designs.length > 0 && (
          <div ref={mobilePanelRef} className="md:hidden">
              {/* Sheet component for mobile settings */}
              <Sheet open={isMobilePanelOpen} onOpenChange={(isOpen) => {
                  if (!isOpen) {
                      setActiveSettingsTab(''); // Reset active tab when sheet closes
                  }
                  setIsMobilePanelOpen(isOpen);
              }}>
                  <SheetContent side="bottom" className="h-auto max-h-[55vh] p-0 flex flex-col bg-sidebar" onOpenAutoFocus={(e) => e.preventDefault()}>
                      {/* Header for the mobile settings panel */}
                      <SheetHeader className="p-2 px-4 border-b flex-row justify-between items-center bg-background">
                          <SheetTitle className="capitalize">{activeTabLabel}</SheetTitle>
                      </SheetHeader>
                      {/* Scrollable content area for the active tab */}
                      <div className="flex-grow overflow-y-auto">
                          {renderActiveTabContent()}
                      </div>
                  </SheetContent>
              </Sheet>

              {/* Bottom navigation bar for mobile */}
              <div className={cn("fixed bottom-0 left-0 right-0 z-30 bg-sidebar border-t", isMobilePanelOpen ? "hidden" : "block")}>
                  <Tabs value={activeSettingsTab ?? ''} className="w-full">
                      <TabsList className="grid w-full grid-cols-6 h-14 rounded-none bg-sidebar">
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
       {/*
      ********************************************************************************
      * END MOBILE TAB SYSTEM
      ********************************************************************************
      */}
    </div>
  );
}
