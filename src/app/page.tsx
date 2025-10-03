
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
import { AlignCenter, AlignLeft, AlignRight, ArrowUp, Dice5, Download, ImageIcon, Loader2, Plus, Search, Type } from "lucide-react";
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from "react";
import { CardTitle } from "@/components/ui/card";
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { imageTemplates } from "@/lib/image-templates";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { gradientTemplates } from "@/lib/gradient-templates";
import { fontOptions } from "@/lib/font-options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { defaultText } from "@/lib/default-text";
import { Separator } from "@/components/ui/separator";
import { TextColorChooseIcon, LayersIcon, RectangleHorizontal, TextBgBoxIcon } from '@/components/ui/icons';


type Design = {
  text: string;
  isTitle: boolean;
};

type TextAlign = 'left' | 'center' | 'right';

const defaultSolidColors = [
  '#000000', '#545454', '#737373', '#A6A6A6', '#B4B4B4', '#D9D9D9', '#FFFFFF',
  '#FF3131', '#FF5757', '#FF66C4', '#E2A9F1', '#CB6CE6', '#8C52FF', '#5E17EB',
  '#0097B2', '#0CC0DF', '#5CE1E6', '#38B6FF', '#5170FF', '#004AAD', '#1800AD',
  '#00BF63', '#7ED957', '#C1FF72', '#FFDE59', '#FFBD59', '#FF914D', '#FF751F'
];


const searchKeywords = ["Texture", "Background", "Wallpaper", "Nature", "Sea"];

