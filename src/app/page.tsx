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
import { AlignCenter, AlignJustify, AlignLeft, AlignRight, ArrowUp, Download, Loader2, Palette, PanelTop, Search, Type } from "lucide-react";
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from "react";
import { CardTitle } from "@/components/ui/card";
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';

type Design = {
  text: string;
  isTitle: boolean;
};

type TextAlign = 'left' | 'center' | 'right';


const fontOptions: FontOption[] = [
    { value: 'anton', label: 'Anton', fontFamily: 'Anton', bodyWeight: '400', titleWeight: '400', titleSize: 100, bodySize: 58, lineHeight: 74 },
    { value: 'bree-serif', label: 'Bree Serif', fontFamily: 'Bree Serif', bodyWeight: '400', titleWeight: '400', titleSize: 84, bodySize: 50, lineHeight: 68 },
    { value: 'catamaran', label: 'Catamaran', fontFamily: 'Catamaran', bodyWeight: '400', titleWeight: '700', titleSize: 90, bodySize: 50, lineHeight: 68 },
    { value: 'dosis', label: 'Dosis', fontFamily: 'Dosis', bodyWeight: '400', titleWeight: '700', titleSize: 88, bodySize: 52, lineHeight: 68 },
    { value: 'exo-2', label: 'Exo 2', fontFamily: 'Exo 2', bodyWeight: '400', titleWeight: '700', titleSize: 84, bodySize: 48, lineHeight: 64 },
    { value: 'inter', label: 'Inter', fontFamily: 'Inter', bodyWeight: '600', titleWeight: '600', titleSize: 80, bodySize: 52, lineHeight: 70 },
    { value: 'josefin-sans', label: 'Josefin Sans', fontFamily: 'Josefin Sans', bodyWeight: '400', titleWeight: '700', titleSize: 80, bodySize: 48, lineHeight: 64 },
    { value: 'lato', label: 'Lato', fontFamily: 'Lato', bodyWeight: '400', titleWeight: '700', titleSize: 80, bodySize: 48, lineHeight: 64 },
    { value: 'lobster', label: 'Lobster', fontFamily: 'Lobster', bodyWeight: '400', titleWeight: '400', titleSize: 92, bodySize: 54, lineHeight: 72 },
    { value: 'open-sans', label: 'Open Sans', fontFamily: 'Open Sans', bodyWeight: '400', titleWeight: '700', titleSize: 80, bodySize: 48, lineHeight: 64 },
    { value: 'oswald', label: 'Oswald', fontFamily: 'Oswald', bodyWeight: '400', titleWeight: '700', titleSize: 86, bodySize: 46, lineHeight: 62 },
    { value: 'oxygen', label: 'Oxygen', fontFamily: 'Oxygen', bodyWeight: '400', titleWeight: '700', titleSize: 80, bodySize: 48, lineHeight: 64 },
    { value: 'playfair-display', label: 'Playfair Display', fontFamily: 'Playfair Display', bodyWeight: '700', titleWeight: '700', titleSize: 90, bodySize: 52, lineHeight: 70 },
    { value: 'plus-jakarta-sans', label: 'Plus Jakarta Sans', fontFamily: 'Plus Jakarta Sans', bodyWeight: '400', titleWeight: '700', titleSize: 80, bodySize: 48, lineHeight: 64 },
    { value: 'raleway', label: 'Raleway', fontFamily: 'Raleway', bodyWeight: '400', titleWeight: '700', titleSize: 80, bodySize: 48, lineHeight: 64 },
    { value: 'roboto', label: 'Roboto', fontFamily: 'Roboto', bodyWeight: '400', titleWeight: '700', titleSize: 82, bodySize: 48, lineHeight: 64 },
    { value: 'roboto-slab', label: 'Roboto Slab', fontFamily: 'Roboto Slab', bodyWeight: '400', titleWeight: '700', titleSize: 78, bodySize: 46, lineHeight: 64 },
    { value: 'slabo-27px', label: 'Slabo 27px', fontFamily: 'Slabo 27px', bodyWeight: '400', titleWeight: '400', titleSize: 88, bodySize: 50, lineHeight: 68 },
    { value: 'special-elite', label: 'Special Elite', fontFamily: 'Special Elite', bodyWeight: '400', titleWeight: '400', titleSize: 72, bodySize: 50, lineHeight: 68 },
    { value: 'titillium-web', label: 'Titillium Web', fontFamily: 'Titillium Web', bodyWeight: '400', titleWeight: '700', titleSize: 82, bodySize: 46, lineHeight: 62 },
    { value: 'ubuntu', label: 'Ubuntu', fontFamily: 'Ubuntu', bodyWeight: '400', titleWeight: '700', titleSize: 80, bodySize: 48, lineHeight: 64 },
];


