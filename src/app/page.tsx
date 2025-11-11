
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
import { pageInitialColors } from "@/lib/colors";
import { gradientTemplates } from '@/lib/gradient-templates';
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
  const [zoomLevel, setZoomLevel]