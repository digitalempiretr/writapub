
"use client";

import React, { useId, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, Palette } from "lucide-react";
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
  handleSearchImages: (page?: number) => void;
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
  const [customGradientFrom, setCustomGradientFrom] = useState("#8e2de2");
  const [customGradientTo, setCustomGradientTo] = useState("#4a00e0");
  const [gradientDirection, setGradientDirection] = useState("to top right");
  const [gradientAngle, setGradientAngle] = useState(45);
  const [directionType, setDirectionType] = useState<'preset' | 'angle'>('preset');


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

  const applyCustomGradient = () => {
    const directionValue = directionType === 'angle' ? `${gradientAngle}deg` : gradientDirection;
    const css = `linear-gradient(${directionValue}, ${customGradientFrom}, ${customGradientTo})`;
    handleGradientBgSelect(css);
  };

  const handleDirectionChange = (value: string) => {
    setGradientDirection(value);
    setDirectionType('preset');
  };

  const handleAngleChange = (value: number[]) => {
    setGradientAngle(value[0]);
    setDirectionType('angle');
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
            <div className="relative aspect-[4/5] w-full">
              <Label htmlFor={`${baseId}-bg-color-picker`} className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md border cursor-pointer" style={{ backgroundColor: bgColor }}>
                <Plus className="h-6 w-6 text-gray-500" />
              </Label>
              <Input
                id={`${baseId}-bg-color-picker`}
                type="color"
                value={bgColor}
                onChange={(e) => handleBgColorSelect(e.target.value)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
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
                  <CardContent className="aspect-[4/5] flex items-center justify-center" style={{ background: `linear-gradient(to top right, ${customGradientFrom}, ${customGradientTo})` }}>
                     <Palette className="h-6 w-6 text-white mix-blend-difference" />
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
                <div className="space-y-2">
                  <Label>Direction</Label>
                  <Select value={gradientDirection} onValueChange={handleDirectionChange}>
                      <SelectTrigger>
                          <SelectValue placeholder="Select direction" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="to top">To Top</SelectItem>
                          <SelectItem value="to top right">To Top Right</SelectItem>
                          <SelectItem value="to right">To Right</SelectItem>
                          <SelectItem value="to bottom right">To Bottom Right</SelectItem>
                          <SelectItem value="to bottom">To Bottom</SelectItem>
                          <SelectItem value="to bottom left">To Bottom Left</SelectItem>
                          <SelectItem value="to left">To Left</SelectItem>
                          <SelectItem value="to top left">To Top Left</SelectItem>
                      </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                    <Label>Angle</Label>
                     <div className="flex items-center gap-2">
                        <Slider 
                            value={[gradientAngle]}
                            max={360}
                            step={1}
                            onValueChange={handleAngleChange}
                        />
                        <div className="text-sm p-2 rounded-md border border-input tabular-nums w-20 text-center">
                            {gradientAngle}°
                        </div>
                    </div>
                </div>
                <Button onClick={applyCustomGradient} className="w-full">Apply</Button>
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSearchImages(1)}
                  className="flex-grow"
                />
                <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button onClick={() => handleSearchImages(1)} disabled={isSearching} size="icon" className="h-10 w-10 flex-shrink-0 ml-2">
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
                        <span>Feel Lucky</span>
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
              <Button onClick={() => handleSearchImages(searchPage + 1)} disabled={isSearching} className="w-full">
                {isSearching && searchPage > 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : "More"}
              </Button>
            </>
          )}

        </TabsContent>
      </Tabs>
    </div>
  );
}