const gradientTemplates = [
  { name: "Sunrise", css: "linear-gradient(to top right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Ocean", css: "linear-gradient(to top right, #2E3192 0%, #1BFFFF 100%)" },
  { name: "Sunset", css: "linear-gradient(to top right, #F3904F 0%, #3B4371 100%)" },
  { name: "Forest", css: "linear-gradient(to top right, #13547a 0%, #80d0c7 100%)" },
  { name: "Royal", css: "linear-gradient(to top right, #473B7B 0%, #3584A7 50%, #30D2BE 100%)" },
  { name: "Mojito", css: "linear-gradient(to top, #1d976c, #93f9b9)" },
  { name: "Cherry", css: "linear-gradient(to top, #eb3349, #f45c43)" },
  { name: "Pinky", css: "linear-gradient(to top, #dd5e89, #f7bb97)" },
  { name: "Purple", css: "linear-gradient(to top right, #6a11cb 0%, #2575fc 100%)" },
  { name: "Sky", css: "linear-gradient(to top right, #4facfe 0%, #00f2fe 100%)" },
  { name: "Fire", css: "linear-gradient(to top right, #f12711 0%, #f5af19 100%)" },
  { name: "Aqua", css: "linear-gradient(to top right, #1a2980 0%, #26d0ce 100%)" },
  { name: "Peach", css: "linear-gradient(to right, #ffecd2 0%, #fcb69f 100%)" },
  { name: "Violet", css: "linear-gradient(to right, #8e2de2, #4a00e0)" },
  { name: "Emerald", css: "linear-gradient(to right, #348f50, #56b4d3)" },
  { name: "Steel", css: "linear-gradient(to right, #65799b, #5e2563)" },
  { name: "Cosmic", css: "linear-gradient(to right, #ff00cc, #333399)" },
];

const imageTemplates = [
    { name: "Parchment", imageUrl: "https://picsum.photos/seed/paper/1080/1350" },
    { name: "Dark Wood", imageUrl: "https://picsum.photos/seed/darkwood/1080/1350" },
    { name: "Marble", imageUrl: "https://picsum.photos/seed/marble/1080/1350" },
    { name: "Concrete", imageUrl: "https://picsum.photos/seed/concrete/1080/1350" },
    { name: "Abstract", imageUrl: "https://picsum.photos/seed/abstract/1080/1350" },
];

const defaultText = `BİR İŞ NASIL YAPILMAZ kursları açılıyor! Usta kadrosu ile Büyükşehir herhalde Komek vasıtası ile öğretir artık!
Yahu 20 kere yaptığınız Mistik Müzik Festivalimizin içine etmek değilse bu nedir?
@mistikmuzikfestivali için şehrimize gelecek turistlere 100 kere kusura bakmayın bilmiyoruz demek zorunda kaldık.
Festivale hepi topu 10 gün var! Halen biletler satışa çıkmadı.
Yahu dünyanın öbür ucundan gelecek adam!
Bilet alamazsa neden gelsin?
Soruyorum size? Sayın @u_ibrahim_altay başkanım.
Ekibiniz gerçekten siz sponsor olurken bu işleri baltalamıyor mu?
Yazık değil mi?
Bir organizasyonun biletleri neden geçen seneden satışa
sunulmaz hadi seneyi bırak bir iki ay öncesinden neden satılmaz?
Kültür müdürlüğünü arıyoruz bilgileri yok!
Büyükşehir yapıyormuş!
Ben hayatımda duymadım böyle bir şey!
Biletinial a tıklıyorsun böyle bir etkinlik yok!
Yapacaksanız yapın!
Yapmayacaksanız bizlerin ekmeği ile oynamayın!
Gerçekten kim yapıyor bu işi???
Bu hatanın sahibini bulun başkanım!
Her şeyi kendisi yapmaya hevesli bu arkadaşlar kimse bi ders verin!
Onlarca rezervasyonu iptal ettim bugün!
Müşteri bilet yok diyor!
Anlatamıyoruz.
Mistik müzik festivali turizmcilere sorsanız şebi arus gibi  önemli bizler için!
Kimse kusura bakmasın.
Turizm planlama ister. Siz seyahat ederken plan yapmıyor musunuz?`;

