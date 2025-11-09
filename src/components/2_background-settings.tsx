
"use client";

import React, { useId, useState, useEffect, useRef, useCallback } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, Palette, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { defaultSolidColors, gradientTemplates } from "@/lib/colors";
import { imageTemplates, ImageTemplate } from "@/lib/image-templates";
import Image from "next/image";
import { BgOverlayIcon, FeelLucky } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { cn } from "@/lib/utils";

const searchKeywords = ["Texture", "Background", "Wallpaper", "Nature", "Sea", "Art", "Minimal", "Abstract", "Dreamy", "Cinematic", "Surreal", "Vintage", "Futuristic", "Bohemian"];

type BackgroundSettingsProps = {
  backgroundTab: string;
  setBackgroundTab: (value: string) => void;
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
  handleGradientBgSelect,
  setSearchCarouselApi,
}: BackgroundSettingsProps) {
  const baseId = useId();
  const [customGradientFrom, setCustomGradientFrom] = useState("#eeaecc");
  const [customGradientTo, setCustomGradientTo] = useState("#94bbe9");
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientAngle, setGradientAngle] = useState(82);

  const angleSelectorRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);

  const applyCustomGradient = useCallback(() => {
    let css = '';
    const fromRgba = hexToRgba(customGradientFrom, 1);
    const toRgba = hexToRgba(customGradientTo, 1);
    if (gradientType === 'linear') {
      css = `linear-gradient(${gradientAngle}deg, ${fromRgba} 0%, ${toRgba} 100%)`;
    } else {
      css = `radial-gradient(circle, ${fromRgba} 0%, ${toRgba} 100%)`;
    }
    handleGradientBgSelect(css);
  }, [customGradientFrom, customGradientTo, gradientType, gradientAngle, handleGradientBgSelect]);
  
  const handleAngleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!angleSelectorRef.current) return;
    const rect = angleSelectorRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
    // Add 90 degrees to make the top the 0 point
    const angleDeg = Math.round((angleRad * 180) / Math.PI) + 90;
    // Normalize to 0-360 range
    setGradientAngle((angleDeg + 360) % 360);
  }, []);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    e.preventDefault();

    const handleMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current) {
        handleAngleInteraction(event.clientX, event.clientY);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [handleAngleInteraction]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if(e.touches[0]) {
      isDraggingRef.current = true;
      
      const handleTouchMove = (event: TouchEvent) => {
        if (isDraggingRef.current && event.touches[0]) {
          handleAngleInteraction(event.touches[0].clientX, event.touches[0].clientY);
        }
      };

      const handleTouchEnd = () => {
        isDraggingRef.current = false;
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove);
      document.addEventListener('touchend', handleTouchEnd);
    }
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

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <Tabs value={backgroundTab} onValueChange={setBackgroundTab} className="w-full">
        <div className="flex items-center gap-2">
          <TabsList className="grid flex-grow grid-cols-3 font-sans">
            <TabsTrigger value="flat">Solid Color</TabsTrigger>
            <TabsTrigger value="gradient">Gradient</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>
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
            </PopoverContent>
          </Popover>
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
           
             <Popover>
              <PopoverTrigger asChild>
                <Card className="overflow-hidden cursor-pointer">
                  <CardContent className="aspect-[4/5] flex items-center justify-center bg-gray-100">
                     <Plus className="h-6 w-6 text-gray-500" strokeWidth={3} />
                  </CardContent>
                </Card>
              </PopoverTrigger>
              <PopoverContent className="w-80 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>From</Label>
                        <Input type="color" value={customGradientFrom} onChange={(e) => setCustomGradientFrom(e.target.value)} className="w-full h-8 p-1"/>
                    </div>
                    <div className="space-y-2">
                        <Label>To</Label>
                        <Input type="color" value={customGradientTo} onChange={(e) => setCustomGradientTo(e.target.value)} className="w-full h-8 p-1"/>
                    </div>
                </div>

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
                          onMouseDown={handleMouseDown}
                          onTouchStart={handleTouchStart}
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
                 <Button onClick={applyCustomGradient} className="w-full">Apply Custom Gradient</Button>
              </PopoverContent>
            </Popover>
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

    

    
