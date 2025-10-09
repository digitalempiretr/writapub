
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
import { AlignCenter, AlignLeft, AlignRight, ArrowUp, Download, ImageIcon, LayoutTemplate, Loader2, Plus, Search, Star, Trash2, Type, FilePenLine, Check, X, Bold, CaseUpper, Copy } from "lucide-react";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import { gradientTemplates, defaultSolidColors, pageInitialColors } from "@/lib/colors";
import { fontOptions } from "@/lib/font-options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { defaultText } from "@/lib/default-text";
import { TextColorChooseIcon, BgOverlayIcon, TextBgBoxIcon, TextBoxOpacity, FeelLucky } from '@/components/ui/icons';
import { designTemplates, DesignTemplate } from "@/lib/design-templates";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Sidebar, SidebarContent, SidebarHeader, SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

type Design = {
  text: string;
  isTitle: boolean;
};

type TextAlign = 'left' | 'center' | 'right';
type BackgroundType = 'flat' | 'gradient' | 'image';

const searchKeywords = ["Texture", "Background", "Wallpaper", "Nature", "Sea", "Art", "Minimal", "Abstract", "Dreamy", "Cinematic", "Surreal", "Vintage", "Futuristic", "Bohemian"];

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
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);

  const [backgroundType, setBackgroundType] = useState<BackgroundType>('image');
  
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


  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions.find(f => f.value === 'duru-sans') || fontOptions[0]);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [isBold, setIsBold] = useState(true);
  const [isUppercase, setIsUppercase] = useState(false);
  const [backgroundTab, setBackgroundTab] = useState<BackgroundType>("image");
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
  
  const [fileName, setFileName] = useState("writa");

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const designsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleTextRemaining = useCallback((remaining: string, fromIndex: number) => {
    const nextDesignIndex = fromIndex + 1;
    setDesigns(prevDesigns => {
        if (remaining && prevDesigns[nextDesignIndex]) {
            const newDesigns = [...prevDesigns];
            if (newDesigns[nextDesignIndex].text !== remaining) {
                newDesigns[nextDesignIndex].text = remaining;
                return newDesigns;
            }
        }
        else if (remaining && !prevDesigns[nextDesignIndex]) {
             return [...prevDesigns, { text: remaining, isTitle: false }];
        }
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
    setDesigns([]);
    
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
      setSearchedImages(prevImages => [...result.imageUrls, ...prevImages]);
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
    setSearchQuery(keyword.toLowerCase());
  };

  const handleBgColorSelect = (color: string) => {
    setBgColor(color);
    setBackgroundType('flat');
  };

  const handleGradientBgSelect = (css: string) => {
    setGradientBg(css);
    setBackgroundType('gradient');
  };

  const handleImageBgUrlSelect = (url: string) => {
    setImageBgUrl(url);
    setBackgroundType('image');
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
    handleImageBgUrlSelect(randomImageUrl);
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
    setBackgroundType(template.background.type);

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
    if (backgroundType === 'flat') bgValue = bgColor;
    else if (backgroundType === 'gradient') bgValue = gradientBg;
    else if (backgroundType === 'image') bgValue = imageBgUrl;

    const newDesign: DesignTemplate = {
      id: `design-${Date.now()}`,
      name: `My Design ${myDesigns.length + 1}`,
      previewImage: previewImage,
      background: {
        type: backgroundType,
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

  }, [currentSlide, backgroundType, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, myDesigns.length, setMyDesigns, toast]);

  const handleDeleteDesign = (id: string) => {
    setMyDesigns(prev => prev.filter(d => d.id !== id));
    setDesignToDelete(null);
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

  const handleLogDesign = useCallback(() => {
    let bgValue = '';
    if (backgroundType === 'flat') bgValue = bgColor;
    else if (backgroundType === 'gradient') bgValue = gradientBg;
    else if (backgroundType === 'image') bgValue = imageBgUrl;
  
    const templateToLog: Omit<DesignTemplate, 'id' | 'name' | 'previewImage'> & { previewImage: string } = {
      previewImage: "''", // Placeholder
      background: {
        type: backgroundType,
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

    const templateString = `
{
  id: 'template-NEW_ID',
  name: "New Template Name",
  previewImage: "",
  background: {
    type: '${templateToLog.background.type}',
    value: ${templateToLog.background.type === 'gradient' 
      ? `gradientTemplates.find(g => g.name === 'YOUR_GRADIENT_NAME')?.css || '${templateToLog.background.value}'`
      : `'${templateToLog.background.value}'`
    },
  },
  font: {
    value: '${templateToLog.font.value}',
    color: '${templateToLog.font.color}',
  },
textBox: {
    color: '${templateToLog.textBox.color}',
    opacity: ${templateToLog.textBox.opacity},
  },
  overlay: {
    color: '${templateToLog.overlay.color}',
    opacity: ${templateToLog.overlay.opacity},
  },
},`;
  
    console.log("Copy this code snippet to add to design-templates.ts:");
    console.log(templateString);
  
    toast({
      title: "Design Logged to Console",
      description: "Open developer tools (F12) to see the design code.",
      duration: 5000,
    });
  }, [backgroundType, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, toast]);

  
  const renderCanvas = useCallback((design: Design, index: number) => {
    let currentBg: string | undefined;
    let imageUrl: string | undefined;

    switch(backgroundType) {
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
          key={`${backgroundType}-${activeFont.value}-${bgColor}-${textColor}-${gradientBg}-${imageBgUrl}-${rectBgColor}-${rectOpacity}-${overlayColor}-${overlayOpacity}-${index}-${design.text}-${textAlign}-${isBold}-${isUppercase}`}
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
          isBold={isBold}
          isUppercase={isUppercase}
        />
    )
  }, [backgroundType, activeFont, bgColor, textColor, gradientBg, imageBgUrl, rectBgColor, rectOpacity, overlayColor, overlayOpacity, textAlign, isBold, isUppercase, handleTextRemaining]);

  const baseId = useId();
  const imageBasedTemplates = designTemplates.filter(t => t.background.type === 'image');
  const styleBasedTemplates = designTemplates.filter(t => t.background.type === 'flat' || t.background.type === 'gradient');

  return (
    <SidebarProvider>
      <Sidebar className="bg-sidebar" collapsible="icon">
        <SidebarHeader className="flex items-center justify-between">
          <Logo />
          <SidebarTrigger />
        </SidebarHeader>
        <SidebarContent>
           <Accordion type="multiple" defaultValue={['item-1']} className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Design Templates</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
                  <Tabs defaultValue="templates" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="templates">Templates</TabsTrigger>
                      <TabsTrigger value="styles">Styles</TabsTrigger>
                    </TabsList>
                    <TabsContent value="templates" className="pt-4">
                      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                        <CarouselContent className="-ml-2">
                          {imageBasedTemplates.map((template) => (
                            <CarouselItem key={template.id} className="basis-1/2 md:basis-1/4 pl-2">
                              <button onClick={() => handleApplyTemplate(template)} className="w-full group">
                                <Card className="overflow-hidden">
                                  <CardContent className="p-0 aspect-[2/3] w-full">
                                    {template.previewImage ? (
                                        <Image src={template.previewImage} alt={template.name} width={200} height={300} className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105" />
                                    ) : (
                                        <div 
                                          className="w-full h-full flex items-center justify-center p-2 text-center transition-transform duration-300 group-hover:scale-105" 
                                          style={{ background: template.background.value }}>
                                          <span 
                                            style={{
                                              fontFamily: fontOptions.find(f => f.value === template.font.value)?.fontFamily || 'sans-serif',
                                              color: template.font.color
                                            }}
                                            className="text-lg font-bold"
                                          >
                                            {template.name}
                                          </span>
                                        </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </button>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </TabsContent>
                    <TabsContent value="styles" className="pt-4">
                      <Carousel opts={{ align: "start", dragFree: true, }} className="w-full">
                        <CarouselContent className="-ml-2">
                          {styleBasedTemplates.map((template) => (
                            <CarouselItem key={template.id} className="basis-1/2 md:basis-1/4 pl-2">
                              <button onClick={() => handleApplyTemplate(template)} className="w-full group">
                                <Card className="overflow-hidden">
                                  <CardContent className="p-0 aspect-[2/3] w-full">
                                    {template.previewImage ? (
                                        <Image src={template.previewImage} alt={template.name} width={200} height={300} className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105" />
                                    ) : (
                                        <div 
                                          className="w-full h-full flex items-center justify-center p-2 text-center transition-transform duration-300 group-hover:scale-105" 
                                          style={{ background: template.background.value }}>
                                          <span 
                                            style={{
                                              fontFamily: fontOptions.find(f => f.value === template.font.value)?.fontFamily || 'sans-serif',
                                              color: template.font.color
                                            }}
                                            className="text-lg font-bold"
                                          >
                                            {template.name}
                                          </span>
                                        </div>
                                    )}
                                  </CardContent>
                                </Card>
                              </button>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </TabsContent>
                  </Tabs>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>My Designs</AccordionTrigger>
              <AccordionContent>
                 <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
                  <div className="flex justify-between items-center">
                    <TooltipProvider>
                      <div className="flex gap-2">
                          <Tooltip>
                          <TooltipTrigger asChild>
                              <Button onClick={handleLogDesign} size="sm" variant="outline">
                              <Copy className="mr-2 h-4 w-4" /> Log
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>Log current design to console for development.</p>
                          </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                          <TooltipTrigger asChild>
                              <Button onClick={handleSaveDesign} size="sm">
                              <Plus className="mr-2 h-4 w-4" /> Save
                              </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                              <p>Save the current settings as a new design.</p>
                          </TooltipContent>
                          </Tooltip>
                      </div>
                    </TooltipProvider>
                  </div>
                  {myDesigns.length > 0 ? (
                    <AlertDialog open={!!designToDelete} onOpenChange={(open) => !open && setDesignToDelete(null)}>
                      <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
                        <CarouselContent className="-ml-2">
                          {myDesigns.map((template) => (
                            <CarouselItem key={template.id} className="basis-1/2 md:basis-1/4 pl-2">
                              <div className="relative group">
                                <button onClick={() => editingDesignId !== template.id && handleApplyTemplate(template)} className="w-full" disabled={editingDesignId === template.id}>
                                  <Card className="overflow-hidden">
                                    <CardContent className="p-0 aspect-[2/3] w-full">
                                      {template.previewImage ? (
                                        <Image src={template.previewImage} alt={template.name} width={200} height={300} className="object-cover h-full w-full" />
                                      ) : (
                                        <div 
                                          className="w-full h-full flex items-center justify-center p-2 text-center" 
                                          style={{ background: template.background.value }}>
                                          <span 
                                            style={{
                                              fontFamily: fontOptions.find(f => f.value === template.font.value)?.fontFamily || 'sans-serif',
                                              color: template.font.color
                                            }}
                                            className="text-lg font-bold"
                                          >
                                            {template.name}
                                          </span>
                                        </div>
                                      )}
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
                                       <TooltipProvider>
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
                                       </TooltipProvider>
                                    </>
                                  ) : (
                                    <>
                                       <TooltipProvider>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEditClick(template.id, template.name)}>
                                                <FilePenLine className="h-4 w-4" />
                                              </Button>
                                            </TooltipTrigger>
                                            <TooltipContent><p>Edit Name</p></TooltipContent>
                                          </Tooltip>
                                          
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <AlertDialogTrigger asChild>
                                                  <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => setDesignToDelete(template.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                  </Button>
                                                </AlertDialogTrigger>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                <p>Delete Design</p></TooltipContent>
                                            </Tooltip>
                                       </TooltipProvider>
                                    </>
                                  )}
                                </div>
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your custom design.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => designToDelete && handleDeleteDesign(designToDelete)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <p>You haven't saved any designs yet.</p>
                      <p className="text-xs">Click "Save Current" to add a design.</p>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-3">
              <AccordionTrigger>Background Settings</AccordionTrigger>
              <AccordionContent>
                 <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
                  <Tabs value={backgroundTab} onValueChange={(value) => setBackgroundTab(value as BackgroundType)} className="w-full">
                    <div className="flex items-center gap-2">
                      <TabsList className="grid flex-grow grid-cols-3">
                        <TabsTrigger value="flat">Solid</TabsTrigger>
                        <TabsTrigger value="gradient">Gradient</TabsTrigger>
                        <TabsTrigger value="image">Image</TabsTrigger>
                      </TabsList>
                    </div>
                    <TabsContent value="flat" className="pt-4 space-y-4">
                      <Carousel className="w-full" opts={{ dragFree: true }}>
                        <CarouselContent>
                          <CarouselItem className="basis-1/4">
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
                            <CarouselItem key={color} className="basis-1/4">
                              <Card className="overflow-hidden cursor-pointer" onClick={() => handleBgColorSelect(color)}>
                                <CardContent className="h-32" style={{ backgroundColor: color }} />
                              </Card>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </TabsContent>
                    <TabsContent value="gradient" className="pt-4 space-y-4">
                      <Carousel className="w-full" opts={{ dragFree: true }}>
                        <CarouselContent>
                          {gradientTemplates.map((gradient) => (
                            <CarouselItem key={gradient.name} className="basis-1/3">
                              <Card className="overflow-hidden cursor-pointer" onClick={() => handleGradientBgSelect(gradient.css)}>
                                <CardContent className="h-32" style={{ background: gradient.css }} />
                              </Card>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </TabsContent>
                    <TabsContent value="image" className="pt-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Ready-made Images</Label>
                          <Carousel opts={{ align: "start", dragFree: true, }} className="w-full">
                            <CarouselContent className="-ml-2">
                              {imageTemplates.map((template) => (
                                <CarouselItem key={template.name} className="basis-1/4 pl-2">
                                  <button onClick={() => handleImageBgUrlSelect(template.imageUrl)} className="w-full">
                                    <Image src={template.imageUrl} alt={template.name} width={100} height={150} className="object-cover aspect-[2/3] rounded-md w-full" />
                                  </button>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                          </Carousel>
                      </div>
                    <div className="space-y-2">
                        <Label>Inspiring Search</Label>
                        <Carousel opts={{ align: "start", dragFree: true, }} className="w-full">
                          <CarouselContent className="-ml-2">
                            {searchKeywords.map((keyword) => (
                              <CarouselItem key={keyword} className="basis-auto pl-2">
                                <Button variant="outline" size="sm" onClick={() => handleKeywordSearch(keyword)}>
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
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearchImages(1)}
                            className="flex-grow"
                          />
                           <TooltipProvider>
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
                                  <p>Search</p>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button onClick={handleFeelLucky} variant="outline" size="icon" className="h-10 w-10">
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
                        <Carousel opts={{ align: "start", dragFree: true, }} className="w-full" setApi={setSearchCarouselApi}>
                          <CarouselContent className="-ml-2">
                            {searchedImages.map((imageUrl, index) => (
                              <CarouselItem key={index} className="basis-1/4">
                                <div onClick={() => handleImageBgUrlSelect(imageUrl)} className="cursor-pointer">
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
                           <TooltipProvider>
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
                           </TooltipProvider>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Text Settings</AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-grow">
                       <TooltipProvider>
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
                       </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2">
                       <TooltipProvider>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" data-active={isBold} onClick={() => setIsBold(!isBold)} className="data-[active=true]:bg-primary/20">
                                  <Bold className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Bold</p></TooltipContent>
                          </Tooltip>
                          <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" data-active={isUppercase} onClick={() => setIsUppercase(!isUppercase)} className="data-[active=true]:bg-primary/20">
                                  <CaseUpper className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Uppercase</p></TooltipContent>
                          </Tooltip>
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
                       </TooltipProvider>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                       <TooltipProvider>
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
                       </TooltipProvider>
                    </div>
                  </div>
                  <div className="pt-4">
                    <Carousel className="w-full" opts={{ dragFree: true }}>
                      <CarouselContent>
                        {defaultSolidColors.map(color => (
                          <CarouselItem key={color} className="basis-1/4">
                            <Card className="overflow-hidden cursor-pointer" onClick={() => setTextColor(color)}>
                              <CardContent className="h-20" style={{ backgroundColor: color }} />
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    </Carousel>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Download Options</AccordionTrigger>
              <AccordionContent>
                 <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
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
                        Download This
                      </Button>
                    </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="w-full text-left p-4 md:p-8 h-[10vh] flex items-center">
          <SidebarTrigger className="md:hidden"/>
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
                </div>
              </div>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

    