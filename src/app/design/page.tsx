
"use client";

import { ImageCanvas } from "@/components/image-canvas";
import type { FontOption } from "@/lib/font-options";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
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

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Download, ImageIcon, LayoutTemplate, Type, X, HeartIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { imageTemplates, ImageTemplate } from "@/lib/image-templates";
import { fontOptions } from "@/lib/font-options";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, } from "@/components/ui/tooltip";
import { DesignTemplate, designTemplates } from "@/lib/design-templates";
import { TextSettings, type Shadow } from "@/components/3_text-settings";
import { BackgroundSettings } from "@/components/2_background-settings";
import { DesignsPanel } from "@/components/1_templates";
import { MyDesignsPanel } from "@/components/4_favorites";
import { DownloadPanel } from "@/components/5_download-panel";
import { pageInitialColors } from "@/lib/colors";
import { cn } from "@/lib/utils";
import { textEffects, TextEffect, parseShadow } from "@/lib/text-effects";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Icons } from "@/components/ui/icons";
import { useUser, useFirestore, useMemoFirebase, useCollection, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from "firebase/firestore";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import { CreativeMagicPanel } from "@/components/0_creative-magic-panel";


type Design = {
  text: string;
  isTitle: boolean;
};

type TextAlign = 'left' | 'center' | 'right';
type BackgroundType = 'flat' | 'gradient' | 'image';
type CanvasSize = { name: 'Post' | 'Story' | 'Square'; width: number; height: number };

const canvasSizes: CanvasSize[] = [
    { name: 'Post', width: 1080, height: 1350 },
    { name: 'Story', width: 1080, height: 1920 },
    { name: 'Square', width: 1080, height: 1080 },
];

const ZOOM_STEP = 0.1;
const MAX_ZOOM = 3.0;
const MIN_ZOOM = 0.25;

export default function DesignPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [text, setText] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi | undefined>();
  const [searchCarouselApi, setSearchCarouselApi] = useState<CarouselApi | undefined>();
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);

  const [backgroundType, setBackgroundType] = useState<BackgroundType>('image');
  const [currentTemplate, setCurrentTemplate] = useState<ImageTemplate | null>(imageTemplates[1]);
  
  const myDesignsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'designs');
  }, [firestore, user]);
  const { data: myDesigns } = useCollection<DesignTemplate>(myDesignsQuery);

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const handleGenerate = useCallback(() => {
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

  useEffect(() => {
    const urlText = searchParams.get('text');
    if(urlText) {
        setText(decodeURIComponent(urlText));
    } else {
        setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (text) {
      handleGenerate();
    }
  }, [text, handleGenerate]);
  
  const handleSelectCarousel = useCallback(() => {
    if (!carouselApi) {
      return
    }
    setCurrentSlide(carouselApi.selectedScrollSnap())
  }, [carouselApi]);

  useEffect(() => {
    if (!carouselApi) {
      return
    }

    handleSelectCarousel();
    carouselApi.on("select", handleSelectCarousel)

    return () => {
      carouselApi.off("select", handleSelectCarousel)
    }
  }, [carouselApi, handleSelectCarousel]);

  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions.find(f => f.value === 'duru-sans') || fontOptions[0]);

  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [isBold, setIsBold] = useState(true);
  const [isUppercase, setIsUppercase] = useState(false);
  const [backgroundTab, setBackgroundTab] = useState<BackgroundType>("image");
  const [bgColor, setBgColor] = useState(pageInitialColors.bgColor);
  const [textColor, setTextColor] = useState(pageInitialColors.textColor);
  const [textOpacity, setTextOpacity] = useState(1);
  const [gradientBg, setGradientBg] = useState(pageInitialColors.gradientBg);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[1].imageUrls.post);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [canvasSize, setCanvasSize] = useState<CanvasSize>(canvasSizes[0]);
  
  const [isTextBoxEnabled, setIsTextBoxEnabled] = useState(false);
  const [rectBgColor, setRectBgColor] = useState(pageInitialColors.rectBgColor);
  const [rectOpacity, setRectOpacity] = useState(0);

  const [isOverlayEnabled, setIsOverlayEnabled] = useState(false);
  const [overlayColor, setOverlayColor] = useState(pageInitialColors.overlayColor);
  const [overlayOpacity, setOverlayOpacity] = useState(0.25);

  const [textShadowEnabled, setTextShadowEnabled] = useState(false);
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: Date.now(), color: '#000000', offsetX: 5, offsetY: 5, blur: 5, offsetXUnit: 'px', offsetYUnit: 'px', blurUnit: 'px' }
  ]);
  const [activeEffect, setActiveEffect] = useState<TextEffect>(textEffects[0]);

  const [textStroke, setTextStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>('designs');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [fileName, setFileName] = useState("writa");
  const [zoomLevel, setZoomLevel] = useState(0.5);

  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const designsRef = useRef<HTMLDivElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

   const closePanel = useCallback(() => {
    setIsMobilePanelOpen(false);
    setActiveSettingsTab('');
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
    setCurrentTemplate(null);
  };

  const handleGradientBgSelect = (css: string) => {
    setGradientBg(css);
    setBackgroundType('gradient');
    setCurrentTemplate(null);
  };

  const handleImageBgUrlSelect = (template: ImageTemplate) => {
    setCurrentTemplate(template);
    setBackgroundType('image');
  };

  useEffect(() => {
    if (backgroundType === 'image' && currentTemplate) {
      const formatKey = canvasSize.name.toLowerCase() as keyof ImageTemplate['imageUrls'];
      setImageBgUrl(currentTemplate.imageUrls[formatKey]);
    }
  }, [canvasSize, currentTemplate, backgroundType]);


  useEffect(() => {
    if (searchQuery) {
        handleSearchImages(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const handleFeelLucky = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    const url = `https://picsum.photos/seed/${randomSeed}`;
    const luckyTemplate: ImageTemplate = {
      name: 'Lucky',
      imageUrls: {
        post: `${url}/1080/1350`,
        story: `${url}/1080/1920`,
        square: `${url}/1080/1080`,
      }
    };
    handleImageBgUrlSelect(luckyTemplate);
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

  const handleApplyTemplate = useCallback((template: DesignTemplate) => {
    // Apply background settings
    setBackgroundTab(template.background.type);
    setBackgroundType(template.background.type);
    setCurrentTemplate(null);
  
    if (template.background.type === 'flat') {
      setBgColor(template.background.value);
    } else if (template.background.type === 'gradient') {
      setGradientBg(template.background.value);
    } else if (template.background.type === 'image') {
      const imageTemplate: ImageTemplate = {
        name: template.name,
        imageUrls: {
          post: template.background.value,
          story: template.background.value,
          square: template.background.value,
        }
      }
      handleImageBgUrlSelect(imageTemplate);
    }
  
    // Apply font and text color
    const newFont = fontOptions.find(f => f.value === template.font.value) || activeFont;
    setActiveFont(newFont);
  
    // Determine font size based on current canvas format
    if (canvasSize.name === 'Square') {
      setActiveFont(prevFont => ({...prevFont, size: 36}));
    } else {
      setActiveFont(prevFont => ({...prevFont, size: 48}));
    }
  
    // Apply effect or text color
    if (template.effect?.id) {
      const effect = textEffects.find(e => e.id === template.effect!.id) || textEffects[0];
      handleEffectChange(effect);
    } else {
      handleEffectChange(textEffects[0]);
      setTextColor(template.font.color);
    }
  
    // Apply text box settings
    setRectBgColor(template.textBox.color);
    setRectOpacity(template.textBox.opacity);
    setIsTextBoxEnabled(template.textBox.opacity > 0);
  
    // Apply overlay settings
    setOverlayColor(template.overlay.color);
    setOverlayOpacity(template.overlay.opacity);
    setIsOverlayEnabled(template.overlay.opacity > 0);
  
    toast({
      title: "Template Applied",
      description: `"${template.name}" template has been set.`,
      duration: 2000,
    });
  }, [activeFont, canvasSize.name, toast]);

  useEffect(() => {
    const templateId = searchParams.get('templateId');
    if (templateId) {
      let template: DesignTemplate | undefined;
      // First, check the main design templates
      template = designTemplates.find(t => t.id === templateId);
      
      // If not found, check the user's saved designs
      if (!template && myDesigns) {
        template = myDesigns.find(t => t.id === templateId);
      }
      
      if (template) {
        handleApplyTemplate(template);
      }
    }
  }, [searchParams, myDesigns, handleApplyTemplate]);

  const handleSaveDesign = useCallback(() => {
    if (!user || !firestore) {
        toast({
            variant: "destructive",
            title: "Login Required",
            description: "You need to be logged in to save favorites.",
            duration: 2000,
        });
        return;
    }
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

    const newDesign: Omit<DesignTemplate, 'id'> = {
      name: `Favorite ${(myDesigns?.length || 0) + 1}`,
      category: 'Favorites',
      previewImage: previewImage,
      canvasSize: canvasSize.name,
      background: {
        type: backgroundType,
        value: bgValue,
      },
      font: {
        value: activeFont.value,
        color: textColor,
        fontSize: typeof activeFont.size === 'number' ? activeFont.size : 48,
      },
      textBox: {
        color: rectBgColor,
        opacity: rectOpacity,
      },
      overlay: {
        color: overlayColor,
        opacity: overlayOpacity,
      },
      effect: {
        id: activeEffect.id,
      },
    };
    if (myDesignsQuery) {
        addDocumentNonBlocking(myDesignsQuery, {...newDesign, createdAt: serverTimestamp()});
    }

    toast({
      title: "Design Saved",
      description: "Your current design has been saved to 'Favorites'.",
      duration: 2000,
    });

  }, [currentSlide, backgroundType, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, myDesigns, toast, activeEffect, canvasSize, user, firestore, myDesignsQuery]);

  const handleDeleteDesign = (id: string) => {
    if (!user || !firestore) return;
    const docRef = doc(firestore, 'users', user.uid, 'designs', id);
    deleteDocumentNonBlocking(docRef);
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
    if (!user || !firestore || !editingName.trim()) return;
    const docRef = doc(firestore, 'users', user.uid, 'designs', id);
    updateDocumentNonBlocking(docRef, { name: editingName });
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
  
    const templateToLog = {
      previewImage: "''", // Placeholder
      category: "UNCATEGORIZED",
      canvasSize: canvasSize.name,
      background: {
        type: backgroundType,
        value: bgValue,
      },
      font: {
        value: activeFont.value,
        color: textColor,
        fontSize: typeof activeFont.size === 'number' ? activeFont.size : 48,
      },
      textBox: {
        color: rectBgColor,
        opacity: rectOpacity,
      },
      overlay: {
        color: overlayColor,
        opacity: overlayOpacity,
      },
       effect: {
        id: activeEffect.id
      }
    };

    const templateString = `
{
  id: 'template-NEW_ID',
  name: "New Template Name",
  category: 'Special Effects', // Or 'Color Styles' or 'Image Templates'
  previewImage: "",
  canvasSize: '${templateToLog.canvasSize}',
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
    fontSize: ${templateToLog.font.fontSize},
  },
  textBox: {
    color: '${templateToLog.textBox.color}',
    opacity: ${templateToLog.textBox.opacity},
  },
  overlay: {
    color: '${templateToLog.overlay.color}',
    opacity: ${templateToLog.overlay.opacity},
  },
  effect: {
    id: '${templateToLog.effect?.id}',
  }
},`;
  
    console.log("Copy this code snippet to add to design-templates.ts:");
    console.log(templateString);
  
    toast({
      title: "Design Logged to Console",
      description: "Open developer tools (F12) to see the design code.",
      duration: 5000,
    });
  }, [backgroundType, bgColor, gradientBg, imageBgUrl, activeFont, textColor, rectBgColor, rectOpacity, overlayColor, overlayOpacity, toast, activeEffect, canvasSize]);

  const handleEffectChange = (effect: TextEffect) => {
    setActiveEffect(effect);

    if (effect.fontValue) {
        const newFont = fontOptions.find(f => f.value === effect.fontValue);
        if (newFont) {
            const newSize = typeof effect.style.fontSize === 'number' ? effect.style.fontSize : newFont.size;
            setActiveFont({ ...newFont, size: newSize });
        }
    } else if (typeof effect.style.fontSize === 'number') {
        setActiveFont(prevFont => ({...prevFont, size: effect.style.fontSize!}));
    }

    if (effect.id === 'none') {
        setTextShadowEnabled(false);
        setTextColor(pageInitialColors.textColor);
    } else {
        if (effect.style.color) {
            setTextColor(effect.style.color);
        }
        if (effect.style.textShadow) {
            setTextShadowEnabled(true);
            const finalShadowString = effect.style.textShadow
              .replace(/{{color}}/g, effect.style.color || textColor)
              .replace(/{{glow}}/g, effect.style.glowColor || effect.style.color || textColor);

            const parsedShadows = parseShadow(finalShadowString);
            setShadows(parsedShadows);
        } else {
            setTextShadowEnabled(false);
        }
    }
};

  const handleTextColorChange = (newColor: string) => {
    setTextColor(newColor);
    if (activeEffect && activeEffect.id !== 'none' && activeEffect.style.textShadow) {
      const finalShadowString = activeEffect.style.textShadow
        .replace(/{{color}}/g, newColor)
        .replace(/{{glow}}/g, activeEffect.style.glowColor || newColor);
      const newShadows = parseShadow(finalShadowString);
      setShadows(newShadows);
    }
  };
  
  const renderCanvas = useCallback((design: Design, index: number) => {
    let currentBg: string | undefined;
    let finalImageUrl: string | undefined;

    switch(backgroundType) {
        case "flat":
            currentBg = bgColor;
            finalImageUrl = undefined;
            break;
        case "gradient":
            currentBg = gradientBg;
            finalImageUrl = undefined;
            break;
        case "image":
            currentBg = imageBgUrl; 
            finalImageUrl = imageBgUrl;
            break;
        default:
            currentBg = bgColor;
            finalImageUrl = undefined;
            break;
    }
    
    return (
        <ImageCanvas
          isTitle={design.isTitle}
          fontFamily={activeFont.fontFamily}
          fontWeight={activeFont.weight}
          fontSize={activeFont.size}
          lineHeight={activeFont.lineHeight}
          text={design.text}
          textColor={textColor}
          textOpacity={textOpacity}
          backgroundColor={currentBg}
          backgroundImageUrl={finalImageUrl}
          width={canvasSize.width}
          height={canvasSize.height}
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
          fontSmoothing={activeEffect.style.fontSmoothing}
        />
    )
  }, [
    backgroundType, activeFont, bgColor, textColor, textOpacity, 
    gradientBg, imageBgUrl, rectBgColor, rectOpacity, overlayColor, 
    overlayOpacity, textAlign, isBold, isUppercase, textShadowEnabled, 
    shadows, textStroke, strokeColor, strokeWidth, handleTextRemaining, 
    isTextBoxEnabled, isOverlayEnabled, activeEffect, canvasSize
  ]);
  
  const handleMobileTabClick = (tab: string) => {
    if (isMobilePanelOpen && activeSettingsTab === tab) {
      closePanel();
    } else {
      setActiveSettingsTab(tab);
      setIsMobilePanelOpen(true);
    }
  }

 const handleDesktopTabClick = (tab: string) => {
    setActiveSettingsTab(tab);
    setIsSidebarOpen(true);
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setZoomLevel(prev => {
        const newZoom = direction === 'in' ? prev + ZOOM_STEP : prev - ZOOM_STEP;
        return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      e.preventDefault();
      document.body.style.cursor = 'grabbing';
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning && e.buttons === 1) {
      e.preventDefault();
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isPanning) {
      document.body.style.cursor = 'grab';
    }
  };

  const resetPanAndZoom = useCallback(() => {
    let newZoom;
    if (isMobile) {
        switch(canvasSize.name) {
            case 'Story': newZoom = 0.8; break;
            case 'Post': newZoom = 1.0; break;
            case 'Square': newZoom = 1.0; break;
            default: newZoom = 1.0; break;
        }
    } else {
        switch(canvasSize.name) {
            case 'Story': newZoom = 0.4; break;
            case 'Post': newZoom = 0.5; break;
            case 'Square': newZoom = 0.6; break;
            default: newZoom = 0.5; break;
        }
    }
    setZoomLevel(newZoom);
    setPanOffset({ x: 0, y: 0 });
  }, [isMobile, canvasSize]);

  useEffect(() => {
    if(isClient){
      resetPanAndZoom();
    }
  }, [isClient, canvasSize, resetPanAndZoom]);

  const handleCanvasSizeChange = (size: CanvasSize) => {
    setCanvasSize(size);
    resetPanAndZoom();
    if (size.name === 'Square') {
      setActiveFont(prevFont => ({...prevFont, size: 36}));
    } else {
      setActiveFont(prevFont => ({...prevFont, size: 48}));
    }
  }

  const renderActiveTabContent = () => {
    const props = {
        text, setText, handleGenerate, isLoading,
        backgroundTab, setBackgroundTab: setBackgroundTab as (value: string) => void, handleFeelLucky,
        bgColor, handleBgColorSelect, imageBgUrl, handleImageBgUrlSelect: (template: ImageTemplate) => handleImageBgUrlSelect(template),
        searchQuery, setSearchQuery, handleSearchImages, isSearching, searchedImages,
        handleKeywordSearch, searchPage, isOverlayEnabled, setIsOverlayEnabled: handleOverlayEnable,
        overlayColor, setOverlayColor, overlayOpacity, setOverlayOpacity, gradientBg,
        handleGradientBgSelect, setSearchCarouselApi, textColor, setTextColor: handleTextColorChange, textOpacity,
        setTextOpacity, activeFont, setActiveFont, fontOptions, isBold, setIsBold,
        isUppercase, setIsUppercase, textAlign, setTextAlign, textShadowEnabled,
        setTextShadowEnabled, shadows, setShadows, textStroke, setTextStroke,
        strokeColor, setStrokeColor, strokeWidth, setStrokeWidth, isTextBoxEnabled,
        setIsTextBoxEnabled: handleTextBoxEnable, rectBgColor, setRectBgColor, rectOpacity,
        setRectOpacity, activeEffect, setActiveEffect: handleEffectChange, designs, handleDownloadAll, currentSlide,
        handleDownload, fileName, setFileName, handleApplyTemplate, myDesigns: myDesigns || [],
        handleSaveDesign, handleDeleteDesign, handleUpdateDesign, editingDesignId,
        handleEditClick, handleCancelEdit, editingName, setEditingName, designToDelete,
        setDesignToDelete, handleLogDesign,
    };

    switch (activeSettingsTab) {
      case 'designs': return <DesignsPanel {...props} />;
      case 'favorites': return <MyDesignsPanel {...props} />;
      case 'background': return <BackgroundSettings {...props} />;
      case 'text': return <TextSettings {...props} />;
      case 'download': return <DownloadPanel {...props} />;
      default: return null;
    }
  };

  const settingsTabs = [
    { value: "designs", icon: <LayoutTemplate className="h-5 w-5"/>, label: "Templates" },
    { value: "background", icon: <ImageIcon className="h-5 w-5"/>, label: "Background" },
    { value: "text", icon: <Type className="h-5 w-5"/>, label: "Text" },
    { value: "favorites", icon: <HeartIcon className="h-5 w-5"/>, label: "Favorites" },
    { value: "download", icon: <Download className="h-5 w-5"/>, label: "Download" },
  ];
  
  const activeTabLabel = settingsTabs.find(tab => tab.value === activeSettingsTab)?.label;

  const renderBulletNavigation = () => {
    if (!carouselApi) return null;
    
    const totalSlides = designs.length;
    if (totalSlides <= 1) return null;

    const visibleDots = 7;
    const half = Math.floor(visibleDots / 2);

    let start = Math.max(currentSlide - half, 0);
    let end = start + visibleDots;

    if (end > totalSlides) {
      end = totalSlides;
      start = Math.max(end - visibleDots, 0);
    }
    
    const dots = [];
    for (let i = start; i < end; i++) {
        dots.push(
            <div
                key={i}
                data-active={i === currentSlide}
                onClick={() => carouselApi?.scrollTo(i)}
                className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
        );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-4">
        {start > 0 && (
          <>
            <div
              key={0}
              onClick={() => carouselApi?.scrollTo(0)}
              className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
            {start > 1 && <span className="text-foreground -translate-y-1">...</span>}
          </>
        )}
        {dots}
        {end < totalSlides && (
          <>
            {end < totalSlides - 1 && <span className="text-foreground -translate-y-1">...</span>}
            <div
              key={totalSlides - 1}
              onClick={() => carouselApi?.scrollTo(totalSlides - 1)}
              className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
          </>
        )}
      </div>
    );
  };
  
  if (!isClient || isUserLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
        background: 
        'linear-gradient(to top right, var(--primary), var(--secondary), var(--accent)'
      }}>
          <div className="w-64 h-64">
              <Lottie animationData={webflowAnimation} loop={true} />
          </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
        <Header 
          canvasSize={canvasSize}
          handleCanvasSizeChange={handleCanvasSizeChange}
          canvasSizes={canvasSizes}
          zoomLevel={zoomLevel}
          handleZoom={handleZoom}
          resetPanAndZoom={resetPanAndZoom}
          MIN_ZOOM={MIN_ZOOM}
          MAX_ZOOM={MAX_ZOOM}
        />
      <div className="flex-1 flex overflow-hidden">
        {/******************************************************
        *
        * DESKTOP SIDEBAR
        * This section is only visible on screens wider than 767px (md breakpoint).
        * It contains the main settings tabs and their content.
        *
        *******************************************************/}
        {designs.length > 0 && (
          <div className={cn("hidden md:flex flex-shrink-0 bg-sidebar transition-all duration-300 ease-in-out z-50", isSidebarOpen ? "w-[40vw]" : "w-[3vw]")}>
              <Tabs
                  orientation="vertical"
                  value={activeSettingsTab}
                  onValueChange={setActiveSettingsTab}
                  className="flex w-full"
              >
                  <div className="flex flex-col items-center p-0 space-y-2 bg-sidebar">
                      <TabsList className="flex flex-col h-full justify-start items-center p-0 bg-sidebar space-y-1">
                          {settingsTabs.map(tab => (
                              <TooltipProvider key={tab.value}>
                                  <Tooltip>
                                      <TooltipTrigger asChild>
                                          <TabsTrigger 
                                              value={tab.value} 
                                              className="w-12 h-12 data-[state=active]:bg-primary/20"
                                              onClick={() => handleDesktopTabClick(tab.value)}
                                          >
                                              {tab.icon}
                                          </TabsTrigger>
                                      </TooltipTrigger>
                                      {!isSidebarOpen && <TooltipContent side="right"><p>{tab.label}</p></TooltipContent>}
                                  </Tooltip>
                              </TooltipProvider>
                          ))}
                      </TabsList>
                  </div>
                  
                  {isSidebarOpen && (
                      <div className="flex-grow flex flex-col w-full bg-sidebar">
                          <div className="p-4 flex-shrink-0 flex justify-between items-center bg-sidebar">
                              <h3 className="text-lg font-semibold capitalize text-sidebar-foreground">{activeTabLabel}</h3>
                              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="h-8 w-8 rounded-full">
                                  <X className="h-5 w-5" />
                                  <span className="sr-only">Close Panel</span>
                              </Button>
                          </div>
                          <TabsContent value={activeSettingsTab} className="mt-0 flex-grow overflow-y-auto">
                              {renderActiveTabContent()}
                          </TabsContent>
                      </div>
                  )}
              </Tabs>
          </div>
        )}
        {/******************************************************
        *
        * END DESKTOP SIDEBAR
        *
        *******************************************************/}

        {/******************************************************
        *
        * Main Content Area
        *
        *******************************************************/}
        <main className={cn("flex-1 flex flex-col items-center justify-center overflow-hidden h-full p-4 relative")}>
          {isLoading ? (
             <div className="w-64 h-64">
                <Lottie animationData={webflowAnimation} loop={true} />
             </div>
          ) : designs.length === 0 ? (
            <div className="text-center text-muted-foreground">
                <p>No text found to generate designs.</p>
                <p>Please go back and enter some text.</p>
                <Button variant="link" asChild className="mt-4">
                    <Link href="/enter-text">Go to Text Input</Link>
                </Button>
            </div>
          ) : (
            <>
            <div 
              ref={designsRef} 
              className="w-full h-full flex flex-col items-center justify-center cursor-grab"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
               onWheel={(e) => {
                const activeElement = document.activeElement;
                if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
                  return;
                }
                e.preventDefault();
                const direction = e.deltaY > 0 ? 'out' : 'in';
                handleZoom(direction);
              }}
            >
                <div 
                  className="relative transition-transform duration-75" 
                  style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})` }}
                >
                  <Carousel className="w-full" setApi={setCarouselApi}>
                    <CarouselContent>
                      {designs.map((design, index) => (
                        <CarouselItem key={index} data-index={index}>
                          <div 
                            className="p-1 group relative"
                          >
                            <Card className="overflow-hidden border-0">
                              <CardContent className="p-0 relative bg-card" style={{ aspectRatio: `${canvasSize.width}/${canvasSize.height}`}}>
                                {renderCanvas(design, index)}
                              </CardContent>
                            </Card>
                            <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <AlertDialog>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-14 w-14 flex items-center justify-center rounded-full bg-gray/20 backdrop-blur-sm text-white hover:bg-red/50 hover:text-red-400 [&_svg]:size-8"
                                        >
                                          <Icons.HeartIconG className="h-12 w-12" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent side="left">
                                     <p>Save to Favorites</p>
                                    </TooltipContent>
                                  </Tooltip>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                  </Carousel>
                </div>
                
                {renderBulletNavigation()}

            </div>
            </>
          )}
        </main>
      </div>

      {isGeneratingAnimation && (
          <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
            background: 
            'linear-gradient(to top right,  var(--primary),  var(--secondary)'
          }}>
              <div className="w-64 h-64">
                  <Lottie animationData={webflowAnimation} loop={true} />
              </div>
          </div>
      )}

      {/******************************************************
      *
      * MOBILE TAB SYSTEM
      * This section is only visible on screens narrower than 768px (md breakpoint).
      * It uses a Sheet component to display settings from the bottom.
      *
      *******************************************************/}
      {isClient && designs.length > 0 && (
          <div ref={mobilePanelRef} className="md:hidden">
              <Sheet open={isMobilePanelOpen} onOpenChange={(isOpen) => {
                  if (!isOpen) {
                      setActiveSettingsTab('');
                  }
                  setIsMobilePanelOpen(isOpen);
              }}>
                  <SheetContent side="bottom" className="h-auto max-h-[40vh] p-0 flex flex-col bg-background">
                      <SheetHeader className="p-4 border-b flex-row justify-between items-center bg-background">
                          <SheetTitle className="capitalize">{activeTabLabel}</SheetTitle>
                      </SheetHeader>
                      <div className="flex-grow overflow-y-auto">
                          {renderActiveTabContent()}
                      </div>
                  </SheetContent>
              </Sheet>

              <div className={cn("fixed bottom-0 left-0 right-0 z-30 bg-background border-t", isMobilePanelOpen ? "hidden" : "block")}>
                  <Tabs value={activeSettingsTab ?? ''} className="w-full">
                      <TabsList className="grid w-full grid-cols-5 h-14 rounded-none bg-background">
                          {settingsTabs.map(tab => (
                              <TabsTrigger key={tab.value} value={tab.value} onClick={() => handleMobileTabClick(tab.value)}>
                                  {tab.icon}
                              </TabsTrigger>
                          ))}
                      </TabsList>
                  </Tabs>
              </div>
          </div>
      )}
      {/******************************************************
      *
      * END MOBILE TAB SYSTEM
      *
      *******************************************************/}
    </div>
  );
}

    

    