export default function Home() {
  const [text, setText] = useState(defaultText);
  const [title, setTitle] = useState("");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isGeneratingAnimation, setIsGeneratingAnimation] = useState(false);


  useEffect(() => {
    setIsClient(true)
  }, [])

  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions.find(f => f.value === 'special-elite') || fontOptions[0]);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [backgroundTab, setBackgroundTab] = useState("flat");
  const [bgColor, setBgColor] = useState("#f4fdff");
  const [textColor, setTextColor] = useState("#172554");
  const [gradientBg, setGradientBg] = useState(gradientTemplates[0].css);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[0].imageUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [rectBgColor, setRectBgColor] = useState("#f4fdff");
  const [rectOpacity, setRectOpacity] = useState(0.9);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const designsRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleTextRemaining = useCallback((remaining: string, fromIndex: number) => {
    if (remaining) {
      setDesigns(prevDesigns => {
        // Only add a new design if it's from the last canvas.
        if (fromIndex === prevDesigns.length - 1) {
          // And also check if the next design doesn't already have this text.
          const nextDesign = prevDesigns[fromIndex + 1];
          if (!nextDesign || nextDesign.text !== remaining) {
            return [...prevDesigns, { text: remaining, isTitle: false }];
          }
        }
        return prevDesigns;
      });
    }
  }, []);

  const handleGenerate = async () => {
    if (!text && !title) {
      toast({
        title: "Metin Girilmedi",
        description: "Lütfen bir başlık veya köşe yazısı metni girin.",
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

    // Show animation for 3 seconds, then reveal content and scroll
    setTimeout(() => {
        setIsGeneratingAnimation(false);
        setIsLoading(false);
        if(designsRef.current) {
            designsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 3000);
  };
  
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

  const handleSearchImages = async () => {
    if (!searchQuery) return;
    setIsSearching(true);
    setSearchedImages([]);
    try {
      const result = await findImages({ query: searchQuery });
      setSearchedImages(result.imageUrls);
    } catch (error) {
      console.error(error);
      toast({
        title: "Görsel Arama Başarısız",
        description: "Görseller aranırken bir hata oluştu. Lütfen API anahtarınızın doğru yapılandırıldığından emin olun.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
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
          key={`${backgroundTab}-${activeFont.value}-${bgColor}-${textColor}-${gradientBg}-${imageBgUrl}-${rectBgColor}-${rectOpacity}-${index}-${design.text}-${textAlign}`}
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
          textAlign={textAlign}
        />
    )
  }, [backgroundTab, activeFont, bgColor, textColor, gradientBg, imageBgUrl, handleTextRemaining, rectBgColor, rectOpacity, textAlign]);

  return (
    <>
      <header className="w-full text-left p-4 md:p-8 h-[10vh] flex items-center">
        <Logo className="text-[2rem]" />
      </header>

      <main className="container mx-auto p-4 md:p-8 pt-0 flex flex-col h-[90vh]">
        <div className="flex-grow flex items-center justify-center">
            <div className="space-y-6 max-w-[800px] mx-auto w-full">
              <CardTitle className="text-primary-foreground">Creative Magic</CardTitle>
              <div className="space-y-4">
                  <Textarea
                  id="text"
                  placeholder="Metninizi buraya yapıştırın..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                  className="bg-[#2C5364] text-primary-foreground placeholder:text-gray-400 border-0"
                  />
                  <div className="flex items-center justify-end gap-4">
                     <p className="text-xs text-muted-foreground">{text.length} karakter</p>
                     <Button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        size="icon"
                        className="rounded-full bg-[#2C5364] hover:bg-[#203a43]"
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
              background: 'linear-gradient(to bottom, #2c5364, #203a43, #0f2027)'
            }}>
                <div className="w-64 h-64">
                    <Lottie animationData={webflowAnimation} loop={true} />
                </div>
            </div>
        )}

        { isClient && designs.length > 0 && (
          <div className="w-full pt-8 pb-8">
            <div ref={designsRef} className="text-2xl h-10 pt-1 text-[#f4fdff]">Reels</div>
            <div className="max-w-[800px] mx-auto w-full space-y-6">
                <Carousel className="w-full max-w-lg mx-auto" setApi={(api) => api?.reInit()}>
                  <CarouselContent>
                    {designs.map((design, index) => (
                      <CarouselItem key={index} data-index={index}>
                        <div className="p-1">
                          <Card className="overflow-hidden border-0">
                            <CardContent className="p-0 aspect-[1080/1350] relative bg-card">
                              {renderCanvas(design, index)}
                            </CardContent>
                            <CardFooter className="flex-col items-start p-0">
                                <Tabs defaultValue="background" className="w-full">
                                  <TabsList className="grid w-full grid-cols-4 bg-card text-card-foreground p-2">
                                    <TabsTrigger value="background"><Palette /></TabsTrigger>
                                    <TabsTrigger value="text"><Type /></TabsTrigger>
                                    <TabsTrigger value="layout"><PanelTop /></TabsTrigger>
                                    <TabsTrigger value="download"><Download /></TabsTrigger>
                                  </TabsList>
                                  <TabsContent value="background" className="p-4 bg-card-foreground/5 rounded-b-lg">
                                    <div className="space-y-4">
                                      <Label className="text-foreground">Arka Plan</Label>
                                      <Tabs value={backgroundTab} onValueChange={setBackgroundTab} className="w-full">
                                        <TabsList className="grid w-full grid-cols-3">
                                          <TabsTrigger value="flat">Düz Renk</TabsTrigger>
                                          <TabsTrigger value="gradient">Gradyan</TabsTrigger>
                                          <TabsTrigger value="image">Görsel</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="flat" className="pt-4 space-y-4">
                                          <div className="flex items-center gap-4">
                                            <Label className="text-foreground">Arka Plan:</Label>
                                            <Input
                                              type="color"
                                              value={bgColor}
                                              onChange={(e) => setBgColor(e.target.value)}
                                              className="h-9 w-12 p-0 border-0 bg-transparent shadow-none"
                                            />
                                            <Input
                                              type="text"
                                              value={bgColor}
                                              onChange={(e) => setBgColor(e.target.value)}
                                              className="h-9 w-32"
                                            />
                                          </div>
                                        </TabsContent>
                                        <TabsContent value="gradient" className="pt-4 space-y-4">
                                          <Carousel className="w-full" setApi={(api) => api?.reInit()}>
                                            <CarouselContent>
                                              {gradientTemplates.map((gradient) => (
                                                <CarouselItem key={gradient.name} className="basis-1/3">
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
                                          <Carousel className="w-full" setApi={(api) => api?.reInit()}>
                                            <CarouselContent>
                                              {imageTemplates.map((image) => (
                                                <CarouselItem key={image.name} className="basis-1/3">
                                                  <Card className="overflow-hidden cursor-pointer" onClick={() => setImageBgUrl(image.imageUrl)}>
                                                    <CardContent className="h-32 relative">
                                                      <Image src={image.imageUrl} alt={image.name} fill className="object-cover" />
                                                    </CardContent>
                                                  </Card>
                                                </CarouselItem>
                                              ))}
                                            </CarouselContent>
                                            <CarouselPrevious className="-left-4" />
                                            <CarouselNext className="-right-4" />
                                          </Carousel>

                                          <div className="flex items-center space-x-2">
                                            <Input
                                              type="text"
                                              placeholder="Görsel ara..."
                                              value={searchQuery}
                                              onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                            <Button onClick={handleSearchImages} disabled={isSearching}>
                                              {isSearching ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                              ) : (
                                                <Search className="h-4 w-4" />
                                              )}
                                            </Button>
                                          </div>

                                          {searchedImages.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2">
                                              {searchedImages.map((imageUrl, index) => (
                                                <button key={index} onClick={() => setImageBgUrl(imageUrl)}>
                                                  <Image src={imageUrl} alt={`Search Result ${index}`} width={200} height={250} className="object-cover aspect-[2/3] rounded-md" />
                                                </button>
                                              ))}
                                            </div>
                                          )}
                                        </TabsContent>
                                      </Tabs>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="text" className="p-4 bg-card-foreground/5 rounded-b-lg space-y-4">
                                    <div className="flex items-center gap-4">
                                      <div className="flex items-center gap-2">
                                        <div className="text-foreground font-bold text-lg leading-none">
                                          <span className="inline-block border-b-2 border-current">A</span>
                                        </div>
                                        <div className="relative">
                                          <div
                                            className="w-6 h-6 rounded-full border"
                                            style={{ backgroundColor: textColor }}
                                          />
                                          <Input
                                            type="color"
                                            value={textColor}
                                            onChange={(e) => setTextColor(e.target.value)}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                          />
                                        </div>
                                      </div>

                                      <Select value={activeFont.value} onValueChange={handleFontChange}>
                                        <SelectTrigger className="w-auto flex-grow border-0">
                                          <SelectValue placeholder="Yazı Tipi Seçin" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {fontOptions.map((font) => (
                                            <SelectItem key={font.value} value={font.value}>
                                              {font.label}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button variant="outline" size="icon">
                                            {textAlign === 'left' && <AlignLeft className="h-4 w-4" />}
                                            {textAlign === 'center' && <AlignCenter className="h-4 w-4" />}
                                            {textAlign === 'right' && <AlignRight className="h-4 w-4" />}
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem onClick={() => setTextAlign('left')}>
                                            <AlignLeft className="mr-2 h-4 w-4" />
                                            <span>Sola Hizala</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => setTextAlign('center')}>
                                            <AlignCenter className="mr-2 h-4 w-4" />
                                            <span>Ortala</span>
                                          </DropdownMenuItem>
                                          <DropdownMenuItem onClick={() => setTextAlign('right')}>
                                            <AlignRight className="mr-2 h-4 w-4" />
                                            <span>Sağa Hizala</span>
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="layout" className="p-4 bg-card-foreground/5 rounded-b-lg space-y-4">
                                     <div className="space-y-2">
                                        <Label htmlFor="rectBgColor" className="text-foreground">Zemin Rengi</Label>
                                        <div className="flex items-center gap-4">
                                          <Input
                                            type="color"
                                            id="rectBgColor"
                                            value={rectBgColor}
                                            onChange={(e) => setRectBgColor(e.target.value)}
                                            className="h-9 w-12 p-0 border-0 bg-transparent shadow-none"
                                          />
                                          <Input
                                            type="text"
                                            id="rectBgColorText"
                                            value={rectBgColor}
                                            onChange={(e) => setRectBgColor(e.target.value)}
                                            className="h-9 w-32"
                                          />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                      <Label htmlFor="rectOpacity" className="text-foreground">Zemin Opaklığı</Label>
                                      <Slider
                                        id="rectOpacity"
                                        max={1}
                                        min={0}
                                        step={0.05}
                                        value={[rectOpacity]}
                                        onValueChange={(value) => setRectOpacity(value[0])}
                                      />
                                    </div>
                                  </TabsContent>
                                  <TabsContent value="download" className="p-4 bg-card-foreground/5 rounded-b-lg space-y-4">
                                      <div className="flex justify-around items-center">
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={handleDownloadAll}
                                          disabled={designs.length === 0}
                                        >
                                          <Download className="mr-2 h-4 w-4" />
                                          Tümünü İndir
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() => handleDownload(index)}
                                        >
                                          <Download className="mr-2 h-4 w-4" />
                                          Bu Tasarımı İndir
                                        </Button>
                                      </div>
                                  </TabsContent>
                                </Tabs>
                            </CardFooter>
                          </Card>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="-left-4 md:-left-12" />
                  <CarouselNext className="-right-4 md:-right-12" />
                </Carousel>
              
            </div>
          </div>
        )}
      </main>
    </>
  );
}
