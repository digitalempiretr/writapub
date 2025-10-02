
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
import { AlignCenter, AlignLeft, AlignRight, ArrowUp, Dice5, Download, Loader2, Plus, Search, Type } from "lucide-react";
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
import { Icon } from "@/components/ui/icon";

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
    setRectOpacity(0.8);
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
        <div className={`flex items-center justify-center ${designs.length > 0 ? 'h-auto' : 'flex-grow'}`}>
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
                            <Icon d="M15.56 10.81l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0zM2 5c-.55 0-1 .45-1 1v15c0 1.1.9 2 2 2h15c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1-.45-1-1V6c0-.55-.45-1-1-1zm19-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-1 16H8c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z" />
                            </TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Arka Plan Ayarları</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="text"><Type /></TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Metin Ayarları</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <TabsTrigger value="download"><Download /></TabsTrigger>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>İndirme Seçenekleri</p>
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
                                        <p>Kendimi Şanslı Hissediyorum</p>
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
                                      <Button key={keyword} variant="outline" size="sm" onClick={() => handleKeywordSearch(keyword)} className="flex-1">
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
                                    <p>Görsel Ara</p>
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
                                  <div className="relative border rounded-md p-1">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                          <div className="relative">
                                            <Icon d="M15.56 10.81l-2.35 3.02-1.56-1.88c-.2-.25-.58-.24-.78.01l-1.74 2.23c-.26.33-.02.81.39.81h8.98c.41 0 .65-.47.4-.8l-2.55-3.39c-.19-.26-.59-.26-.79 0zM2 5c-.55 0-1 .45-1 1v15c0 1.1.9 2 2 2h15c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1-.45-1-1V6c0-.55-.45-1-1-1zm19-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm-1 16H8c-.55 0-1-.45-1-1V4c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z" fill={overlayColor} />
                                            <Input
                                            type="color"
                                            value={overlayColor}
                                            onChange={(e) => setOverlayColor(e.target.value)}
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                          </div>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Katman Rengini Seç</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </div>
                                  <Popover>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <PopoverTrigger asChild>
                                          <Button variant="outline" size="icon">
                                          <Icon d="M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8V4z" fill={'hsl(var(--primary))'} />
                                          </Button>
                                        </PopoverTrigger>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>Katman Şeffaflığı</p>
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
                          <div className="flex flex-col gap-y-4">
                            <div className="space-y-2">
                              <Label>Font Settings</Label>
                              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
                                {/* Text Color */}
                                <div className="relative border rounded-md p-1">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="relative">
                                            <Icon d="M6.51,13L6.51,13c0.34,0,0.65-0.21,0.76-0.53l0.72-2.02h4.04l0.71,2.02c0.11,0.32,0.42,0.54,0.76,0.54 c0.56,0,0.95-0.56,0.75-1.09l-3.03-8.08C11.02,3.33,10.54,3,10,3S8.98,3.33,8.79,3.84l-3.03,8.08C5.56,12.44,5.95,13,6.51,13z M9.57,6.02l0.39-1.16h0.08l0.39,1.16l1.06,2.98H8.51L9.57,6.02z" path="M16,16H4c-1.1,0-2,0.9-2,2s0.9,2,2,2h12c1.1,0,2-0.9,2-2S17.1,16,16,16z" fill={textColor} />
                                            <Input
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                            />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Metin Rengini Seç</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>

                                {/* Font Selection */}
                                <Select value={activeFont.value} onValueChange={handleFontChange}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <SelectTrigger className="w-full border-0">
                                        <SelectValue placeholder="Select Font" />
                                      </SelectTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Yazı Tipini Seç</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  <SelectContent>
                                    {fontOptions.map((font) => (
                                      <SelectItem key={font.value} value={font.value}>
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
                                      <p>Metin Hizalama</p>
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
                            </div>
                            <div className="space-y-2">
                                <Label>Font Background Settings</Label>
                                <div className="flex items-center gap-2">
                                {/* Text Box Color */}
                                <div className="relative border rounded-md p-1">
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <div className="relative">
                                                <Icon d="M2.75,5L2.75,5C2.34,5,2,5.34,2,5.75V16.5C2,17.33,2.67,18,3.5,18h10.75c0.41,0,0.75-0.34,0.75-0.75l0,0 c0-0.41-0.34-0.75-0.75-0.75H3.5V5.75C3.5,5.34,3.16,5,2.75,5z" polygon="11.47,6.3 10.45,9.19 12.55,9.19 11.53,6.3" path="M16.5,2h-10C5.67,2,5,2.67,5,3.5v10C5,14.33,5.67,15,6.5,15h10c0.83,0,1.5-0.67,1.5-1.5v-10C18,2.67,17.33,2,16.5,2z M13.41,11.62l-0.49-1.41h-2.83l-0.5,1.41C9.51,11.85,9.3,12,9.06,12h0c-0.39,0-0.67-0.39-0.53-0.76l2.12-5.65 C10.79,5.23,11.12,5,11.5,5h0c0.38,0,0.71,0.23,0.85,0.59l2.12,5.65c0.14,0.37-0.13,0.76-0.53,0.76h0 C13.7,12,13.49,11.85,13.41,11.62z" fill={rectBgColor} />
                                                <Input
                                                type="color"
                                                value={rectBgColor}
                                                onChange={(e) => setRectBgColor(e.target.value)}
                                                className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                                />
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Metin Kutusu Rengi</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                                {/* Opacity */}
                                <Popover>
                                    <Tooltip>
                                    <TooltipTrigger asChild>
                                        <PopoverTrigger asChild>
                                        <Button variant="outline" size="icon">
                                            <Icon path="M11 9h2v2h-2V9zm-2 2h2v2H9v-2zm4 0h2v2h-2v-2zm2-2h2v2h-2V9zM7 9h2v2H7V9zm12-6H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 18H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm2-7h-2v2h2v2h-2v-2h-2v2h-2v-2h-2v2H9v-2H7v2H5v-2h2v-2H5V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v5z" fill={'hsl(var(--foreground))'} />
                                        </Button>
                                        </PopoverTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Metin Kutusu Şeffaflığı</p>
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
    