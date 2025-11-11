
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [generatedCanvases, setGeneratedCanvases] = useState<HTMLCanvasElement[]>([]);
  const { toast } = useToast();

  // Elements state
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [areElementsEnabled, setAreElementsEnabled] = useState(true);

  const isMobile = useIsMobile();

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  const handleZoomReset = () => setZoomLevel(1);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newElement: CanvasElement = {
          id: `element_${Date.now()}`,
          type: 'image',
          url: e.target?.result as string,
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
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...newProps } : el));
  };


  const handleBgColorSelect = (color: string) => {
    setBgColor(color);
    setBackgroundType('flat');
    setImageBgUrl('');
    setGradientBg('');
  };
  
  const handleGradientBgSelect = (css: string) => {
    setGradientBg(css);
    setBackgroundType('gradient');
    setImageBgUrl('');
  };

  const handleImageBgUrlSelect = (template: ImageTemplate) => {
    setCurrentTemplate(template);
    const newUrl = template.imageUrls[canvasSize.name.toLowerCase() as keyof typeof template.imageUrls] || template.imageUrls.post;
    setImageBgUrl(newUrl);
    setBackgroundType('image');
  };

  const handleFeelLucky = () => {
    const randomTemplate = imageTemplates[Math.floor(Math.random() * imageTemplates.length)];
    handleImageBgUrlSelect(randomTemplate);
  }

  const handleSearchImages = async (query: string, page = 1) => {
    if (!query.trim()) return;
    setIsSearching(true);
    try {
      const result = await findImages({ query, page, per_page: 12 });
      if (page === 1) {
        setSearchedImages(result.imageUrls);
      } else {
        setSearchedImages(prev => [...prev, ...result.imageUrls]);
      }
      setSearchPage(page);

      if (page === 1 && result.imageUrls.length > 0) {
        handleImageSelectFromSearch(result.imageUrls[0]);
        setTimeout(() => searchCarouselApi?.scrollTo(0), 100);
      }

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Image search failed.",
        description: error.message || "Could not fetch images from Pexels.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageSelectFromSearch = (imageUrl: string) => {
    handleImageBgUrlSelect({
      name: `Search: ${searchQuery}`,
      imageUrls: {
        post: imageUrl,
        story: imageUrl,
        square: imageUrl,
      },
    });
  };

  const handleKeywordSearch = (keyword: string) => {
    setSearchQuery(keyword);
    handleSearchImages(keyword, 1);
  };


  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const generateDesigns = useCallback(() => {
    if (!text.trim()) {
      toast({
        title: 'Text is empty',
        description: 'Please enter some text to generate designs.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsGeneratingAnimation(true);
    setTimeout(() => {
      setIsLoading(true);
      setDesigns([]); // Clear previous designs
      setGeneratedCanvases([]); // Clear previous canvases
      setActiveSettingsTab('designs');
      
      setTimeout(() => {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasSize.width;
        tempCanvas.height = canvasSize.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) {
          setIsLoading(false);
          setIsGeneratingAnimation(false);
          return;
        }

        const scalingFactor = canvasSize.width / 1080;
        const finalFontSize = fontSize * scalingFactor;
        const finalLineHeight = finalFontSize * (typeof activeFont.lineHeight === 'number' ? activeFont.lineHeight : parseFloat(activeFont.lineHeight as string));
        const finalPadding = textBoxPadding * scalingFactor;

        const rectWidth = (canvasSize.name === 'Square' ? 900 : 830) * scalingFactor;
        const textMaxWidth = rectWidth - (finalPadding * 2);

        const rectHeight = (canvasSize.name === 'Story' ? 1500 : canvasSize.name === 'Square' ? 900 : 1100) * scalingFactor;
        const textMaxHeight = rectHeight - (finalPadding * 2);

        ctx.font = `${isBold ? Math.min(Number(activeFont.weight) + 300, 900) : activeFont.weight} ${finalFontSize}px "${activeFont.fontFamily}"`;
        
        const baseMaxLines = Math.floor(textMaxHeight / finalLineHeight);
        const extendedMaxLines = baseMaxLines + 2; 

        let remainingText = text;
        const newDesigns: Design[] = [];
        
        let finalTitle = title.trim();
        if (!finalTitle && !text.startsWith('http') && !text.startsWith('www')) {
          const firstSentenceMatch = text.match(/^[^.!?\n]+[.!?\n]?/);
          if (firstSentenceMatch) {
              finalTitle = firstSentenceMatch[0].trim();
              remainingText = text.substring(finalTitle.length).trim();
          } else {
              const firstLine = text.split('\n')[0];
              finalTitle = firstLine;
              remainingText = text.substring(finalLine.length).trim();
          }
        } else if (!finalTitle) {
          finalTitle = text.split('\n')[0];
          remainingText = text.substring(finalTitle.length).trim();
        }

        if (finalTitle) {
          newDesigns.push({ text: finalTitle, isTitle: true });
        }
        
        let loopCount = 0;
        const maxLoops = 50; 
        while (remainingText.trim().length > 0 && loopCount < maxLoops) {
          const { textForCanvas, remainingText: nextRemainingText } = measureAndSplitText(
            ctx,
            remainingText,
            textMaxWidth,
            baseMaxLines,
            extendedMaxLines
          );
          
          if (textForCanvas) {
            newDesigns.push({ text: textForCanvas, isTitle: false });
          }
          remainingText = nextRemainingText;
          loopCount++;
        }

        setDesigns(newDesigns);
        setIsLoading(false);
        setIsGeneratingAnimation(false);
      }, 500); // Allow state to clear
    }, 1000); // Lottie animation duration
  }, [text, title, fontSize, activeFont, canvasSize, isBold, textBoxPadding, toast]);

  const handleCanvasReady = (canvas: HTMLCanvasElement, index: number) => {
    setGeneratedCanvases(prev => {
      const newCanvases = [...prev];
      newCanvases[index] = canvas;
      return newCanvases;
    });
  };

  const downloadCanvas = (canvas: HTMLCanvasElement, downloadFileName: string) => {
    const link = document.createElement('a');
    link.download = `${downloadFileName}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleDownload = (index: number) => {
    const canvas = generatedCanvases[index];
    if (canvas) {
      downloadCanvas(canvas, `${fileName}-${index + 1}`);
    } else {
      toast({
        title: "Canvas not ready",
        description: "Please wait for the design to render before downloading.",
        variant: "destructive"
      })
    }
  };

  const handleDownloadAll = () => {
    if (generatedCanvases.length < designs.length) {
      toast({
        title: "Canvases not ready",
        description: "Please wait for all designs to render before downloading all.",
        variant: "destructive"
      });
      return;
    }
    generatedCanvases.forEach((canvas, index) => {
      setTimeout(() => {
        downloadCanvas(canvas, `${fileName}-${index + 1}`);
      }, index * 200); // Stagger downloads
    });
  };

  const getActiveTemplate = (): DesignTemplate => {
    return {
      id: `writa-${Date.now()}`,
      name: "New Favorite",
      category: 'Favorites',
      previewImage: '', 
      background: {
        type: backgroundType,
        value: backgroundType === 'flat' ? bgColor : backgroundType === 'gradient' ? gradientBg : imageBgUrl,
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
        opacity: isOverlayEnabled ? overlayOpacity : 0,
      },
      canvasSize: canvasSize.name,
      effect: activeEffect.id !== 'none' ? { id: activeEffect.id } : undefined,
    };
  };

  const handleSaveDesign = () => {
    const currentDesign = getActiveTemplate();
    const canvas = generatedCanvases[0];
    if (canvas) {
      canvas.toBlob(blob => {
        if(blob) {
          const reader = new FileReader();
          reader.onload = (e) => {
            currentDesign.previewImage = e.target?.result as string;
            setMyDesigns(prev => [...prev, currentDesign]);
            toast({ title: "Favorite Saved!", description: "Your current design has been added to your favorites." });
          }
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg', 0.5)
    } else {
       // Fallback if canvas is not ready, save without preview
      setMyDesigns(prev => [...prev, currentDesign]);
      toast({ title: "Favorite Saved!", description: "Your current design has been added to your favorites." });
    }
  };

  const handleDeleteDesign = (id: string) => {
    setMyDesigns(prev => prev.filter(d => d.id !== id));
    setDesignToDelete(null);
    toast({ title: "Favorite Deleted" });
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingDesignId(id);
    setEditingName(name);
  };

  const handleCancelEdit = () => {
    setEditingDesignId(null);
    setEditingName('');
  };



  const handleUpdateDesign = (id: string) => {
    if (!editingName.trim()) {
      toast({ title: "Name cannot be empty", variant: "destructive" });
      return;
    }
    setMyDesigns(prev => prev.map(d => d.id === id ? { ...d, name: editingName } : d));
    handleCancelEdit();
  };

  const handleLogDesign = () => {
    console.log(JSON.stringify(getActiveTemplate(), null, 2));
    toast({ title: "Design Logged", description: "The current design's configuration has been logged to the console." });
  };

  const handleApplyTemplate = (template: DesignTemplate) => {
    if (template.background.type === 'flat') {
      setBgColor(template.background.value);
      setBackgroundType('flat');
    } else if (template.background.type === 'gradient') {
      setGradientBg(template.background.value);
      setBackgroundType('gradient');
    } else if (template.background.type === 'image') {
      const imgTemplate = imageTemplates.find(it => it.imageUrls.post === template.background.value);
      if (imgTemplate) {
        handleImageBgUrlSelect(imgTemplate);
      } else {
        handleImageSelectFromSearch(template.background.value);
      }
      setBackgroundType('image');
    }

    const newFont = fontOptions.find(f => f.value === template.font.value) || activeFont;
    setActiveFont(newFont);
    setTextColor(template.font.color);
    setFontSize(template.font.fontSize);

    setRectBgColor(template.textBox.color);
    setRectOpacity(template.textBox.opacity);
    setIsTextBoxEnabled(template.textBox.opacity > 0);

    setOverlayColor(template.overlay.color);
    setOverlayOpacity(template.overlay.opacity);
    setIsOverlayEnabled(template.overlay.opacity > 0);
    
    const newCanvasSize = canvasSizes.find(cs => cs.name === template.canvasSize) || canvasSize;
    setCanvasSize(newCanvasSize);

    if (template.effect) {
      const effect = textEffects.find(e => e.id === template.effect!.id) || textEffects[0];
      setActiveEffect(effect);
      if(effect.id !== 'none') {
        setTextShadowEnabled(true);
        setShadows(parseShadow(effect.style.textShadow || ''))
      } else {
        setTextShadowEnabled(false);
      }
    } else {
      setActiveEffect(textEffects[0]);
      setTextShadowEnabled(false);
    }


    toast({ title: `Template "${template.name}" Applied` });
  };


  useEffect(() => {
    const effect = activeEffect;
    if (effect.id !== 'none') {
        const newFont = fontOptions.find(f => f.value === effect.fontValue) || activeFont;
        setActiveFont(newFont);
        setFontSize(typeof effect.style.fontSize === 'number' ? effect.style.fontSize : fontSize);
        setTextShadowEnabled(true);
        setShadows(parseShadow(effect.style.textShadow || ''));
        if (effect.style.color) {
          setTextColor(effect.style.color);
        }
    } else {
        setTextShadowEnabled(false);
    }
  }, [activeEffect, fontSize, setActiveFont]);

  const settingsTabs = [
    { value: 'creative-magic', icon: <LayoutTemplate />, label: 'Creative Magic' },
    { value: 'templates', icon: <LayoutTemplate />, label: 'Templates' },
    { value: 'background', icon: <ImageIcon />, label: 'Background' },
    { value: 'text', icon: <Type />, label: 'Text' },
    { value: 'favorites', icon: <HeartIcon />, label: 'Favorites' },
    { value: 'elements', icon: <Shapes />, label: 'Elements' },
    { value: 'download', icon: <Download />, label: 'Download & Share' },
  ];

  const activeTabLabel = settingsTabs.find(tab => tab.value === activeSettingsTab)?.label;

  const renderActiveTabContent = () => {
    switch (activeSettingsTab) {
      case 'creative-magic': return <CreativeMagicPanel title={title} setTitle={setTitle} text={text} setText={setText} handleGenerate={generateDesigns} isLoading={isLoading} />;
      case 'templates': return <DesignsPanel handleApplyTemplate={handleApplyTemplate} />;
      case 'background': return <BackgroundSettings handleFeelLucky={handleFeelLucky} bgColor={bgColor} handleBgColorSelect={handleBgColorSelect} imageBgUrl={imageBgUrl} handleImageBgUrlSelect={handleImageBgUrlSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchImages={handleSearchImages} isSearching={isSearching} searchedImages={searchedImages} handleKeywordSearch={handleKeywordSearch} searchPage={searchPage} isOverlayEnabled={isOverlayEnabled} setIsOverlayEnabled={setIsOverlayEnabled} overlayColor={overlayColor} setOverlayColor={setOverlayColor} overlayOpacity={overlayOpacity} setOverlayOpacity={setOverlayOpacity} gradientBg={gradientBg} handleGradientBgSelect={handleGradientBgSelect} setSearchCarouselApi={setSearchCarouselApi} />;
      case 'text': return <TextSettings text={text} setText={setText} handleGenerate={generateDesigns} isLoading={isLoading} textColor={textColor} setTextColor={setTextColor} textOpacity={textOpacity} setTextOpacity={setTextOpacity} activeFont={activeFont} setActiveFont={setActiveFont} fontSize={fontSize} setFontSize={setFontSize} fontOptions={fontOptions} isBold={isBold} setIsBold={setIsBold} isUppercase={isUppercase} setIsUppercase={setIsUppercase} textAlign={textAlign} setTextAlign={setTextAlign} textShadowEnabled={textShadowEnabled} setTextShadowEnabled={setTextShadowEnabled} shadows={shadows} setShadows={setShadows} textStroke={textStroke} setTextStroke={setTextStroke} strokeColor={strokeColor} setStrokeColor={setStrokeColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} rectBgColor={rectBgColor} setRectBgColor={setRectBgColor} _rectOpacity={rectOpacity} setRectOpacity={setRectOpacity} isTextBoxEnabled={isTextBoxEnabled} setIsTextBoxEnabled={setIsTextBoxEnabled} activeEffect={activeEffect} setActiveEffect={setActiveEffect} textBoxPadding={textBoxPadding} setTextBoxPadding={setTextBoxPadding} textBoxBorderRadius={textBoxBorderRadius} setTextBoxBorderRadius={setTextBoxBorderRadius} isTextBoxBorderEnabled={isTextBoxBorderEnabled} setIsTextBoxBorderEnabled={setIsTextBoxBorderEnabled} textBoxBorderColor={textBoxBorderColor} setTextBoxBorderColor={setTextBoxBorderColor} textBoxBorderWidth={textBoxBorderWidth} setTextBoxBorderWidth={setTextBoxBorderWidth} />;
      case 'favorites': return <MyDesignsPanel myDesigns={myDesigns} handleSaveDesign={handleSaveDesign} handleDeleteDesign={handleDeleteDesign} handleUpdateDesign={handleUpdateDesign} editingDesignId={editingDesignId} handleEditClick={handleEditClick} _handleCancelEdit={handleCancelEdit} editingName={editingName} setEditingName={setEditingName} designToDelete={designToDelete} setDesignToDelete={setDesignToDelete} handleLogDesign={handleLogDesign} handleApplyTemplate={handleApplyTemplate} />;
      case 'elements': return <ElementsPanel handleImageUpload={handleImageUpload} elements={elements} selectedElement={selectedElement} setSelectedElement={setSelectedElement} updateElement={updateElement} setElements={setElements} areElementsEnabled={areElementsEnabled} setAreElementsEnabled={setAreElementsEnabled} />;
      case 'download': return <DownloadPanel handleDownloadAll={handleDownloadAll} designs={designs} currentSlide={currentSlide} handleDownload={handleDownload} />;
      default: return null;
    }
  }

  const handleDesktopTabClick = (tab: string) => {
    if (activeSettingsTab === tab && isSidebarOpen) {
      setIsSidebarOpen(false);
    } else {
      setActiveSettingsTab(tab);
      setIsSidebarOpen(true);
    }
  }

  if (isGeneratingAnimation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Lottie animationData={webflowAnimation} loop={false} style={{ width: 400, height: 400 }} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <MakeCarouselSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSettingsTab={activeSettingsTab}
        handleDesktopTabClick={handleDesktopTabClick}
        settingsTabs={settingsTabs}
        activeTabLabel={activeTabLabel}
        renderActiveTabContent={renderActiveTabContent}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <header className="flex-shrink-0 h-[5vh] flex items-center justify-between px-4 border-b">
          <div className="flex items-center gap-2">
            {!isSidebarOpen && (
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="md:hidden">
                <PanelLeft className="h-5 w-5" />
              </Button>
            )}
            <Logo className="text-2xl" />
          </div>
          <div className="hidden md:flex items-center justify-center flex-1">
              <div className="flex items-center gap-2">
                  {canvasSizes.map(size => (
                      <TooltipProvider key={size.name}>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                  <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setCanvasSize(size)}
                                      className={cn(canvasSize.name === size.name && "bg-muted")}
                                  >
                                      {size.name === 'Post' && <RectangleVertical className="h-5 w-5" />}
                                      {size.name === 'Story' && <Smartphone className="h-5 w-5" />}
                                      {size.name === 'Square' && <Square className="h-5 w-5" />}
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                  <p>{size.name} ({size.name === 'Post' ? '4:5' : size.name === 'Story' ? '9:16' : '1:1'})</p>
                              </TooltipContent>
                          </Tooltip>
                      </TooltipProvider>
                  ))}
              </div>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="outline">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleDownloadAll()}>Download All</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleDownload(currentSlide)}>Download Current</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center overflow-auto p-4 bg-muted/40 relative">
          {designs.length === 0 ? (
             <div className="w-full max-w-2xl px-4">
              <CreativeMagicPanel title={title} setTitle={setTitle} text={text} setText={setText} handleGenerate={generateDesigns} isLoading={isLoading} />
            </div>
          ) : (
            <div 
              id="designs-container"
              className="w-full h-full flex flex-col items-center justify-start overflow-y-auto"
            >
              <Carousel 
                setApi={setCarouselApi} 
                className="w-full max-w-lg"
                opts={{
                  align: 'center',
                  containScroll: 'keepSnaps',
                }}
              >
                <CarouselContent className="items-start">
                  {designs.map((design, index) => (
                    <CarouselItem key={index} className="flex justify-center">
                      <div
                        className="p-1"
                        style={{
                          width: `${(canvasSize.width / canvasSize.height) * (70 * zoomLevel)}vh`,
                          height: `${70 * zoomLevel}vh`,
                          maxWidth: '90vw',
                          maxHeight: '90vh'
                        }}
                      >
                         <Card className="w-full h-full shadow-lg overflow-hidden">
                           <CardContent className="p-0 h-full w-full relative">
                            {isClient && (
                              <ImageCanvas
                                key={`${canvasSize.name}-${index}`}
                                text={design.text}
                                isTitle={design.isTitle}
                                fontFamily={activeFont.fontFamily}
                                fontWeight={activeFont.weight}
                                fontSize={fontSize}
                                lineHeight={activeFont.lineHeight}
                                backgroundColor={backgroundType === 'flat' ? bgColor : undefined}
                                textColor={textColor}
                                textOpacity={textOpacity}
                                width={canvasSize.width}
                                height={canvasSize.height}
                                onCanvasReady={(canvas) => handleCanvasReady(canvas, index)}
                                backgroundImageUrl={backgroundType === 'image' ? imageBgUrl : undefined}
                                rectColor={rectBgColor}
                                rectOpacity={isTextBoxEnabled ? rectOpacity : 0}
                                textBoxPadding={textBoxPadding}
                                textBoxBorderRadius={textBoxBorderRadius}
                                isTextBoxBorderEnabled={isTextBoxBorderEnabled}
                                textBoxBorderColor={textBoxBorderColor}
                                textBoxBorderWidth={textBoxBorderWidth}
                                overlayColor={isOverlayEnabled ? overlayColor : undefined}
                                overlayOpacity={isOverlayEnabled ? overlayOpacity : undefined}
                                textAlign={textAlign}
                                isBold={isBold}
                                isUppercase={isUppercase}
                                textShadowEnabled={textShadowEnabled}
                                shadows={shadows}
                                textStroke={textStroke}
                                strokeColor={strokeColor}
                                strokeWidth={strokeWidth}
                                elements={elements}
                                areElementsEnabled={areElementsEnabled}
                              />
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              {designs.length > 1 && (
                  <NavBullets api={carouselApi} current={currentSlide} total={designs.length} className="my-4"/>
              )}
            </div>
          )}
           <div className="absolute bottom-4 right-4 flex flex-col gap-2">
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomIn}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Zoom In</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomReset}>
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Reset Zoom</p></TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={handleZoomOut}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Zoom Out</p></TooltipContent>
                </Tooltip>
             </TooltipProvider>
          </div>
        </main>
        
        {isMobile && (
          <div className="flex-shrink-0 border-t bg-background">
            <Tabs value={activeSettingsTab} onValueChange={(v) => { setActiveSettingsTab(v); setIsMobilePanelOpen(true); }} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-16 rounded-none p-0">
                {settingsTabs.filter(t => ['templates', 'background', 'text', 'favorites', 'download'].includes(t.value)).map(tab => (
                  <TabsTrigger key={tab.value} value={tab.value} className="flex-col h-full gap-1 rounded-none text-xs data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                    {tab.icon}
                    <span>{tab.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <Sheet open={isMobilePanelOpen} onOpenChange={setIsMobilePanelOpen}>
              <SheetContent side="bottom" className="h-[85vh]">
                <SheetHeader>
                  <SheetTitle className="capitalize">{activeTabLabel}</SheetTitle>
                </SheetHeader>
                <div className="py-4 h-full overflow-y-auto">
                  {renderActiveTabContent()}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>
    </div>
  );
}
