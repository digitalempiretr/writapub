
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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, ImageIcon, LayoutTemplate, Star, Type, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { imageTemplates } from "@/lib/image-templates";
import { fontOptions } from "@/lib/font-options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { defaultText } from "@/lib/default-text";
import { DesignTemplate } from "@/lib/design-templates";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { TextSettings, type Shadow } from "@/components/text-settings";
import { BackgroundSettings } from "@/components/background-settings";
import { DesignsPanel } from "@/components/designs-panel";
import { MyDesignsPanel } from "@/components/my-designs-panel";
import { DownloadPanel } from "@/components/download-panel";
import { pageInitialColors } from "@/lib/colors";
import { CreativeMagicPanel } from "@/components/creative-magic-panel";
import { cn } from "@/lib/utils";
import { textEffects, TextEffect, parseShadow } from "@/lib/text-effects";


type Design = {
  text: string;
  isTitle: boolean;
};

type TextAlign = 'left' | 'center' | 'right';
type BackgroundType = 'flat' | 'gradient' | 'image';

export default function Home() {
  const [text, setText] = useState(defaultText);
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>();
  const [searchCarouselApi, setSearchCarouselApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);
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
  const [textOpacity, setTextOpacity] = useState(1);
  const [gradientBg, setGradientBg] = useState(pageInitialColors.gradientBg);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[1].imageUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  
  const [isTextBoxEnabled, setIsTextBoxEnabled] = useState(false);
  const [rectBgColor, setRectBgColor] = useState(pageInitialColors.rectBgColor);
  const [rectOpacity, setRectOpacity] = useState(0);

  const [isOverlayEnabled, setIsOverlayEnabled] = useState(false);
  const [overlayColor, setOverlayColor] = useState(pageInitialColors.overlayColor);
  const [overlayOpacity, setOverlayOpacity] = useState(0.25);

  const [textShadowEnabled, setTextShadowEnabled] = useState(false);
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: Date.now(), color: '#000000', offsetX: 5, offsetY: 5, blur: 5 }
  ]);
  const [activeEffect, setActiveEffect] = useState<TextEffect>(textEffects[0]);

  const [textStroke, setTextStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>("designs");
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);

  const [fileName, setFileName] = useState("writa");

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const designsRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

   const closePanel = useCallback(() => {
    setIsMobilePanelOpen(false);
  }, []);

   useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobilePanelOpen &&
        mobilePanelRef.current &&
        !mobilePanelRef.current.contains(event.target as Node)
      ) {
        const targetElement = event.target as Element;
        if (
          targetElement.closest('[role="dialog"]') ||
          targetElement.closest('[role="alertdialog"]') ||
          targetElement.closest('[data-radix-popper-content-wrapper]')
        ) {
          return;
        }
        closePanel();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobilePanelOpen, closePanel]);


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
    if (!text) {
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
    setIsMobilePanelOpen(false);
    
    let finalTitle = "";
    let finalBody = text;

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
  }, [text, toast]);
  
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

  const handleTextBoxEnable = (enabled: boolean) => {
    setIsTextBoxEnabled(enabled);
    if (!enabled) {
      setRectOpacity(0);
    } else {
      if (rectOpacity === 0) {
        setRectOpacity(0.5); 
      }
    }
  };

  const handleOverlayEnable = (enabled: boolean) => {
    setIsOverlayEnabled(enabled);
    if (!enabled) {
      setOverlayOpacity(0);
    } else {
      if (overlayOpacity === 0) {
        setOverlayOpacity(0.25);
      }
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
    setIsTextBoxEnabled(template.textBox.opacity > 0);

    setOverlayColor(template.overlay.color);
    setOverlayOpacity(template.overlay.opacity);
    setIsOverlayEnabled(template.overlay.opacity > 0);
    
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
        title: "Cannot save favorite",
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
      name: `Favorite ${myDesigns.length + 1}`,
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
      description: "Your current design has been saved to 'Favorites'.",
      duration: 2000,
    });

  }, [currentSlide, backgroundType, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, myDesigns.length, setMyDesigns, toast]);

  const handleDeleteDesign = (id: string) => {
    setMyDesigns(prev => prev.filter(d => d.id !== id));
    setDesignToDelete(null);
    toast({
      title: "Favorite Deleted",
      description: "The selected favorite has been removed.",
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
      title: "Favorite Updated",
      description: "The favorite's name has been updated.",
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

    const handleEffectChange = (effect: TextEffect) => {
        setActiveEffect(effect);
        setTextShadowEnabled(false);
        if (effect.id === 'none') {
            setShadows([{ id: Date.now(), color: '#000000', offsetX: 5, offsetY: 5, blur: 5 }]);
        } else {
            if (effect.style.color) {
                setTextColor(effect.style.color);
            }
            if (effect.style.textShadow) {
                setTextShadowEnabled(true);
                const parsedShadows = parseShadow(effect.style.textShadow);
                setShadows(parsedShadows);
            }
        }
    };

    const handleTextColorChange = (newColor: string) => {
      setTextColor(newColor);
      if (activeEffect.id !== 'none') {
        setActiveEffect(textEffects[0]);
        setTextShadowEnabled(false);
      }
    };
  
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
          key={`${backgroundType}-${activeFont.value}-${bgColor}-${textColor}-${textOpacity}-${gradientBg}-${imageBgUrl}-${rectBgColor}-${rectOpacity}-${overlayColor}-${overlayOpacity}-${index}-${design.text}-${textAlign}-${isBold}-${isUppercase}-${textShadowEnabled}-${JSON.stringify(shadows)}-${textStroke}-${strokeColor}-${strokeWidth}-${activeEffect.id}`}
          font={activeFont}
          text={design.text}
          isTitle={design.isTitle}
          textColor={textColor}
          textOpacity={textOpacity}
          backgroundColor={currentBg}
          backgroundImageUrl={imageUrl}
          width={1080}
          height={1350}
          onCanvasReady={(canvas) => {
            canvasRefs.current[index] = canvas;
          }}
          onTextRemaining={(remaining) => handleTextRemaining(remaining, index)}
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
        />
    )
  }, [backgroundType, activeFont, bgColor, textColor, textOpacity, gradientBg, imageBgUrl, rectBgColor, rectOpacity, overlayColor, overlayOpacity, textAlign, isBold, isUppercase, textShadowEnabled, shadows, textStroke, strokeColor, strokeWidth, handleTextRemaining, isTextBoxEnabled, isOverlayEnabled, activeEffect]);
  
  const settingsPanel = (
    <CardFooter className="flex-col items-start p-0 bg-transparent md:rounded-lg">
      <TooltipProvider>
        <Tabs
          value={activeSettingsTab ?? ''}
          onValueChange={setActiveSettingsTab}
          className="w-full flex flex-col-reverse md:flex-col h-full"
        >
          <TabsList className="grid w-full grid-cols-5 bg-card text-card-foreground p-2 h-12 rounded-t-lg md:rounded-md flex-shrink-0">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="designs"
                  onClick={() => {
                    setActiveSettingsTab("designs");
                    setIsMobilePanelOpen(true)
                  }}
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
                  value="favorites"
                   onClick={() => {
                    setActiveSettingsTab("favorites");
                    setIsMobilePanelOpen(true)
                  }}
                >
                  <Star />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Favorites</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger
                  value="background"
                   onClick={() => {
                    setActiveSettingsTab("background");
                    setIsMobilePanelOpen(true)
                  }}
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
                   onClick={() => {
                    setActiveSettingsTab("text");
                    setIsMobilePanelOpen(true)
                  }}
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
                   onClick={() => {
                    setActiveSettingsTab("download");
                    setIsMobilePanelOpen(true)
                  }}
                >
                  <Download />
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download Options</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>
          <div className="flex-grow w-full overflow-hidden">
            {/* Desktop View */}
            <div className="hidden md:block h-full">
              <TabsContent value="designs" className="h-full mt-0">
                <DesignsPanel handleApplyTemplate={handleApplyTemplate} />
              </TabsContent>
              <TabsContent value="favorites" className="h-full mt-0">
                 <MyDesignsPanel 
                    myDesigns={myDesigns}
                    handleSaveDesign={handleSaveDesign}
                    handleDeleteDesign={handleDeleteDesign}
                    handleUpdateDesign={handleUpdateDesign}
                    editingDesignId={editingDesignId}
                    handleEditClick={handleEditClick}
                    handleCancelEdit={handleCancelEdit}
                    editingName={editingName}
                    setEditingName={setEditingName}
                    designToDelete={designToDelete}
                    setDesignToDelete={setDesignToDelete}
                    handleLogDesign={handleLogDesign}
                    handleApplyTemplate={handleApplyTemplate}
                 />
              </TabsContent>
              <TabsContent value="background" className="h-full mt-0">
                 <BackgroundSettings 
                    backgroundTab={backgroundTab}
                    setBackgroundTab={setBackgroundTab as (value: string) => void}
                    handleFeelLucky={handleFeelLucky}
                    bgColor={bgColor}
                    handleBgColorSelect={handleBgColorSelect}
                    imageBgUrl={imageBgUrl}
                    handleImageBgUrlSelect={handleImageBgUrlSelect}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearchImages={handleSearchImages}
                    isSearching={isSearching}
                    searchedImages={searchedImages}
                    handleKeywordSearch={handleKeywordSearch}
                    searchPage={searchPage}
                    isOverlayEnabled={isOverlayEnabled}
                    setIsOverlayEnabled={handleOverlayEnable}
                    overlayColor={overlayColor}
                    setOverlayColor={setOverlayColor}
                    overlayOpacity={overlayOpacity}
                    setOverlayOpacity={setOverlayOpacity}
                    gradientBg={gradientBg}
                    handleGradientBgSelect={handleGradientBgSelect}
                    setSearchCarouselApi={setSearchCarouselApi}
                 />
              </TabsContent>
              <TabsContent value="text" className="h-full mt-0">
                <TextSettings 
                  text={text}
                  setText={setText}
                  handleGenerate={handleGenerate}
                  isLoading={isLoading}
                  textColor={textColor}
                  setTextColor={handleTextColorChange}
                  textOpacity={textOpacity}
                  setTextOpacity={setTextOpacity}
                  activeFont={activeFont}
                  handleFontChange={handleFontChange}
                  fontOptions={fontOptions}
                  isBold={isBold}
                  setIsBold={setIsBold}
                  isUppercase={isUppercase}
                  setIsUppercase={setIsUppercase}
                  textAlign={textAlign}
                  setTextAlign={setTextAlign}
                  textShadowEnabled={textShadowEnabled}
                  setTextShadowEnabled={setTextShadowEnabled}
                  shadows={shadows}
                  setShadows={setShadows}
                  textStroke={textStroke}
                  setTextStroke={setTextStroke}
                  strokeColor={strokeColor}
                  setStrokeColor={setStrokeColor}
                  strokeWidth={strokeWidth}
                  setStrokeWidth={setStrokeWidth}
                  isTextBoxEnabled={isTextBoxEnabled}
                  setIsTextBoxEnabled={handleTextBoxEnable}
                  rectBgColor={rectBgColor}
                  setRectBgColor={setRectBgColor}
                  rectOpacity={rectOpacity}
                  setRectOpacity={setRectOpacity}
                  activeEffect={activeEffect}
                  setActiveEffect={handleEffectChange}
                />
              </TabsContent>
              <TabsContent value="download" className="h-full mt-0">
                <DownloadPanel 
                  fileName={fileName}
                  setFileName={setFileName}
                  handleDownloadAll={handleDownloadAll}
                  designs={designs}
                  currentSlide={currentSlide}
                  handleDownload={handleDownload}
                />
              </TabsContent>
            </div>

            {/* Mobile View: Render active tab inside the slidable panel */}
             <div className="md:hidden">
              {isMobilePanelOpen && (
                <div className="flex flex-col h-full">
                  <div className="w-full flex-shrink-0">
                    <div className="flex justify-end p-1">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={closePanel} 
                            className="h-8 w-8 rounded-full bg-background hover:bg-muted"
                        >
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close Panel</span>
                        </Button>
                    </div>
                  </div>
                  <div className="flex-grow overflow-y-auto">
                    {activeSettingsTab === 'designs' && <DesignsPanel handleApplyTemplate={handleApplyTemplate} />}
                    {activeSettingsTab === 'favorites' && (
                      <MyDesignsPanel 
                        myDesigns={myDesigns}
                        handleSaveDesign={handleSaveDesign}
                        handleDeleteDesign={handleDeleteDesign}
                        handleUpdateDesign={handleUpdateDesign}
                        editingDesignId={editingDesignId}
                        handleEditClick={handleEditClick}
                        handleCancelEdit={handleCancelEdit}
                        editingName={editingName}
                        setEditingName={setEditingName}
                        designToDelete={designToDelete}
                        setDesignToDelete={setDesignToDelete}
                        handleLogDesign={handleLogDesign}
                        handleApplyTemplate={handleApplyTemplate}
                      />
                    )}
                    {activeSettingsTab === 'background' && (
                      <BackgroundSettings 
                        backgroundTab={backgroundTab}
                        setBackgroundTab={setBackgroundTab as (value: string) => void}
                        handleFeelLucky={handleFeelLucky}
                        bgColor={bgColor}
                        handleBgColorSelect={handleBgColorSelect}
                        imageBgUrl={imageBgUrl}
                        handleImageBgUrlSelect={handleImageBgUrlSelect}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        handleSearchImages={handleSearchImages}
                        isSearching={isSearching}
                        searchedImages={searchedImages}
                        handleKeywordSearch={handleKeywordSearch}
                        searchPage={searchPage}
                        isOverlayEnabled={isOverlayEnabled}
                        setIsOverlayEnabled={handleOverlayEnable}
                        overlayColor={overlayColor}
                        setOverlayColor={setOverlayColor}
                        overlayOpacity={overlayOpacity}
                        setOverlayOpacity={setOverlayOpacity}
                        gradientBg={gradientBg}
                        handleGradientBgSelect={handleGradientBgSelect}
                        setSearchCarouselApi={setSearchCarouselApi}
                      />
                    )}
                    {activeSettingsTab === 'text' && (
                      <TextSettings 
                        text={text}
                        setText={setText}
                        handleGenerate={handleGenerate}
                        isLoading={isLoading}
                        textColor={textColor}
                        setTextColor={handleTextColorChange}
                        textOpacity={textOpacity}
                        setTextOpacity={setTextOpacity}
                        activeFont={activeFont}
                        handleFontChange={handleFontChange}
                        fontOptions={fontOptions}
                        isBold={isBold}
                        setIsBold={setIsBold}
                        isUppercase={isUppercase}
                        setIsUppercase={setIsUppercase}
                        textAlign={textAlign}
                        setTextAlign={setTextAlign}
                        textShadowEnabled={textShadowEnabled}
                        setTextShadowEnabled={setTextShadowEnabled}
                        shadows={shadows}
                        setShadows={setShadows}
                        textStroke={textStroke}
                        setTextStroke={setTextStroke}
                        strokeColor={strokeColor}
                        setStrokeColor={setStrokeColor}
                        strokeWidth={strokeWidth}
                        setStrokeWidth={setStrokeWidth}
                        isTextBoxEnabled={isTextBoxEnabled}
                        setIsTextBoxEnabled={handleTextBoxEnable}
                        rectBgColor={rectBgColor}
                        setRectBgColor={setRectBgColor}
                        rectOpacity={rectOpacity}
                        setRectOpacity={setRectOpacity}
                        activeEffect={activeEffect}
                        setActiveEffect={handleEffectChange}
                      />
                    )}
                    {activeSettingsTab === 'download' && (
                       <DownloadPanel 
                        fileName={fileName}
                        setFileName={setFileName}
                        handleDownloadAll={handleDownloadAll}
                        designs={designs}
                        currentSlide={currentSlide}
                        handleDownload={handleDownload}
                       />
                    )}
                  </div>
                </div>
              )}
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
        {designs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-[90vh]">
                <CreativeMagicPanel 
                    text={text}
                    setText={setText}
                    handleGenerate={handleGenerate}
                    isLoading={isLoading}
                />
            </div>
        )}
        
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
                                        <p>Save to Favorites</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Save to Favorites?</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This will save the current background, font, and color settings as a new favorite template.
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
              {isMobilePanelOpen && <div className="fixed inset-0 bg-black/30 z-40" onClick={closePanel} />}
              <div 
                className={cn(
                  "fixed bottom-0 left-0 right-0 z-50 bg-card border-t transition-transform duration-300 ease-in-out",
                  isMobilePanelOpen ? "translate-y-0" : "translate-y-full",
                  "h-[75vh]"
                )}
              >
                 {settingsPanel}
              </div>
              <div 
                className={cn(
                  "fixed bottom-0 left-0 right-0 z-50",
                  "transition-transform duration-300 ease-in-out",
                  isMobilePanelOpen ? "translate-y-full" : "translate-y-0"
                )}
              >
                {settingsPanel}
              </div>
          </div>
        )}
    </>
  );
}
