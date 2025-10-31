
"use client";

import React, { useId } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Search, Upload } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselApi, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { defaultSolidColors, gradientTemplates } from "@/lib/colors";
import { imageTemplates, ImageTemplate } from "@/lib/image-templates";
import Image from "next/image";
import { BgOverlayIcon, FeelLucky } from "@/components/ui/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

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
  uploadedImages: string[];
  handleUploadedImageAsBackground: (imageUrl: string) => void;
  handleCustomImageUpload: (dataUrl: string) => void;
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
  uploadedImages,
  handleUploadedImageAsBackground,
  handleCustomImageUpload
}: BackgroundSettingsProps) {
  const baseId = useId();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        handleCustomImageUpload(dataUrl);
        handleUploadedImageAsBackground(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

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
                  <p>Overlay Settings</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <PopoverContent className="w-64 space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor={`${baseId}-overlay-toggle`}>Image Overlay</Label>
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
          <Carousel className="w-full" opts={{ dragFree: true }}>
            <CarouselContent>
              <CarouselItem className="basis-1/7">
                <div className="relative h-32 w-full">
                  <Label htmlFor={`${baseId}-bg-color-picker`} className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md border" style={{ backgroundColor: bgColor }}>
                    <Plus className="h-8 w-8 text-gray-600" />
                  </Label>
                  <Input
                    id={`${baseId}-bg-color-picker`}
                    type="color"
                    value={bgColor}
                    onChange={(e) => handleBgColorSelect(e.target.value)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </CarouselItem>
              {defaultSolidColors.map(color => (
                <CarouselItem key={color} className="basis-1/7">
                  <Card className="overflow-hidden cursor-pointer" onClick={() => handleBgColorSelect(color)}>
                    <CardContent className="h-32" style={{ backgroundColor: color }} />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </TabsContent>
        <TabsContent value="gradient" className="pt-4 space-y-4">
          <Carousel className="w-full" opts={{ dragFree: true }}>
            <CarouselContent>
              {gradientTemplates.map((gradient) => (
                <CarouselItem key={gradient.name} className="basis-1/4">
                  <Card className="overflow-hidden cursor-pointer" onClick={() => handleGradientBgSelect(gradient.css)}>
                    <CardContent className="h-32" style={{ background: gradient.css }} />
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </TabsContent>
        <TabsContent value="image" className="pt-4 space-y-4">
            <div className="space-y-2">
                <Button onClick={triggerFileSelect} className="w-full" variant="outline">
                    <Upload className="mr-2 h-4 w-4" /> Upload Custom Background
                </Button>
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={onFileChange}
                />
            </div>
            {uploadedImages.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Uploads</Label>
                  <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                    <CarouselContent className="-ml-2">
                      {uploadedImages.map((imageUrl, index) => (
                        <CarouselItem key={index} className="basis-1/4 pl-2">
                          <button onClick={() => handleUploadedImageAsBackground(imageUrl)} className="w-full">
                            <Image src={imageUrl} alt={`Uploaded ${index}`} width={100} height={150} className="object-cover aspect-[2/3] rounded-md w-full" />
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
            )}
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
                      <div onClick={() => handleImageBgUrlSelect({name: `Search Result ${index}`, imageUrls: {post: imageUrl, story: imageUrl, square: imageUrl}})} className="cursor-pointer">
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
