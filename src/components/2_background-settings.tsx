
"use client";

import React, { useId, useState, useEffect, useRef, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, Palette, RotateCcw, Trash2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { defaultSolidColors, gradientTemplates } from "@/lib/colors";
import { imageTemplates, ImageTemplate } from "@/lib/image-templates";
import Image from "next/image";
import { BgOverlayIcon, FeelLucky } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const searchKeywords = ["Texture", "Background", "Wallpaper", "Nature", "Sea", "Art", "Minimal", "Abstract", "Dreamy", "Cinematic", "Surreal", "Vintage", "Futuristic", "Bohemian"];

type GradientStop = {
  id: number;
  color: string;
  stop: number;
};

type BackgroundType = 'flat' | 'gradient' | 'image';

type BackgroundSettingsProps = {
  backgroundTab: string;
  setBackgroundTab: (value: BackgroundType) => void;
  handleFeelLucky: () => void;
  bgColor: string;
  handleBgColorSelect: (color: string) => void;
  imageBgUrl: string;
  handleImageBgUrlSelect: (template: ImageTemplate) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchImages: (query: string, page?: number) => void;
  isSearching: boolean;
  searchedImages: string[];
  handleKeywordSearch: (keyword: string) => void;
  searchPage: number;
  isOverlayEnabled: boolean;
  setIsOverlayEnabled: (enabled: boolean) => void;
  overlayColor: string;
  setOverlayColor: (color: string) => void;
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  gradientBg: string;
  handleGradientBgSelect: (css: string) => void;
  setSearchCarouselApi: (api: CarouselApi | undefined) => void;
};


function hexToRgba(hex: string, alpha: number) {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function BackgroundSettings({
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
  handleGradientBgSelect: applyGradientToCanvas,
  setSearchCarouselApi,
}: BackgroundSettingsProps) {
  const baseId = useId();
  const [customGradientStops, setCustomGradientStops] = useState<GradientStop[]>([
    { id: 1, color: "#eeaecc", stop: 0 },
    { id: 2, color: "#94bbe9", stop: 100 },
  ]);
  const [activeStopId, setActiveStopId] = useState<number | null>(customGradientStops[0]?.id ?? null);

  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState(90);

  const angleSelectorRef = useRef<HTMLDivElement>(null);
  const gradientBarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const draggingStopId = useRef<number | null>(null);

  const parseAndSetGradient = (css: string) => {
    try {
      const typeMatch = css.match(/^(linear|radial)-gradient/);
      const newType = (typeMatch ? typeMatch[1] : 'linear') as 'linear' | 'radial';
      setGradientType(newType);

      const content = css.substring(css.indexOf('(') + 1, css.lastIndexOf(')'));
      
      let angle = 90; // Default angle
      let stopsContent = content;

      if (newType === 'linear') {
        const angleMatch = content.match(/^(to\s+[\w\s]+|[\d.-]+deg),/);
        if (angleMatch) {
          const angleStr = angleMatch[1].trim();
          stopsContent = content.substring(angleMatch[0].length).trim();
          
          if (angleStr.includes('deg')) {
            angle = parseFloat(angleStr);
          } else {
            const directions: { [key: string]: number } = {
              'to top': 0, 'to top right': 45, 'to right': 90, 'to bottom right': 135,
              'to bottom': 180, 'to bottom left': 225, 'to left': 270, 'to top left': 315
            };
            angle = directions[angleStr] || 90;
          }
        }
      }
      setGradientAngle(angle);

      const stopRegex = /(rgba?\(.+?\)|#([0-9a-fA-F]{3,6}))\s+(\d{1,3}(?:\.\d+)?)%/g;
      let match;
      const newStops: GradientStop[] = [];
      let lastStop = -1;
      while ((match = stopRegex.exec(stopsContent)) !== null) {
        newStops.push({
          id: Date.now() + Math.random(),
          color: match[1],
          stop: parseFloat(match[3])
        });
        lastStop = parseFloat(match[3]);
      }
      if (newStops.length > 0) {
        setCustomGradientStops(newStops);
        if (newStops.length > 0) {
          setActiveStopId(newStops[0].id);
        }
      }
    } catch(e) {
      console.error("Failed to parse gradient string", e);
    }
  };

  const handleGradientBgSelect = (css: string) => {
    applyGradientToCanvas(css);
    parseAndSetGradient(css);
  };
  
  const generateGradientCss = useCallback(() => {
    const sortedStops = [...customGradientStops].sort((a, b) => a.stop - b.stop);
    const colorStopsString = sortedStops.map(s => `${s.color} ${s.stop}%`).join(', ');

    if (gradientType === 'linear') {
      return `linear-gradient(${gradientAngle}deg, ${colorStopsString})`;
    } else {
      return `radial-gradient(circle, ${colorStopsString})`;
    }
  }, [customGradientStops, gradientType, gradientAngle]);

  useEffect(() => {
    const newCss = generateGradientCss();
    applyGradientToCanvas(newCss);
  }, [customGradientStops, gradientType, gradientAngle, generateGradientCss, applyGradientToCanvas]);


  const gradientSliderBg = React.useMemo(() => generateGradientCss(), [generateGradientCss]);
  
  const handleAngleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!angleSelectorRef.current) return;
    const rect = angleSelectorRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    let angleDeg = Math.round((angleRad * 180) / Math.PI) + 90;
    setGradientAngle((angleDeg + 360) % 360);
  }, []);

  const handleAngleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const handleMouseMove = (event: MouseEvent) => {
      handleAngleInteraction(event.clientX, event.clientY);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleAngleInteraction]);

  const handleAngleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
      const handleTouchMove = (event: TouchEvent) => {
        if (event.touches[0]) {
          handleAngleInteraction(event.touches[0].clientX, event.touches[0].clientY);
        }
      };

      const handleTouchEnd = () => {
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
  }, [handleAngleInteraction]);

  const handleImageSelectFromSearch = (imageUrl: string) => {
    handleImageBgUrlSelect({
      name: `Search Result`,
      imageUrls: {
        post: imageUrl,
        story: imageUrl,
        square: imageUrl,
      },
    });
  };
  
  const handleAngleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
        setGradientAngle(0);
        return;
    }
    const angle = parseInt(value, 10);
    if (!isNaN(angle) && angle >= 0 && angle <= 360) {
        setGradientAngle(angle);
    }
  };

  const handleAngleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      if (e.target.value === '') {
          setGradientAngle(0);
      }
  };

  const activeStop = customGradientStops.find(s => s.id === activeStopId);

  const updateActiveStop = useCallback((newProps: Partial<GradientStop>) => {
    if (!activeStopId) return;
    setCustomGradientStops(stops =>
      stops.map(s => (s.id === activeStopId ? { ...s, ...newProps } : s))
    );
  }, [activeStopId]);
  
  const addStop = (e: React.MouseEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('[data-stop-handle="true"]')) {
          return;
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const stop = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      
      const newStop: GradientStop = {
          id: Date.now(),
          color: '#ffffff',
          stop: Math.max(0, Math.min(100, stop)),
      };

      setCustomGradientStops(stops => [...stops, newStop].sort((a,b) => a.stop - b.stop));
      setActiveStopId(newStop.id);
  };

  const removeActiveStop = () => {
    if (activeStopId && customGradientStops.length > 2) {
      setCustomGradientStops(stops => stops.filter(s => s.id !== activeStopId));
      const newActiveIndex = Math.max(0, customGradientStops.findIndex(s => s.id !== activeStopId));
      setActiveStopId(customGradientStops[newActiveIndex]?.id || null);
    }
  };
  
  const handleStopDrag = useCallback((id: number, e: React.MouseEvent | React.TouchEvent) => {
    draggingStopId.current = id;
    setActiveStopId(id);
    e.stopPropagation();

    const onMouseMove = (moveEvent: MouseEvent | TouchEvent) => {
        if (draggingStopId.current !== id) return;

        const currentX = 'touches' in moveEvent ? moveEvent.touches[0].clientX : moveEvent.clientX;
        const gradientBar = gradientBarRef.current;
        if (!gradientBar) return;
        
        const rect = gradientBar.getBoundingClientRect();
        const newStop = Math.round(((currentX - rect.left) / rect.width) * 100);
        const clampedStop = Math.max(0, Math.min(100, newStop));

        setCustomGradientStops(stops =>
            stops.map(s => (s.id === id ? { ...s, stop: clampedStop } : s))
        );
    };

    const onMouseUp = () => {
      draggingStopId.current = null;
      document.removeEventListener('mousemove', onMouseMove as any);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('touchmove', onMouseMove as any);
      document.removeEventListener('touchend', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove as any);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('touchmove', onMouseMove as any);
    document.addEventListener('touchend', onMouseUp);

  }, []);


  const overlayContent = (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor={`${baseId}-overlay-toggle`}>Background Overlay</Label>
        <Switch
          id={`${baseId}-overlay-toggle`}
          checked={isOverlayEnabled}
          onCheckedChange={setIsOverlayEnabled}
        />
      </div>
      {isOverlayEnabled && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Color</Label>
            <Input
              type="color"
              value={overlayColor}
              onChange={(e) => setOverlayColor(e.target.value)}
              className="h-8 p-1"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${baseId}-overlay-opacity-slider`}>Opacity</Label>
            <div className="flex items-center gap-2">
              <Slider
                id={`${baseId}-overlay-opacity-slider`}
                max={1}
                min={0}
                step={0.01}
                value={[overlayOpacity]}
                onValueChange={(value) => setOverlayOpacity(value[0])}
              />
              <div className="text-sm p-2 rounded-md border border-input tabular-nums w-14 text-center">
                {Math.round(overlayOpacity * 100)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const customGradientEditorContent = (
    <div className="w-full space-y-4">
      <div className="space-y-3">
        <Label>Custom Gradient</Label>
         <div 
          ref={gradientBarRef}
          className="relative h-6 w-full rounded-full border-2 border-transparent cursor-pointer"
          onMouseDown={addStop} 
          style={{background: gradientSliderBg}}
         >
          {customGradientStops.map(s => (
             <div 
               key={s.id}
               data-stop-handle="true"
               className={cn(
                 "absolute top-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 rounded-full border-2 cursor-pointer",
                 activeStopId === s.id ? 'border-primary ring-2 ring-primary ring-offset-2 bg-background' : 'border-background'
               )}
               style={{ left: `${s.stop}%`, backgroundColor: s.color }}
               onMouseDown={(e) => handleStopDrag(s.id, e)}
               onTouchStart={(e) => handleStopDrag(s.id, e)}
             />
          ))}
         </div>
      </div>

      {activeStop && (
         <div className="space-y-4 p-3 border rounded-md">
           <div className="flex items-center justify-between">
             <Label className="text-sm">Edit Stop</Label>
             <Button 
               variant="ghost" 
               size="icon" 
               className="h-6 w-6" 
               onClick={removeActiveStop}
               disabled={customGradientStops.length <= 2}
             >
               <Trash2 className="h-4 w-4 text-destructive"/>
             </Button>
           </div>
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label className="text-xs">Color</Label>
                <Input type="color" value={activeStop.color} onChange={(e) => updateActiveStop({ color: e.target.value })} className="w-full h-8 p-1"/>
            </div>
            <div className="space-y-2">
                <Label className="text-xs">Position</Label>
                <Input type="number" value={activeStop.stop} min={0} max={100} onChange={(e) => updateActiveStop({ stop: Number(e.target.value) })} className="w-full h-8 p-1"/>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2">
        <RadioGroup value={gradientType} onValueChange={(v: 'linear' | 'radial') => setGradientType(v)} className="grid grid-cols-2 gap-0 border rounded-md p-0.5">
          <div>
            <RadioGroupItem value="linear" id="linear" className="sr-only" />
            <Label htmlFor="linear" className={cn("block text-center text-sm px-4 py-1.5 rounded-sm cursor-pointer", gradientType === 'linear' && "bg-muted")}>Linear</Label>
          </div>
          <div>
            <RadioGroupItem value="radial" id="radial" className="sr-only" />
            <Label htmlFor="radial" className={cn("block text-center text-sm px-4 py-1.5 rounded-sm cursor-pointer", gradientType === 'radial' && "bg-muted")}>Radial</Label>
          </div>
        </RadioGroup>
        {gradientType === 'linear' && (
           <div className="flex items-center gap-2">
              <div
                ref={angleSelectorRef}
                onMouseDown={handleAngleMouseDown}
                onTouchStart={handleAngleTouchStart}
                className="relative h-10 w-10 border rounded-full flex items-center justify-center cursor-pointer"
                style={{ touchAction: 'none' }}
              >
                <div
                  className="w-2.5 h-2.5 bg-primary rounded-full absolute"
                  style={{
                    transform: `rotate(${gradientAngle}deg) translateY(-12px)`,
                  }}
                />
              </div>
              <Input
                  type="number"
                  value={gradientAngle}
                  onChange={handleAngleInputChange}
                  onBlur={handleAngleInputBlur}
                  className="text-sm p-2 rounded-md border border-input tabular-nums w-20 text-center"
                  min="0"
                  max="360"
              />
            </div>
        )}
      </div>
    </div>
  );


  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <Tabs value={backgroundTab} onValueChange={(value) => setBackgroundTab(value as BackgroundType)} className="w-full">
        <div className="flex items-center gap-2">
          <TabsList className="grid flex-grow grid-cols-3 font-sans">
            <TabsTrigger value="flat">Solid Color</TabsTrigger>
            <TabsTrigger value="gradient">Gradient</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
           {isMobile ? (
            <Dialog>
              <DialogTrigger asChild>
                 <Button variant="outline" size="icon">
                     <BgOverlayIcon color={isOverlayEnabled ? overlayColor : '#999'} />
                  </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Background Overlay</DialogTitle>
                </DialogHeader>
                {overlayContent}
              </DialogContent>
            </Dialog>
           ) : (
            <Popover>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                         <BgOverlayIcon color={isOverlayEnabled ? overlayColor : '#999'} />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Background Overlay</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <PopoverContent className="w-64 space-y-4">
                {overlayContent}
              </PopoverContent>
            </Popover>
           )}
        </div>
        <TabsContent value="flat" className="pt-4 space-y-4">
           <div className="grid grid-cols-6 gap-2">
            <Card className="overflow-hidden cursor-pointer relative">
              <CardContent className="p-0 aspect-[4/5] flex items-center justify-center bg-gray-100">
                <Label htmlFor={`${baseId}-bg-color-picker`} className="h-full w-full flex items-center justify-center cursor-pointer">
                  <Plus className="h-6 w-6 text-gray-500" strokeWidth={3}/>
                </Label>
                <Input
                  id={`${baseId}-bg-color-picker`}
                  type="color"
                  value={bgColor}
                  onChange={(e) => handleBgColorSelect(e.target.value)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </CardContent>
            </Card>
            {defaultSolidColors.map(color => (
              <Card key={color} className="overflow-hidden cursor-pointer" onClick={() => handleBgColorSelect(color)}>
                <CardContent className="p-0 aspect-[4/5]" style={{ backgroundColor: color }} />
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="gradient" className="pt-4 space-y-4">
           <div className="grid grid-cols-6 gap-2">
           
            {isMobile ? (
              <Dialog>
                <DialogTrigger asChild>
                   <Card className="overflow-hidden cursor-pointer">
                    <CardContent className="aspect-[4/5] flex items-center justify-center bg-gray-100 p-0">
                    <h2 className="text-gray-500 text-3xl bold">+</h2>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Custom Gradient</DialogTitle>
                  </DialogHeader>
                  {customGradientEditorContent}
                </DialogContent>
              </Dialog>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <Card className="overflow-hidden cursor-pointer">
                    <CardContent className="aspect-[4/5] flex items-center justify-center bg-gray-100 p-0">
                    <p className="text-gray-500 text-3xl bold">+</p>
                    </CardContent>
                  </Card>
                </PopoverTrigger>
                <PopoverContent className="w-80 space-y-4">
                  {customGradientEditorContent}
                </PopoverContent>
              </Popover>
            )}

            {gradientTemplates.map((gradient) => (
              <Card key={gradient.name} className="overflow-hidden cursor-pointer" onClick={() => handleGradientBgSelect(gradient.css)}>
                <CardContent className="aspect-[4/5]" style={{ background: gradient.css }} />
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="image" className="pt-4 space-y-4">
          <div className="space-y-2">
            <Label>Ready-made Images</Label>
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {imageTemplates.map((template) => (
                  <CarouselItem key={template.name} className="basis-1/4 pl-2">
                    <button onClick={() => handleImageBgUrlSelect(template)} className="w-full">
                      <Image src={template.imageUrls.post} alt={template.name} width={100} height={150} className="object-cover aspect-[2/3] rounded-md w-full" />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
          <div className="space-y-2">
            <Label>Find New Background</Label>
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {searchKeywords.map((keyword) => (
                  <CarouselItem key={keyword} className="basis-auto pl-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleKeywordSearch(keyword)}
                    >
                      {keyword}
                    </Button>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="flex items-center">
                <Label htmlFor={`${baseId}-search-input`} className="sr-only">Search for images</Label>
                <Input
                  id={`${baseId}-search-input`}
                  name="search-input"
                  type="text"
                  placeholder="Search for images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchImages(searchQuery, 1)}
                  className="flex-grow"
                />
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button onClick={() => handleSearchImages(searchQuery, 1)} disabled={isSearching} size="icon" className="h-10 w-10 flex-shrink-0 ml-2">
                        {isSearching && searchPage === 1 ? (
                        <Loader2 className="h-6 w-6 animate-spin" />
                        ) : (
                        <Search className="h-6 w-6" />
                        )}
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Search Images</p>
                    </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button onClick={handleFeelLucky} variant="outline" className="h-10 ml-2">
                        <FeelLucky />
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Feel Lucky</p>
                    </TooltipContent>
                </Tooltip>
                </TooltipProvider>
            </div>
          </div>

          {searchedImages.length > 0 && (
            <>
              <Carousel
                opts={{
                  align: "start",
                  dragFree: true,
                }}
                className="w-full"
                setApi={setSearchCarouselApi}
              >
                <CarouselContent className="-ml-2">
                  {searchedImages.map((imageUrl, index) => (
                    <CarouselItem key={index} className="basis-1/4">
                      <div onClick={() => handleImageSelectFromSearch(imageUrl)} className="cursor-pointer">
                        <Image src={imageUrl} alt={`Search Result ${index}`} width={200} height={250} className="object-cover aspect-[2/3] rounded-md" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
              <Button onClick={() => handleSearchImages(searchQuery, searchPage + 1)} disabled={isSearching} className="w-full">
                {isSearching && searchPage > 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : "More"}
              </Button>
            </>
          )}

        </TabsContent>
      </Tabs>
    </div>
  );
}


    
    





    

