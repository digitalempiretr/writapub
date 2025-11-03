
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { fontOptions, FontOption } from '@/lib/font-options';
import { designTemplates, DesignTemplate } from '@/lib/design-templates';
import { imageTemplates, ImageTemplate } from '@/lib/image-templates';
import { textEffects, TextEffect, parseShadow } from '@/lib/text-effects';
import { gradientTemplates, pageInitialColors } from '@/lib/colors';
import { defaultText } from '@/lib/default-text';

import { ImageCanvas } from '@/components/image-canvas';
import { CreativeMagicPanel } from '@/components/0_creative-magic-panel';
import { DesignsPanel } from '@/components/1_templates';
import { BackgroundSettings } from '@/components/2_background-settings';
import { TextSettings, Shadow } from '@/components/3_text-settings';
import { MyDesignsPanel } from '@/components/4_favorites';
import { ElementsPanel, CanvasElement } from '@/components/5_elements-panel';
import { DownloadPanel } from '@/components/5_download-panel';

import { findImages, FindImagesInput, FindImagesOutput } from '@/ai/flows/find-images-flow';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { cn } from '@/lib/utils';
import { HeartIconG, BookmarkStarIcon } from '@/components/ui/icons';
import { Loader2 } from 'lucide-react';
import Lottie from 'lottie-react';
import animationData from '@/lib/Lottiefiles + Webflow.json';


type CanvasSize = {
  name: 'Post' | 'Story' | 'Square';
  width: number;
  height: number;
};

const canvasSizes: CanvasSize[] = [
  { name: 'Post', width: 1080, height: 1350 },
  { name: 'Story', width: 1080, height: 1920 },
  { name: 'Square', width: 1080, height: 1080 },
];