export default function Home() {
  const [text, setText] = useState(defaultText);
  const [title, setTitle] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);

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
  const [bgColor, setBgColor] = useState("#f4fdff");
  const [textColor, setTextColor] = useState("#0F2027");
  const [gradientBg, setGradientBg] = useState(gradientTemplates[0].css);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[1].imageUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);

  const [rectBgColor, setRectBgColor] = useState("#7585A3");
  const [rectOpacity, setRectOpacity] = useState(0);

  const [overlayColor, setOverlayColor] = useState("#7585A3");
  const [overlayOpacity, setOverlayOpacity] = useState(0);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const designsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

    // Show animation for 1.6 seconds, then reveal content and scroll
    setTimeout(() => {
        setIsGeneratingAnimation(false);
        setIsLoading(false);
        if(designsRef.current) {
            designsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 1618);
  }, [text, title, toast]);
  
  const handleDownload = (index: number) => {
    const canvas = canvasRefs.current[index];
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `writa-${index + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleDownloadAll = () => {
    if (designs.length === 0) return;
    designs.forEach((_, index) => {
      setTimeout(() => handleDownload(index), index * 300);
    });
  };

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
      if (page > 2) {
          setSearchedImages(prev => [...prev.slice(6), ...result.imageUrls]);
      } else {
          setSearchedImages(prev => [...prev, ...result.imageUrls]);
      }
      setSearchPage(page);
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
    setSearchQuery(keyword);
    setSearchPage(1);
    handleSearchImages(1);
  };


  useEffect(() => {
    if (searchQuery && searchPage === 1) {
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
            currentBg = undefined;
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
  }, [backgroundTab, activeFont, bgColor, textColor, gradientBg, imageBgUrl, handleTextRemaining, rectBgColor, rectOpacity, overlayColor, overlayOpacity, textAlign]);

  return (
    <>
      <header className="w-full text-left p-4 md:p-8 h-[10vh] flex items-center">
        <Logo className="text-[2rem]" />
      </header>

      <main className="container mx-auto p-4 md:p-8 pt-0 flex flex-col h-[90vh]">
        <div className={`flex items-center justify-center flex-grow ${designs.length > 0 ? '' : 'h-full'}`}>
            <div className="space-y-6 max-w-[800px] mx-auto w-full">
              <CardTitle className="text-primary-foreground">Creative Magic</CardTitle>
              <div className="space-y-4">
                  <Textarea
                  id="text"
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
          <div className="w-full pt-8 pb-8 flex-grow flex flex-col">
            <div ref={designsRef} className="text-2xl h-10 pt-1 text-[#f4fdff]">Designs</div>
            <div className="max-w-lg mx-auto w-full space-y-6">
                <Carousel className="w-full" setApi={setCarouselApi}>
                  <CarouselContent>
                    {designs.map((design, index) => (
                      <CarouselItem key={index} data-index={index}>
                        <div className="p-1">
                          <Card className="overflow-hidden border-0">
                            <CardContent className="p-0 aspect-[1080/1350] relative bg-card">
                              {renderCanvas(design, index)}
                            </CardContent>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4 md:-left-12" />
                  <CarouselNext className="-right-4 md:-right-12" />
                </Carousel>

                <CardFooter className="flex-col items-start p-0 bg-[#f4fdff] claymorphic-base rounded-lg">
                  <TooltipProvider>
                    <Tabs defaultValue="background" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-card text-card-foreground p-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="background">
                              <ImageIcon />
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Background Settings</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="text"><Type /></TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Text Settings</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="download"><Download /></TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Options</p>
                          </TooltipContent>
                        </Tooltip>
                      </TabsList>
                      <TabsContent value="background">
                        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
                          <Label>Background</Label>
                          <Tabs value={backgroundTab} onValueChange={setBackgroundTab} className="w-full">
                            <div className="flex items-center gap-2">
                                <TabsList className="grid w-full grid-cols-3 flex-grow">
                                    <TabsTrigger value="flat">Solid Color</TabsTrigger>
                                    <TabsTrigger value="gradient">Gradient</TabsTrigger>
                                    <TabsTrigger value="image">Image</TabsTrigger>
                                </TabsList>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={handleFeelLucky} variant="outline" size="icon" className="h-10 w-10">
                                            <Dice5 className="h-6 w-6" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>I'm Feeling Lucky</p>
                                    </TooltipContent>
                                </Tooltip>
                            </div>
                            <TabsContent value="flat" className="pt-4 space-y-4">
                              <Carousel className="w-full">
                                <CarouselContent>
                                  <CarouselItem className="basis-1/4">
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <Card className="overflow-hidden cursor-pointer h-32 flex items-center justify-center bg-gray-100">
                                          <Plus className="h-8 w-8 text-gray-600" />
                                        </Card>
                                      </PopoverTrigger>
                                      <PopoverContent className="w-auto p-2" align="start">
                                        <div className="flex items-center gap-4">
                                          <div className="relative">
                                            <div
                                              className="w-6 h-6 rounded-full border"
                                              style={{ backgroundColor: bgColor }}
                                            />
                                            <Input
                                              type="color"
                                              value={bgColor}
                                              onChange={(e) => setBgColor(e.target.value)}
                                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                          </div>
                                          <Input
                                            type="text"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="h-9 w-32"
                                          />
                                        </div>
                                      </PopoverContent>
                                    </Popover>
                                  </CarouselItem>
                                  {defaultSolidColors.map(color => (
                                    <CarouselItem key={color} className="basis-1/4">
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
                              <Carousel className="w-full">
                                <CarouselContent>
                                  {gradientTemplates.map((gradient) => (
                                    <CarouselItem key={gradient.name} className="basis-1/4">
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
                              <Carousel className="w-full">
                                <CarouselContent>
                                  {imageTemplates.map((image) => (
                                    <CarouselItem key={image.name} className="basis-1/4">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Card className="overflow-hidden cursor-pointer" onClick={() => setImageBgUrl(image.imageUrl)}>
                                            <CardContent className="h-32 relative">
                                              <Image src={image.imageUrl} alt={image.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />
                                            </CardContent>
                                          </Card>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          <p>{image.name}</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </CarouselItem>
                                  ))}
                                </CarouselContent>
                                <CarouselPrevious className="-left-4" />
                                <CarouselNext className="-right-4" />
                              </Carousel>
                              
                              <div className="space-y-2">
                                <Label>Inspiring Themes</Label>
                                <div className="flex gap-2">
                                  {searchKeywords.map(keyword => (
                                      <Button key={keyword} variant="outline" size="sm" onClick={() => handleKeywordSearch(keyword)} className="flex-1 responsive-text-sm whitespace-nowrap">
                                          {keyword}
                                      </Button>
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Input
                                  type="text"
                                  placeholder="Search for images..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearchImages(1)}
                                  className="flex-grow"
                                />
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button onClick={() => handleSearchImages(1)} disabled={isSearching} size="icon" className="h-10 w-10">
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
                              </div>

                              {searchedImages.length > 0 && (
                                <>
                                <div className="grid grid-cols-3 gap-2">
                                  {searchedImages.map((imageUrl, index) => (
                                    <button key={index} onClick={() => setImageBgUrl(imageUrl)}>
                                      <Image src={imageUrl} alt={`Search Result ${index}`} width={200} height={250} className="object-cover aspect-[2/3] rounded-md" />
                                    </button>
                                  ))}
                                </div>
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
                                        <Button variant="outline" size="icon" className="relative">
                                            <LayersIcon />
                                            <Input
                                            type="color"
                                            value={overlayColor}
                                            onChange={(e) => setOverlayColor(e.target.value)}
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                        </Button>
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
                                            <RectangleHorizontal />
                                          </Button>
                                        </PopoverTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Overlay Opacity</p>
                                      </TooltipContent>
                                    </Tooltip>
                                    <PopoverContent className="w-56 space-y-4">
                                      <div className="space-y-2">
                                        <Label>Overlay Opacity</Label>
                                        <div className="flex items-center gap-2">
                                          <Slider
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
                      </TabsContent>
                      <TabsContent value="text">
                        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
                            <div className="space-y-2">
                              <Label>Font Settings</Label>
                               <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 flex-grow">
                                  {/* Text Color */}
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon" className="relative">
                                            <TextColorChooseIcon />
                                            <Input
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Select Text Color</p>
                                    </TooltipContent>
                                  </Tooltip>

                                  {/* Font Selection */}
                                  <Select value={activeFont.value} onValueChange={handleFontChange}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <SelectTrigger className="flex-grow">
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

                                  {/* Alignment */}
                                  <DropdownMenu>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button variant="outline" size="icon">
                                          {textAlign === 'left' && <AlignLeft className="h-4 w-4" />}
                                          {textAlign === 'center' && <AlignCenter className="h-4 w-4" />}
                                          {textAlign === 'right' && <AlignRight className="h-4 w-4" />}
                                        </Button>
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
                                </div>
                                
                                <Separator orientation="vertical" className="h-8 mx-2" />
                                
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {/* Text Box Color */}
                                  <Tooltip>
                                      <TooltipTrigger asChild>
                                      <Button variant="outline" size="icon" className="relative">
                                            <TextBgBoxIcon />
                                            <Input
                                            type="color"
                                            value={rectBgColor}
                                            onChange={(e) => setRectBgColor(e.target.value)}
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>Text Box Color</p>
                                      </TooltipContent>
                                  </Tooltip>
                                  {/* Opacity */}
                                  <Popover>
                                      <Tooltip>
                                      <TooltipTrigger asChild>
                                          <PopoverTrigger asChild>
                                          <Button variant="outline" size="icon">
                                              <RectangleHorizontal />
                                          </Button>
                                          </PopoverTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                          <p>Text Box Opacity</p>
                                      </TooltipContent>
                                      </Tooltip>
                                      <PopoverContent className="w-56 space-y-4">
                                      <div className="space-y-2">
                                          <Label>Transparency</Label>
                                          <div className="flex items-center gap-2">
                                          <Slider
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
                            </div>
                        </div>
                      </TabsContent>
                      <TabsContent value="download">
                        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
                            <div className="flex justify-around items-center">
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
                      </TabsContent>
                    </Tabs>
                    </TooltipProvider>
                </CardFooter>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
