
"use client";

import { findImages } from "@/ai/flows/find-images-flow";
import { ImageCanvas, type FontOption } from "@/components/image-canvas";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlignCenter, AlignLeft, AlignRight, ArrowUp, Download, ImageIcon, LayoutTemplate, Loader2, Plus, Search, Star, Trash2, Type, FilePenLine, Check, X } from "lucide-react";
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState, useId } from "react";
import { CardTitle } from "@/components/ui/card";
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { imageTemplates } from "@/lib/image-templates";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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

import { gradientTemplates, defaultSolidColors, pageInitialColors } from "@/lib/colors";
import { fontOptions } from "@/lib/font-options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { defaultText } from "@/lib/default-text";
import { TextColorChooseIcon, BgOverlayIcon, TextBgBoxIcon, TextBoxOpacity, FeelLucky } from '@/components/ui/icons';
import { designTemplates, DesignTemplate } from "@/lib/design-templates";
import { useLocalStorage } from "@/hooks/use-local-storage";

type Design = {
  text: string;
  isTitle: boolean;
};

type TextAlign = 'left' | 'center' | 'right';

const searchKeywords = ["Texture", "Background", "Wallpaper", "Nature", "Sea", "Art", "Minimal", "Abstract"];

function TabContentContainer({
  activeTab,
  backgroundTab,
  setBackgroundTab,
  handleFeelLucky,
  bgColor,
  setBgColor,
  imageBgUrl,
  setImageBgUrl,
  searchQuery,
  setSearchQuery,
  handleSearchImages,
  isSearching,
  searchedImages,
  handleKeywordSearch,
  searchPage,
  overlayColor,
  setOverlayColor,
  overlayOpacity,
  setOverlayOpacity,
  textColor,
  setTextColor,
  activeFont,
  handleFontChange,
  textAlign,
  setTextAlign,
  rectBgColor,
  setRectBgColor,
  handleRectBgChange,
  rectOpacity,
  setRectOpacity,
  designs,
  handleDownloadAll,
  currentSlide,
  handleDownload,
  gradientBg,
  setGradientBg,
  setSearchCarouselApi,
  fileName,
  setFileName,
  handleApplyTemplate,
  myDesigns,
  handleSaveDesign,
  handleDeleteDesign,
  handleUpdateDesign,
  editingDesignId,
  handleEditClick,
  handleCancelEdit,
  editingName,
  setEditingName,
}: {
  activeTab: string;
  backgroundTab: string;
  setBackgroundTab: (value: string) => void;
  handleFeelLucky: () => void;
  bgColor: string;
  setBgColor: (value: string) => void;
  imageBgUrl: string;
  setImageBgUrl: (url: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchImages: (page?: number) => void;
  isSearching: boolean;
  searchedImages: string[];
  handleKeywordSearch: (keyword: string) => void;
  searchPage: number;
  overlayColor: string;
  setOverlayColor: (color: string) => void;
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  activeFont: FontOption;
  handleFontChange: (value: string) => void;
  textAlign: TextAlign;
  setTextAlign: (align: TextAlign) => void;
  rectBgColor: string;
  setRectBgColor: (color: string) => void;
  handleRectBgChange: (color: string) => void;
  rectOpacity: number;
  setRectOpacity: (opacity: number) => void;
  designs: Design[];
  handleDownloadAll: () => void;
  currentSlide: number;
  handleDownload: (index: number) => void;
  gradientBg: string;
  setGradientBg: (css: string) => void;
  setSearchCarouselApi: (api: CarouselApi | undefined) => void;
  fileName: string;
  setFileName: (name: string) => void;
  handleApplyTemplate: (template: DesignTemplate) => void;
  myDesigns: DesignTemplate[];
  handleSaveDesign: () => void;
  handleDeleteDesign: (id: string) => void;
  handleUpdateDesign: (id: string) => void;
  editingDesignId: string | null;
  handleEditClick: (id: string, name: string) => void;
  handleCancelEdit: () => void;
  editingName: string;
  setEditingName: (name: string) => void;
}) {
  const baseId = useId();
  return (
    <>
      {activeTab === 'designs' && (
        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
          <Label className="bg-zinc-200 p-2 px-6 rounded-md">DESIGN TEMPLATES</Label>
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {designTemplates.map((template) => (
                <CarouselItem key={template.name} className="basis-1/2 md:basis-1/4 pl-2">
                  <button onClick={() => handleApplyTemplate(template)} className="w-full group">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                         <Image src={template.previewImage} alt={template.name} width={200} height={250} className="object-cover aspect-[2/3] w-full transition-transform duration-300 group-hover:scale-105" />
                      </CardContent>
                       <CardFooter className="p-2 justify-center">
                        <p className="text-xs font-semibold truncate">{template.name}</p>
                      </CardFooter>
                    </Card>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </div>
      )}
       {activeTab === 'my-designs' && (
        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
          <div className="flex justify-between items-center">
            <Label className="bg-zinc-200 p-2 px-6 rounded-md">MY DESIGNS</Label>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleSaveDesign} size="sm">
                  <Plus className="mr-2 h-4 w-4" /> Save Current
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Save the current settings as a new design.</p>
              </TooltipContent>
            </Tooltip>
          </div>
          {myDesigns.length > 0 ? (
            <Carousel
              opts={{
                align: "start",
                dragFree: true,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-2">
                {myDesigns.map((template) => (
                  <CarouselItem key={template.id} className="basis-1/2 md:basis-1/4 pl-2">
                    <div className="relative group">
                       <button onClick={() => editingDesignId !== template.id && handleApplyTemplate(template)} className="w-full" disabled={editingDesignId === template.id}>
                        <Card className="overflow-hidden">
                          <CardContent className="p-0">
                             <Image src={template.previewImage} alt={template.name} width={200} height={250} className="object-cover aspect-[2/3] w-full" />
                          </CardContent>
                           <CardFooter className="p-2 justify-center flex-col items-center">
                             {editingDesignId === template.id ? (
                               <div className="flex items-center gap-1 w-full">
                                  <Input 
                                    type="text" 
                                    value={editingName} 
                                    onChange={(e) => setEditingName(e.target.value)} 
                                    className="h-7 text-xs" 
                                    autoFocus
                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateDesign(template.id)}
                                  />
                               </div>
                             ) : (
                                <p className="text-xs font-semibold truncate">{template.name}</p>
                             )}
                          </CardFooter>
                        </Card>
                      </button>
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingDesignId === template.id ? (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                 <Button variant="outline" size="icon" className="h-7 w-7 bg-green-100 hover:bg-green-200" onClick={() => handleUpdateDesign(template.id)}>
                                    <Check className="h-4 w-4 text-green-700" />
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Save Name</p></TooltipContent>
                            </Tooltip>
                             <Tooltip>
                              <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                                    <X className="h-4 w-4" />
                                  </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Cancel</p></TooltipContent>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEditClick(template.id, template.name)}>
                                  <FilePenLine className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Edit Name</p></TooltipContent>
                            </Tooltip>
                            <AlertDialog>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="icon" className="h-7 w-7">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Delete Design</p>
                                </TooltipContent>
                              </Tooltip>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your custom design.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteDesign(template.id)}>Delete</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <p>You haven't saved any designs yet.</p>
              <p className="text-xs">Click "Save Current" to add a design.</p>
            </div>
          )}
        </div>
      )}
      {activeTab === 'background' && (
        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
          <Label className="bg-zinc-200 p-2 px-6 rounded-md">BACKGROUND SETTINGS</Label>
          <Tabs value={backgroundTab} onValueChange={setBackgroundTab} className="w-full">
             <div className="flex items-center gap-2">
              <TabsList className="grid flex-grow grid-cols-3">
                <TabsTrigger value="flat">Solid Color</TabsTrigger>
                <TabsTrigger value="gradient">Gradient</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="flat" className="pt-4 space-y-4">
              <Carousel className="w-full" opts={{ dragFree: true }}>
                <CarouselContent>
                  <CarouselItem className="basis-1/3 md:basis-1/4">
                     <div className="relative h-32 w-full">
                      <Label htmlFor={`${baseId}-bg-color-picker`} className="h-full w-full flex items-center justify-center bg-gray-100 rounded-md border" style={{ backgroundColor: bgColor }}>
                        <Plus className="h-8 w-8 text-gray-600" />
                      </Label>
                      <Input
                        id={`${baseId}-bg-color-picker`}
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </CarouselItem>
                  {defaultSolidColors.map(color => (
                    <CarouselItem key={color} className="basis-1/3 md:basis-1/4">
                      <Card className="overflow-hidden cursor-pointer" onClick={() => setBgColor(color)}>
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
                    <CarouselItem key={gradient.name} className="basis-1/3 md:basis-1/4">
                      <Card className="overflow-hidden cursor-pointer" onClick={() => setGradientBg(gradient.css)}>
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
                        <CarouselItem key={template.name} className="basis-1/3 md:basis-1/4 pl-2">
                          <button onClick={() => setImageBgUrl(template.imageUrl)} className="w-full">
                            <Image src={template.imageUrl} alt={template.name} width={100} height={150} className="object-cover aspect-[2/3] rounded-md w-full" />
                          </button>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
              </div>
            <div className="space-y-2">
                <Label>Inspiring Search</Label>
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
                <div className="flex items-center space-x-2">
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
                  <Tooltip>
                    <TooltipTrigger asChild>
                       <Button onClick={() => handleSearchImages(1)} disabled={isSearching} size="icon" className="h-10 w-10 flex-shrink-0">
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
                      <Button onClick={handleFeelLucky} variant="outline" className="h-10">
                        <FeelLucky />
                        <span>Feel Lucky</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Feel Lucky</p>
                    </TooltipContent>
                  </Tooltip>
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
                      <CarouselItem key={index} className="basis-1/3 md:basis-1/4 pl-2">
                        <div onClick={() => setImageBgUrl(imageUrl)} className="cursor-pointer">
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

              <div className="space-y-4 pt-4">
                <Label>Overlay Settings</Label>
                <div className="flex items-center gap-2">
                   <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="relative h-10 w-10">
                        <Label htmlFor={`${baseId}-overlay-color-picker`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                          <BgOverlayIcon color={overlayColor} />
                        </Label>
                        <Input
                          id={`${baseId}-overlay-color-picker`}
                          name="overlay-color-picker"
                          type="color"
                          value={overlayColor}
                          onChange={(e) => setOverlayColor(e.target.value)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select Overlay Color</p>
                    </TooltipContent>
                  </Tooltip>
                  <Popover>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="icon">
                            <TextBoxOpacity />
                          </Button>
                        </PopoverTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Overlay Opacity</p>
                      </TooltipContent>
                    </Tooltip>
                    <PopoverContent className="w-56 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${baseId}-overlay-opacity-slider`}>Overlay Opacity</Label>
                        <div className="flex items-center gap-2">
                          <Slider
                            id={`${baseId}-overlay-opacity-slider`}
                            name="overlay-opacity-slider"
                            max={1}
                            min={0}
                            step={0.01}
                            value={[overlayOpacity]}
                            onValueChange={(value) => setOverlayOpacity(value[0])}
                            className="flex-grow"
                          />
                          <div className="text-sm p-2 rounded-md border border-input tabular-nums w-14 text-center">
                            {Math.round(overlayOpacity * 100)}
                          </div>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}
      {activeTab === 'text' && (
        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
          <Label className="bg-zinc-200 p-2 px-6 rounded-md">TEXT SETTINGS</Label>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 flex-grow">
              <Tooltip>
                <TooltipTrigger asChild>
                   <div className="relative h-10 w-10">
                    <Label htmlFor={`${baseId}-text-color-picker`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <TextColorChooseIcon color={textColor} />
                    </Label>
                     <Input
                      id={`${baseId}-text-color-picker`}
                      name="text-color-picker"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Select Text Color</p>
                </TooltipContent>
              </Tooltip>
              <div className="flex-grow">
                <Select value={activeFont.value} onValueChange={handleFontChange}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger className="w-full flex-grow" id={`${baseId}-font-select`} aria-label="Select Font">
                        <SelectValue placeholder="Select Font" />
                      </SelectTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select Font</p>
                    </TooltipContent>
                  </Tooltip>
                  <SelectContent>
                    {fontOptions.map((font) => (
                      <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.fontFamily }}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                   <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      {textAlign === 'left' && <AlignLeft className="h-4 w-4" />}
                      {textAlign === 'center' && <AlignCenter className="h-4 w-4" />}
                      {textAlign === 'right' && <AlignRight className="h-4 w-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Text Alignment</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTextAlign('left')}>
                  <AlignLeft className="mr-2 h-4 w-4" />
                  <span>Align Left</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTextAlign('center')}>
                  <AlignCenter className="mr-2 h-4 w-4" />
                  <span>Center</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTextAlign('right')}>
                  <AlignRight className="mr-2 h-4 w-4" />
                  <span>Align Right</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center gap-2 flex-shrink-0">
              <Tooltip>
                <TooltipTrigger asChild>
                   <div className="relative h-10 w-10">
                     <Label htmlFor={`${baseId}-rect-bg-color-picker`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <TextBgBoxIcon color={rectBgColor}/>
                    </Label>
                    <Input
                      id={`${baseId}-rect-bg-color-picker`}
                      name="rect-bg-color-picker"
                      type="color"
                      value={rectBgColor}
                      onChange={(e) => handleRectBgChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Text Box Color</p>
                </TooltipContent>
              </Tooltip>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <TextBoxOpacity />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Text Box Opacity</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-56 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${baseId}-rect-opacity-slider`}>Transparency</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id={`${baseId}-rect-opacity-slider`}
                        name="rect-opacity-slider"
                        max={1}
                        min={0}
                        step={0.01}
                        value={[rectOpacity]}
                        onValueChange={(value) => setRectOpacity(value[0])}
                        className="flex-grow"
                      />
                      <div className="text-sm p-2 rounded-md border border-input tabular-nums w-14 text-center">
                        {Math.round(rectOpacity * 100)}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div className="pt-4">
            <Carousel className="w-full" opts={{ dragFree: true }}>
              <CarouselContent>
                {defaultSolidColors.map(color => (
                  <CarouselItem key={color} className="basis-1/3 md:basis-1/4">
                    <Card className="overflow-hidden cursor-pointer" onClick={() => setTextColor(color)}>
                      <CardContent className="h-20" style={{ backgroundColor: color }} />
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
        </div>
      )}
      {activeTab === 'download' && (
        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
          <Label className="bg-zinc-200 p-2 px-6 rounded-md">DOWNLOAD SETTINGS</Label>
            <div className="space-y-2">
              <Label htmlFor={`${baseId}-file-name`}>File Name</Label>
              <Input
                id={`${baseId}-file-name`}
                name="file-name"
                type="text"
                placeholder="Enter file name..."
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>
            <div className="flex justify-around items-center pt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownloadAll}
                disabled={designs.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Download All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(currentSlide)}
              >
                <Download className="mr-2 h-4 w-4" />
                Download This Design
              </Button>
            </div>
        </div>
      )}
    </>
  );
}


export default function Home() {
  const [text, setText] = useState(defaultText);
  const [title, setTitle] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>();
  const [searchCarouselApi, setSearchCarouselApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const mainTextAreaId = useId();
  const [myDesigns, setMyDesigns] = useLocalStorage<DesignTemplate[]>('writa-designs', []);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');


  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (!carouselApi) {
      return
    }

    setCurrentSlide(carouselApi.selectedScrollSnap())

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap())
    }

    carouselApi.on("select", onSelect)
    return () => {
      carouselApi.off("select", onSelect)
    }
  }, [carouselApi]);


  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions.find(f => f.value === 'special-elite') || fontOptions[0]);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [backgroundTab, setBackgroundTab] = useState("image");
  const [bgColor, setBgColor] = useState(pageInitialColors.bgColor);
  const [textColor, setTextColor] = useState(pageInitialColors.textColor);
  const [gradientBg, setGradientBg] = useState(pageInitialColors.gradientBg);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[1].imageUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  const [rectBgColor, setRectBgColor] = useState(pageInitialColors.rectBgColor);
  const [rectOpacity, setRectOpacity] = useState(0);

  const [overlayColor, setOverlayColor] = useState(pageInitialColors.overlayColor);
  const [overlayOpacity, setOverlayOpacity] = useState(0);
  
  const [activeSettingsTab, setActiveSettingsTab] = useState('designs');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const [fileName, setFileName] = useState("writa");

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const designsRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobilePanelOpen && mobilePanelRef.current && !mobilePanelRef.current.contains(event.target as Node)) {
        setIsMobilePanelOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobilePanelOpen]);

  const handleTextRemaining = useCallback((remaining: string, fromIndex: number) => {
    const nextDesignIndex = fromIndex + 1;
    setDesigns(prevDesigns => {
        // If there's remaining text and we have a next slide to update
        if (remaining && prevDesigns[nextDesignIndex]) {
            const newDesigns = [...prevDesigns];
            // Check if the text is different to prevent infinite loops
            if (newDesigns[nextDesignIndex].text !== remaining) {
                newDesigns[nextDesignIndex].text = remaining;
                return newDesigns;
            }
        }
        // If there is remaining text but no next slide, create one
        else if (remaining && !prevDesigns[nextDesignIndex]) {
             return [...prevDesigns, { text: remaining, isTitle: false }];
        }
        // If there is no remaining text, but there are slides after this one, remove them
        else if (!remaining && prevDesigns.length > nextDesignIndex) {
            return prevDesigns.slice(0, nextDesignIndex);
        }
        
        return prevDesigns;
    });
}, []);

  const handleGenerate = useCallback(async () => {
    if (!text && !title) {
      toast({
        title: "No Text Entered",
        description: "Please enter a title or body text.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setIsGeneratingAnimation(true);
    setDesigns([]); // Clear all previous designs
    
    // Prepare designs in the background
    let finalTitle = title;
    let finalBody = text;

    if (!finalTitle && finalBody) {
        const sentenceEndMarkers = /[.!?]/;
        const firstSentenceMatch = finalBody.match(sentenceEndMarkers);
        
        if (firstSentenceMatch && firstSentenceMatch.index !== undefined) {
            const firstSentenceEnd = firstSentenceMatch.index + 1;
            finalTitle = finalBody.substring(0, firstSentenceEnd).trim();
            finalBody = finalBody.substring(firstSentenceEnd).trim();
        } else {
            finalTitle = finalBody;
            finalBody = "";
        }
    }

    const newDesigns: Design[] = [];
    if (finalTitle) {
      newDesigns.push({ text: finalTitle, isTitle: true });
    }
    if (finalBody) {
      newDesigns.push({ text: finalBody, isTitle: false });
    }
    setDesigns(newDesigns);
    setIsMobilePanelOpen(true);
    

    // Show animation for 1.6 seconds, then reveal content and scroll
    setTimeout(() => {
        setIsGeneratingAnimation(false);
        setIsLoading(false);
        if(designsRef.current) {
            designsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 1618);
  }, [text, title, toast]);
  
  const handleDownload = useCallback((index: number) => {
    const canvas = canvasRefs.current[index];
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `${fileName || 'writa'}-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [fileName]);

  const handleDownloadAll = useCallback(() => {
    if (designs.length === 0) return;
    designs.forEach((_, index) => {
      setTimeout(() => handleDownload(index), index * 300);
    });
  }, [designs, handleDownload]);

  const handleFontChange = (value: string) => {
    const newFont = fontOptions.find(f => f.value === value) || fontOptions[0];
    setActiveFont(newFont);
  }

  const handleSearchImages = async (page = 1) => {
    if (!searchQuery) return;
    setIsSearching(true);
    if (page === 1) {
      setSearchedImages([]);
    }
    try {
      const result = await findImages({ query: searchQuery, page: page, per_page: 6 });
      let updatedImages;
      if (page > 2) {
          updatedImages = [...searchedImages.slice(6), ...result.imageUrls];
      } else {
          updatedImages = [...searchedImages, ...result.imageUrls];
      }
      setSearchedImages(updatedImages);
      setSearchPage(page);

      if (page > 1) {
        setTimeout(() => {
          searchCarouselApi?.scrollTo(updatedImages.length - 6);
        }, 100);
      }

    } catch (error) {
      console.error(error);
      toast({
        title: "Image Search Failed",
        description: "An error occurred while searching for images. Please ensure your API key is configured correctly.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeywordSearch = (keyword: string) => {
    setSearchQuery(keyword.toLowerCase());
  };


  useEffect(() => {
    if (searchQuery) {
        handleSearchImages(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleFeelLucky = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const randomImageUrl = `https://picsum.photos/seed/${randomSeed}/1080/1350`;
    setImageBgUrl(randomImageUrl);
    setRectBgColor("#f4fdff");
    setRectOpacity(0.6);
  };

  const handleRectBgChange = (color: string) => {
    setRectBgColor(color);
    if (rectOpacity === 0) {
      setRectOpacity(1);
    }
  };

  const handleApplyTemplate = (template: DesignTemplate) => {
    setBackgroundTab(template.background.type);
    if (template.background.type === 'flat') {
      setBgColor(template.background.value);
    } else if (template.background.type === 'gradient') {
      setGradientBg(template.background.value);
    } else if (template.background.type === 'image') {
      setImageBgUrl(template.background.value);
    }

    const newFont = fontOptions.find(f => f.value === template.font.value) || fontOptions[0];
    setActiveFont(newFont);
    setTextColor(template.font.color);

    setRectBgColor(template.textBox.color);
    setRectOpacity(template.textBox.opacity);

    setOverlayColor(template.overlay.color);
    setOverlayOpacity(template.overlay.opacity);
    
    toast({
      title: "Template Applied",
      description: `"${template.name}" template has been set.`,
      duration: 2000,
    });
  };

  const handleSaveDesign = useCallback(() => {
    const canvas = canvasRefs.current[currentSlide];
    if (!canvas) {
      toast({
        variant: "destructive",
        title: "Cannot save design",
        description: "The design preview is not ready yet.",
        duration: 2000,
      });
      return;
    }

    const previewImage = canvas.toDataURL("image/jpeg", 0.5);

    let bgValue = '';
    if (backgroundTab === 'flat') bgValue = bgColor;
    else if (backgroundTab === 'gradient') bgValue = gradientBg;
    else if (backgroundTab === 'image') bgValue = imageBgUrl;

    const newDesign: DesignTemplate = {
      id: `design-${Date.now()}`,
      name: `My Design ${myDesigns.length + 1}`,
      previewImage: previewImage,
      background: {
        type: backgroundTab as 'flat' | 'gradient' | 'image',
        value: bgValue,
      },
      font: {
        value: activeFont.value,
        color: textColor,
      },
      textBox: {
        color: rectBgColor,
        opacity: rectOpacity,
      },
      overlay: {
        color: overlayColor,
        opacity: overlayOpacity,
      },
    };

    setMyDesigns(prev => [...prev, newDesign]);

    toast({
      title: "Design Saved",
      description: "Your current design has been saved to 'My Designs'.",
      duration: 2000,
    });

  }, [currentSlide, backgroundTab, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, myDesigns.length, setMyDesigns, toast]);

  const handleDeleteDesign = (id: string) => {
    setMyDesigns(prev => prev.filter(d => d.id !== id));
    toast({
      title: "Design Deleted",
      description: "The selected design has been removed from 'My Designs'.",
      duration: 2000,
    });
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
    setMyDesigns(prev => prev.map(d => d.id === id ? { ...d, name: editingName } : d));
    handleCancelEdit();
    toast({
      title: "Design Updated",
      description: "The design name has been updated.",
      duration: 2000,
    });
  };
  
  const renderCanvas = useCallback((design: Design, index: number) => {
    let currentBg: string | undefined;
    let imageUrl: string | undefined;

    switch(backgroundTab) {
        case "flat":
            currentBg = bgColor;
            imageUrl = undefined;
            break;
        case "gradient":
            currentBg = gradientBg;
            imageUrl = undefined;
            break;
        case "image":
            currentBg = imageBgUrl;
            imageUrl = imageBgUrl;
            break;
        default:
            currentBg = bgColor;
            imageUrl = undefined;
            break;
    }
    
    return (
        <ImageCanvas
          key={`${backgroundTab}-${activeFont.value}-${bgColor}-${textColor}-${gradientBg}-${imageBgUrl}-${rectBgColor}-${rectOpacity}-${overlayColor}-${overlayOpacity}-${index}-${design.text}-${textAlign}`}
          font={activeFont}
          text={design.text}
          isTitle={design.isTitle}
          textColor={textColor}
          backgroundColor={currentBg}
          backgroundImageUrl={imageUrl}
          width={1080}
          height={1350}
          onCanvasReady={(canvas) => {
            canvasRefs.current[index] = canvas;
          }}
          onTextRemaining={(remaining) => handleTextRemaining(remaining, index)}
          rectColor={rectBgColor}
          rectOpacity={rectOpacity}
          overlayColor={overlayColor}
          overlayOpacity={overlayOpacity}
          textAlign={textAlign}
        />
    )
  }, [backgroundTab, activeFont, bgColor, textColor, gradientBg, imageBgUrl, rectBgColor, rectOpacity, overlayColor, overlayOpacity, textAlign, handleTextRemaining]);

  const tabContentProps = {
    activeTab: activeSettingsTab,
    backgroundTab,
    setBackgroundTab,
    handleFeelLucky,
    bgColor,
    setBgColor,
    imageBgUrl,
    setImageBgUrl,
    searchQuery,
    setSearchQuery,
    handleSearchImages,
    isSearching,
    searchedImages,
    handleKeywordSearch,
    searchPage,
    overlayColor,
    setOverlayColor,
    overlayOpacity,
    setOverlayOpacity,
    textColor,
    setTextColor,
    activeFont,
    handleFontChange,
    textAlign,
    setTextAlign,
    rectBgColor,
    setRectBgColor,
    handleRectBgChange,
    rectOpacity,
    setRectOpacity,
    designs,
    handleDownloadAll,
    currentSlide,
    handleDownload,
    gradientBg,
    setGradientBg,
    setSearchCarouselApi,
    fileName,
    setFileName,
    handleApplyTemplate,
    myDesigns,
    handleSaveDesign,
    handleDeleteDesign,
    handleUpdateDesign,
    editingDesignId,
    handleEditClick,
    handleCancelEdit,
    editingName,
    setEditingName,
  };
  
  const handleMobileTabChange = (tab: string) => {
    setActiveSettingsTab(tab);
    setIsMobilePanelOpen(true);
  };


  const settingsPanel = (
    <CardFooter className="flex-col items-start p-0 bg-[#f4fdff] md:rounded-lg">
       <TooltipProvider>
        <Tabs
          value={activeSettingsTab}
          onValueChange={handleMobileTabChange}
          className="w-full flex flex-col-reverse md:flex-col"
        >
          <TabsList className="grid w-full grid-cols-5 bg-card text-card-foreground p-2 h-12 rounded-t-lg md:rounded-md">
             <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="designs"
                >
                  <LayoutTemplate />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Design Templates</p>
              </TooltipContent>
            </Tooltip>
             <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="my-designs"
                >
                  <Star />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>My Designs</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="background"
                >
                  <ImageIcon />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Background Settings</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="text"
                >
                  <Type />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Text Settings</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="download"
                >
                  <Download />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Options</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>
           <div className="flex-grow">
             <div className="md:hidden">
              <TabsContent value={activeSettingsTab} forceMount className={!isMobilePanelOpen ? 'hidden' : ''}>
                <TabContentContainer {...tabContentProps} />
              </TabsContent>
            </div>
            <div className="hidden md:block">
              <TabsContent value="designs">
                <TabContentContainer {...tabContentProps} activeTab="designs"/>
              </TabsContent>
              <TabsContent value="my-designs">
                <TabContentContainer {...tabContentProps} activeTab="my-designs"/>
              </TabsContent>
              <TabsContent value="background">
                <TabContentContainer {...tabContentProps} activeTab="background"/>
              </TabsContent>
              <TabsContent value="text">
                <TabContentContainer {...tabContentProps} activeTab="text"/>
              </TabsContent>
              <TabsContent value="download">
                <TabContentContainer {...tabContentProps} activeTab="download"/>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </TooltipProvider>
    </CardFooter>
  );


  return (
    <>
      <header className="w-full text-left p-4 md:p-8 h-[10vh] flex items-center">
        <Logo className="text-[2rem]" />
      </header>

      <main className="container mx-auto p-4 md:p-8 pt-0">
        <div className="flex flex-col items-center justify-center h-[90vh]">
          <div className="space-y-6 max-w-[800px] mx-auto w-full">
            <CardTitle className="text-primary-foreground">Creative Magic</CardTitle>
            <div className="space-y-4">
                <Label htmlFor={mainTextAreaId} className="sr-only">Main text area</Label>
                <Textarea
                id={mainTextAreaId}
                name="main-text-area"
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="bg-[hsl(60,75%,97%)] text-[#2b323f] placeholder:text-gray-400 border-0"
                />
                <div className="flex items-center justify-end gap-4">
                   <p className="text-xs text-[#fdfdf2]">{text.length} characters</p>
                   <Button
                      onClick={handleGenerate}
                      disabled={isLoading}
                      size="icon"
                      className="rounded-full bg-primary hover:bg-[#2b323f]"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUp className="h-4 w-4" />
                      )}
                    </Button>
                </div>
            </div>
          </div>
        </div>
        
        {isGeneratingAnimation && (
            <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
              background: 'linear-gradient(to bottom, #FEAC5E, #C779D0, #4BC0C8)'
            }}>
                <div className="w-64 h-64">
                    <Lottie animationData={webflowAnimation} loop={true} />
                </div>
            </div>
        )}

        { isClient && designs.length > 0 && (
          <div id="designs-container" ref={designsRef} className="w-full pt-8 flex flex-col items-center">
              <div className="w-full mx-auto flex flex-col items-center">
                  <div className="w-full max-w-md max-h-[70vh]">
                    <Carousel className="w-full" setApi={setCarouselApi} opts={{ dragFree: true }}>
                      <CarouselContent>
                        {designs.map((design, index) => (
                          <CarouselItem key={index} data-index={index}>
                            <div className="p-1 group relative">
                              <Card className="overflow-hidden border-0">
                                <CardContent className="p-0 aspect-[1080/1350] relative bg-card">
                                  {renderCanvas(design, index)}
                                </CardContent>
                              </Card>
                                <AlertDialog>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <AlertDialogTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            <Star className="h-5 w-5" />
                                          </Button>
                                        </AlertDialogTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Save to My Designs</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Save to My Designs?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will save the current background, font, and color settings as a new template.
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
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="-left-4 md:-left-12" />
                      <CarouselNext className="-right-4 md:-right-12" />
                    </Carousel>
                  </div>
                  {/* Desktop Settings Panel */}
                  <div className="w-full mt-6 hidden md:block md:max-w-4xl">
                    {settingsPanel}
                  </div>
              </div>
            </div>
        )}
      </main>

       {/* Mobile-only Fixed Bottom Settings Panel */}
       {isClient && designs.length > 0 && (
          <div id="mobile-settings-panel" ref={mobilePanelRef} className="md:hidden">
              {settingsPanel}
          </div>
        )}
    </>
  );
}

    