export default function Home() {
  const { toast } = useToast();

  const [title, setTitle] = useLocalStorage("title", "");
  const [text, setText] = useLocalStorage("text", defaultText);
  const [designs, setDesigns] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [searchCarouselApi, setSearchCarouselApi] = useState<CarouselApi>();

  const [canvasSize, setCanvasSize] = useLocalStorage<CanvasSize>('canvasSize', canvasSizes[0]);
  const [activeFont, setActiveFont] = useLocalStorage<FontOption>('activeFont', fontOptions.find(f => f.value === 'special-elite') || fontOptions[0]);
  const [activeEffect, setActiveEffect] = useLocalStorage<TextEffect>('activeEffect', textEffects[0]);
  
  const [isBold, setIsBold] = useLocalStorage('isBold', false);
  const [isUppercase, setIsUppercase] = useLocalStorage('isUppercase', false);
  const [textAlign, setTextAlign] = useLocalStorage<'left' | 'center' | 'right'>('textAlign', 'left');
  
  const [isOverlayEnabled, setIsOverlayEnabled] = useLocalStorage('isOverlayEnabled', false);
  const [overlayColor, setOverlayColor] = useLocalStorage('overlayColor', pageInitialColors.overlayColor);
  const [overlayOpacity, setOverlayOpacity] = useLocalStorage('overlayOpacity', 0.2);

  const [isTextBoxEnabled, setIsTextBoxEnabled] = useLocalStorage('isTextBoxEnabled', true);
  const [rectBgColor, setRectBgColor] = useLocalStorage('rectBgColor', pageInitialColors.rectBgColor);
  const [rectOpacity, setRectOpacity] = useLocalStorage('rectOpacity', 0.0);

  const [textColor, setTextColor] = useLocalStorage('textColor', pageInitialColors.textColor);
  const [textOpacity, setTextOpacity] = useLocalStorage('textOpacity', 1);

  const [backgroundTab, setBackgroundTab] = useState('flat');
  const [backgroundValue, setBackgroundValue] = useLocalStorage('backgroundValue', pageInitialColors.bgColor);

  const [myDesigns, setMyDesigns] = useLocalStorage<DesignTemplate[]>('myDesigns', []);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  const [fileName, setFileName] = useLocalStorage('fileName', 'writa-design');

  const [textShadowEnabled, setTextShadowEnabled] = useLocalStorage('textShadowEnabled', false);
  const [shadows, setShadows] = useLocalStorage<Shadow[]>('shadows', [
    { id: 1, color: '#000000', offsetX: 2, offsetY: 2, blur: 4, offsetXUnit: 'px', offsetYUnit: 'px', blurUnit: 'px' },
  ]);

  const [textStroke, setTextStroke] = useLocalStorage('textStroke', false);
  const [strokeColor, setStrokeColor] = useLocalStorage('strokeColor', '#ffffff');
  const [strokeWidth, setStrokeWidth] = useLocalStorage('strokeWidth', 1);

  const [elements, setElements] = useLocalStorage<CanvasElement[]>('elements', []);
  const [areElementsEnabled, setAreElementsEnabled] = useLocalStorage('areElementsEnabled', true);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const mainAreaRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startPanPoint, setStartPanPoint] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [pinchState, setPinchState] = useState<{ initialDistance: number, initialZoom: number } | null>(null);

  useEffect(() => {
    if (!carouselApi) return;
    const onSelect = () => setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", onSelect);
    return () => carouselApi.off("select", onSelect);
  }, [carouselApi]);

  const handleApplyTemplate = useCallback((template: DesignTemplate) => {
    setCanvasSize(canvasSizes.find(cs => cs.name === template.canvasSize) || canvasSizes[0]);
    
    if (template.background.type === 'flat') {
      setBackgroundTab('flat');
      setBackgroundValue(template.background.value);
    } else if (template.background.type === 'gradient') {
      setBackgroundTab('gradient');
      setBackgroundValue(template.background.value);
    } else if (template.background.type === 'image') {
      setBackgroundTab('image');
      setBackgroundValue(template.background.value);
    }
    
    const newFont = fontOptions.find(f => f.value === template.font.value) || fontOptions[0];
    const updatedFont = {...newFont, size: template.font.fontSize || newFont.size };
    setActiveFont(updatedFont);

    setRectBgColor(template.textBox.color);
    setRectOpacity(template.textBox.opacity);

    setOverlayColor(template.overlay.color);
    setOverlayOpacity(template.overlay.opacity);
    setIsOverlayEnabled(template.overlay.opacity > 0);
    
    const effectToApply = textEffects.find(e => e.id === template.effect?.id) || textEffects.find(e => e.id === 'none')!;
    setActiveEffect(effectToApply);
    
    setTextColor(template.font.color);

    toast({ title: "Template Applied", description: `"${template.name}" template has been set.` });
  }, [setActiveFont, setRectBgColor, setRectOpacity, setOverlayColor, setOverlayOpacity, setIsOverlayEnabled, setBackgroundValue, setTextColor, setCanvasSize, setActiveEffect, toast]);

  const handleEffectChange = useCallback((effect: TextEffect) => {
    setActiveEffect(effect);
    
    if (effect.style.color) {
      setTextColor(effect.style.color);
    }
    
    if (effect.fontValue) {
      const newFont = fontOptions.find(f => f.value === effect.fontValue) || activeFont;
      const effectFontSize = effect.style.fontSize || newFont.size;
      setActiveFont({...newFont, size: effectFontSize});
    }

    if (effect.style.textShadow && effect.style.textShadow !== 'none') {
        setTextShadowEnabled(true);
        const parsedShadows = parseShadow(effect.style.textShadow);
        if (parsedShadows.length > 0) {
          setShadows(parsedShadows);
        }
    } else {
        setTextShadowEnabled(false);
    }

  }, [setActiveFont, setTextColor, setTextShadowEnabled, setShadows, activeFont]);
  
  const handleGenerate = () => {
    setIsLoading(true);
    setDesigns([]);
    let processedText = text;
    let finalTitle = title;
  
    if (!finalTitle) {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
      finalTitle = sentences[0].trim();
      processedText = sentences.slice(1).join(' ').trim();
      setTitle(finalTitle);
    }
    
    const maxLinesPerSlide = 12;
    const allLines = processedText.split('\n');
    let slides = [];
    let currentSlideLines = [];
  
    for (const line of allLines) {
      if (currentSlideLines.length >= maxLinesPerSlide) {
        slides.push(currentSlideLines.join('\n'));
        currentSlideLines = [line];
      } else {
        currentSlideLines.push(line);
      }
    }
    if (currentSlideLines.length > 0) {
      slides.push(currentSlideLines.join('\n'));
    }
  
    const finalDesigns = [finalTitle, ...slides].map((slideText, index) => ({
      text: slideText,
      isTitle: index === 0,
    }));
  
    setDesigns(finalDesigns);
    setTimeout(() => {
        setIsLoading(false);
        carouselApi?.scrollTo(0);
    }, 500);
  };
  
  const handleSaveDesign = () => {
    const newDesign: DesignTemplate = {
      id: `design-${Date.now()}`,
      name: 'New Favorite',
      category: 'Favorites',
      previewImage: '',
      background: {
        type: backgroundTab as 'flat' | 'gradient' | 'image',
        value: backgroundValue,
      },
      font: {
        value: activeFont.value,
        color: textColor,
        fontSize: typeof activeFont.size === 'string' ? 48 : activeFont.size,
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
      effect: {
        id: activeEffect.id,
      }
    };

    const canvas = document.querySelector(`#canvas-container-0 canvas`) as HTMLCanvasElement;
    if (canvas) {
        newDesign.previewImage = canvas.toDataURL('image/jpeg', 0.5);
    }
    setMyDesigns(prev => [newDesign, ...prev]);
    toast({ title: "Favorite Saved!", description: "Your current design has been saved to your favorites." });
  };

  const handleUpdateDesign = (id: string) => {
    const canvas = document.querySelector(`#canvas-container-${currentSlide} canvas`) as HTMLCanvasElement;
    const previewImage = canvas ? canvas.toDataURL('image/jpeg', 0.5) : '';

    const newDesignData: DesignTemplate = {
        id: editingDesignId!,
        name: editingName,
        category: 'Favorites',
        previewImage: previewImage,
        background: {
          type: backgroundTab as 'flat' | 'gradient' | 'image',
          value: backgroundValue,
        },
        font: {
          value: activeFont.value,
          color: textColor,
          fontSize: typeof activeFont.size === 'string' ? 48 : activeFont.size,
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
        effect: {
          id: activeEffect.id,
        }
    };
    
    setMyDesigns(myDesigns.map(d => d.id === id ? newDesignData : d));
    setEditingDesignId(null);
    toast({ title: "Favorite Updated!", description: `"${editingName}" has been updated.` });
  };
  
  const handleEditClick = (id: string, name: string) => {
    setEditingDesignId(id);
    setEditingName(name);
  };
  
  const handleCancelEdit = () => {
    setEditingDesignId(null);
    setEditingName("");
  };

  const handleDeleteDesign = (id: string) => {
    setMyDesigns(myDesigns.filter(d => d.id !== id));
    setDesignToDelete(null);
    toast({ title: "Favorite Deleted", variant: "destructive" });
  };

  const handleLogDesign = () => {
    const currentDesignState = {
        background: { type: backgroundTab, value: backgroundValue },
        font: { value: activeFont.value, color: textColor, fontSize: activeFont.size },
        textBox: { color: rectBgColor, opacity: rectOpacity },
        overlay: { color: overlayColor, opacity: isOverlayEnabled ? overlayOpacity : 0 },
        canvasSize: canvasSize.name,
        effect: activeEffect ? { id: activeEffect.id } : undefined,
    };
    console.log(JSON.stringify(currentDesignState, null, 2));
    toast({ title: "Design Logged", description: "Current design settings logged to the console." });
  };
  
  const handleDownload = (index: number) => {
    const canvas = document.querySelector(`#canvas-container-${index} canvas`) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${fileName}-${index + 1}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleDownloadAll = () => {
    designs.forEach((_, index) => {
      setTimeout(() => handleDownload(index), index * 200);
    });
  };

  const handleFeelLucky = () => {
    const randomTemplate = designTemplates[Math.floor(Math.random() * designTemplates.length)];
    handleApplyTemplate(randomTemplate);
  };

  const handleSearchImages = async (page = 1) => {
    if (!searchQuery) return;
    setIsSearching(true);
    if (page === 1) {
      setSearchedImages([]);
      setSearchPage(1);
    }
    try {
      const input: FindImagesInput = { query: searchQuery, per_page: 12, page };
      const result: FindImagesOutput = await findImages(input);
      setSearchedImages(prev => (page === 1 ? result.imageUrls : [...prev, ...result.imageUrls]));
      if(page === 1) searchCarouselApi?.scrollTo(0);
      setSearchPage(page);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Image Search Failed",
        description: error.message || "Could not fetch images from Pexels.",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeywordSearch = (keyword: string) => {
    setSearchQuery(keyword);
    handleSearchImages(1);
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
    setElements(prev => prev.map(el => el.id === id ? { ...el, ...newProps } : el));
  };
  
  // Panning and Zooming Logic
  const getMidpoint = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
    };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = zoomLevel - e.deltaY * 0.01;
    setZoomLevel(Math.max(0.1, Math.min(newZoom, 5)));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSpacePressed) {
      e.preventDefault();
      setIsPanning(true);
      setStartPanPoint({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - startPanPoint.x;
      const dy = e.clientY - startPanPoint.y;
      setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setStartPanPoint({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setPinchState({ initialDistance: distance, initialZoom: zoomLevel });

      setIsPanning(true);
      const midpoint = getMidpoint(e.touches);
      setStartPanPoint({ x: midpoint.x, y: midpoint.y });
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && mainAreaRef.current) {
        e.preventDefault();
        
        // Panning
        const midpoint = getMidpoint(e.touches);
        const dx = midpoint.x - startPanPoint.x;
        const dy = midpoint.y - startPanPoint.y;
        setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        setStartPanPoint({ x: midpoint.x, y: midpoint.y });
        
        // Zooming
        if (pinchState) {
            const newDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const zoomFactor = newDistance / pinchState.initialDistance;
            const newZoom = pinchState.initialZoom * zoomFactor;
            setZoomLevel(Math.max(0.1, Math.min(newZoom, 5)));
        }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
        setIsPanning(false);
        setPinchState(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
        setIsPanning(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <>
      <header className="h-[5vh] flex items-center p-4 justify-between"></header>
      <main ref={mainAreaRef}
        className={cn("h-[95vh] w-full flex flex-col items-center justify-center overflow-hidden", isSpacePressed && 'cursor-grab', isPanning && 'cursor-grabbing')}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div 
           className="relative"
           style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            touchAction: 'none'
          }}
        >
          {designs.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full w-full max-w-[1000px] mx-auto">
              <CreativeMagicPanel 
                  title={title}
                  setTitle={setTitle}
                  text={text}
                  setText={setText}
                  handleGenerate={handleGenerate}
                  isLoading={isLoading}
              />
            </div>
          )}

          {isLoading && (
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-64 h-64">
                <Lottie animationData={animationData} loop={true} />
              </div>
              <p className="text-lg text-primary animate-pulse font-serif mt-4">Generating your creative designs...</p>
            </div>
          )}

          {designs.length > 0 && !isLoading && (
              <div className="w-full h-full flex flex-col items-center justify-start gap-4">
                  <Carousel setApi={setCarouselApi} className="w-full max-w-lg md:max-w-xl lg:max-w-2xl">
                      <CarouselContent>
                          {designs.map((design, index) => (
                              <CarouselItem key={index}>
                                  <Card id={`canvas-container-${index}`} className={cn("overflow-hidden border-2 border-gray-300 shadow-lg", canvasSize.name === "Post" ? "aspect-[4/5]" : canvasSize.name === "Story" ? "aspect-[9/16]" : "aspect-square")}>
                                      <CardContent className="p-0 h-full w-full">
                                      <ImageCanvas
                                          text={design.text}
                                          isTitle={design.isTitle}
                                          fontFamily={activeFont.fontFamily}
                                          fontWeight={activeFont.weight}
                                          fontSize={activeFont.size}
                                          lineHeight={activeFont.lineHeight}
                                          textColor={textColor}
                                          textOpacity={textOpacity}
                                          backgroundColor={backgroundTab === 'flat' || backgroundTab === 'gradient' ? backgroundValue : undefined}
                                          backgroundImageUrl={backgroundTab === 'image' ? backgroundValue : undefined}
                                          width={canvasSize.width}
                                          height={canvasSize.height}
                                          onCanvasReady={(canvas) => {
                                            const dataUrl = canvas.toDataURL('image/png');
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
                                          fontSmoothing={{ WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' }}
                                          elements={elements}
                                          areElementsEnabled={areElementsEnabled}
                                      />
                                      </CardContent>
                                  </Card>
                              </CarouselItem>
                          ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-4 md:-left-12" />
                      <CarouselNext className="-right-4 md:-right-12" />
                  </Carousel>
              </div>
          )}
        </div>
      </main>

      {designs.length > 0 && !isLoading && (
        <div className="fixed bottom-0 md:bottom-auto md:top-1/2 md:right-4 md:-translate-y-1/2 w-full md:w-96 bg-card/80 backdrop-blur-sm border-t md:border md:rounded-lg shadow-lg z-20">
          <Tabs defaultValue="creative-magic" className="w-full">
            <TabsList className="grid w-full grid-cols-6 h-14 md:h-auto">
              <TabsTrigger value="creative-magic" className="h-full md:h-auto"><BookmarkStarIcon /></TabsTrigger>
              <TabsTrigger value="templates" className="h-full md:h-auto"><HeartIconG /></TabsTrigger>
              <TabsTrigger value="background" className="h-full md:h-auto"><BookmarkStarIcon /></TabsTrigger>
              <TabsTrigger value="text" className="h-full md:h-auto"><BookmarkStarIcon /></TabsTrigger>
              <TabsTrigger value="elements" className="h-full md:h-auto"><BookmarkStarIcon /></TabsTrigger>
              <TabsTrigger value="download" className="h-full md:h-auto"><BookmarkStarIcon /></TabsTrigger>
            </TabsList>
            <TabsContent value="creative-magic"><MyDesignsPanel myDesigns={myDesigns} handleSaveDesign={handleSaveDesign} handleDeleteDesign={handleDeleteDesign} handleUpdateDesign={handleUpdateDesign} editingDesignId={editingDesignId} handleEditClick={handleEditClick} handleCancelEdit={handleCancelEdit} editingName={editingName} setEditingName={setEditingName} designToDelete={designToDelete} setDesignToDelete={setDesignToDelete} handleLogDesign={handleLogDesign} handleApplyTemplate={handleApplyTemplate} /></TabsContent>
            <TabsContent value="templates"><DesignsPanel handleApplyTemplate={handleApplyTemplate} /></TabsContent>
            <TabsContent value="background"><BackgroundSettings backgroundTab={backgroundTab} setBackgroundTab={setBackgroundTab} handleFeelLucky={handleFeelLucky} bgColor={backgroundTab === 'flat' ? backgroundValue : '#ffffff'} handleBgColorSelect={(color) => { setBackgroundTab('flat'); setBackgroundValue(color);}} imageBgUrl={backgroundTab === 'image' ? backgroundValue : ''} handleImageBgUrlSelect={(template) => { setBackgroundTab('image'); setBackgroundValue(template.imageUrls[canvasSize.name.toLowerCase() as keyof typeof template.imageUrls]);}} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchImages={handleSearchImages} isSearching={isSearching} searchedImages={searchedImages} handleKeywordSearch={handleKeywordSearch} searchPage={searchPage} isOverlayEnabled={isOverlayEnabled} setIsOverlayEnabled={setIsOverlayEnabled} overlayColor={overlayColor} setOverlayColor={setOverlayColor} overlayOpacity={overlayOpacity} setOverlayOpacity={setOverlayOpacity} gradientBg={backgroundTab === 'gradient' ? backgroundValue : ''} handleGradientBgSelect={(css) => { setBackgroundTab('gradient'); setBackgroundValue(css); }} setSearchCarouselApi={setSearchCarouselApi} /></TabsContent>
            <TabsContent value="text"><TextSettings text={designs[currentSlide]?.text || text} setText={(newText) => { const newDesigns = [...designs]; newDesigns[currentSlide].text = newText; setDesigns(newDesigns);}} handleGenerate={handleGenerate} isLoading={isLoading} textColor={textColor} setTextColor={setTextColor} textOpacity={textOpacity} setTextOpacity={setTextOpacity} activeFont={activeFont} setActiveFont={setActiveFont} fontOptions={fontOptions} isBold={isBold} setIsBold={setIsBold} isUppercase={isUppercase} setIsUppercase={setIsUppercase} textAlign={textAlign} setTextAlign={setTextAlign} textShadowEnabled={textShadowEnabled} setTextShadowEnabled={setTextShadowEnabled} shadows={shadows} setShadows={setShadows} textStroke={textStroke} setTextStroke={setTextStroke} strokeColor={strokeColor} setStrokeColor={setStrokeColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} rectBgColor={rectBgColor} setRectBgColor={setRectBgColor} rectOpacity={rectOpacity} setRectOpacity={setRectOpacity} isTextBoxEnabled={isTextBoxEnabled} setIsTextBoxEnabled={setIsTextBoxEnabled} activeEffect={activeEffect} setActiveEffect={handleEffectChange} /></TabsContent>
            <TabsContent value="elements"><ElementsPanel handleImageUpload={handleImageUpload} elements={elements} setElements={setElements} selectedElement={selectedElement} setSelectedElement={setSelectedElement} updateElement={updateElement} areElementsEnabled={areElementsEnabled} setAreElementsEnabled={setAreElementsEnabled} /></TabsContent>
            <TabsContent value="download"><DownloadPanel fileName={fileName} setFileName={setFileName} handleDownloadAll={handleDownloadAll} designs={designs} currentSlide={currentSlide} handleDownload={handleDownload} /></TabsContent>
          </Tabs>
        </div>
      )}
    </>
  );
}

    