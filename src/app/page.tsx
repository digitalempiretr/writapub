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
  { name: "Dark Ocean", css: "linear-gradient(to right, #373b44, #4286f4)" },
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

const defaultSolidColors = [
  '#000000', '#545454', '#737373', '#A6A6A6', '#B4B4B4', '#D9D9D9', '#FFFFFF',
  '#FF3131', '#FF5757', '#FF66C4', '#E2A9F1', '#CB6CE6', '#8C52FF', '#5E17EB',
  '#0097B2', '#0CC0DF', '#5CE1E6', '#38B6FF', '#5170FF', '#004AAD', '#1800AD',
  '#00BF63', '#7ED957', '#C1FF72', '#FFDE59', '#FFBD59', '#FF914D', '#FF751F'
];


const searchKeywords = ["Texture", "Background", "Wallpaper", "Nature", "Sea"];

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

  const [rectBgColor, setRectBgColor] = useState("#2C5364");
  const [rectOpacity, setRectOpacity] = useState(0);

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

  const handleGenerate = useCallback(async () => {
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
     if (designs.length > 0) {
      handleGenerate();
    }
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
        title: "Görsel Arama Başarısız",
        description: "Görseller aranırken bir hata oluştu. Lütfen API anahtarınızın doğru yapılandırıldığından emin olun.",
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

                <CardFooter className="flex-col items-start p-0 bg-[#f4fdff]">
                    <Tabs defaultValue="background" className="w-full">
                      <TabsList className="grid w-full grid-cols-3 bg-card text-card-foreground p-2">
                        <TabsTrigger value="background"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Zm140-360q25 0 42.5-17.5T400-620q0-25-17.5-42.5T340-680q-25 0-42.5 17.5T280-620q0 25 17.5 42.5T340-560Z"/></svg></TabsTrigger>
                        <TabsTrigger value="text"><Type /></TabsTrigger>
                        <TabsTrigger value="download"><Download /></TabsTrigger>
                      </TabsList>
                      <TabsContent value="background">
                        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
                          <Label>Arka Plan</Label>
                          <Tabs value={backgroundTab} onValueChange={setBackgroundTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="flat">Düz Renk</TabsTrigger>
                              <TabsTrigger value="gradient">Gradyan</TabsTrigger>
                              <TabsTrigger value="image">Görsel</TabsTrigger>
                            </TabsList>
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
                              
                              <div className="space-y-2">
                                <Label>İlham Veren Temalar</Label>
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
                                  placeholder="Görsel ara..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleSearchImages(1)}
                                />
                                <Button onClick={() => handleSearchImages(1)} disabled={isSearching} size="icon">
                                  {isSearching && searchPage === 1 ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <Search className="h-4 w-4" />
                                  )}
                                </Button>
                                 <Button onClick={handleFeelLucky} size="icon" variant="outline" >
                                  <Dice5 className="h-4 w-4" />
                                </Button>
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
                                    {isSearching && searchPage > 1 ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daha Fazla"}
                                </Button>
                                </>
                              )}
                            </TabsContent>
                          </Tabs>
                        </div>
                      </TabsContent>
                      <TabsContent value="text">
                        <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
                          <div className="flex flex-col gap-y-4">
                            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2">
                              {/* Metin Rengi */}
                              <div className="relative">
                                <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: textColor }} />
                                <Input
                                  type="color"
                                  value={textColor}
                                  onChange={(e) => setTextColor(e.target.value)}
                                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                />
                              </div>

                              {/* Yazı Tipi Seçimi */}
                              <Select value={activeFont.value} onValueChange={handleFontChange}>
                                <SelectTrigger className="w-full border-0">
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

                              {/* Hizalama */}
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
                            <div className="grid grid-cols-[auto_1fr] items-center gap-x-2">
                              {/* Metin Kutusu Rengi */}
                              <div className="relative">
                                <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: rectBgColor }} />
                                <Input
                                  type="color"
                                  value={rectBgColor}
                                  onChange={(e) => setRectBgColor(e.target.value)}
                                  className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                                />
                              </div>
                              {/* Opaklık */}
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" size="icon">
                                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h200v720H200Zm280 0q-17 0-28.5-11.5T440-160q0-17 11.5-28.5T480-200q17 0 28.5 11.5T520-160q0 17-11.5 28.5T480-120Zm0-160q-17 0-28.5-11.5T440-320q0-17 11.5-28.5T480-360q17 0 28.5 11.5T520-320q0 17-11.5 28.5T480-280Zm0-160q-17 0-28.5-11.5T440-480q0-17 11.5-28.5T480-520q17 0 28.5 11.5T520-480q0 17-11.5 28.5T480-440Zm0-160q-17 0-28.5-11.5T440-640q0-17 11.5-28.5T480-680q17 0 28.5 11.5T520-640q0 17-11.5 28.5T480-600Zm0-160q-17 0-28.5-11.5T440-800q0-17 11.5-28.5T480-840q17 0 28.5 11.5T520-800q0 17-11.5 28.5T480-760Zm80 560q-17 0-28.5-11.5T520-240q0-17 11.5-28.5T560-280q17 0 28.5 11.5T600-240q0 17-11.5 28.5T560-200Zm0-160q-17 0-28.5-11.5T520-400q0-17 11.5-28.5T560-440q17 0 28.5 11.5T600-400q0 17-11.5 28.5T560-360Zm0-160q-17 0-28.5-11.5T520-560q0-17 11.5-28.5T560-600q17 0 28.5 11.5T600-560q0 17-11.5 28.5T560-520Zm0-160q-17 0-28.5-11.5T520-720q0-17 11.5-28.5T560-760q17 0 28.5 11.5T600-720q0 17-11.5 28.5T560-680Zm80 560q-17 0-28.5-11.5T600-160q0-17 11.5-28.5T640-200q17 0 28.5 11.5T680-160q0 17-11.5 28.5T640-120Zm0-160q-17 0-28.5-11.5T600-320q0-17 11.5-28.5T640-360q17 0 28.5 11.5T680-320q0 17-11.5 28.5T640-280Zm0-160q-17 0-28.5-11.5T600-480q0-17 11.5-28.5T640-520q17 0 28.5 11.5T680-480q0 17-11.5 28.5T640-440Zm0-160q-17 0-28.5-11.5T600-640q0-17 11.5-28.5T640-680q17 0 28.5 11.5T680-640q0 17-11.5 28.5T640-600Zm0-160q-17 0-28.5-11.5T600-800q0-17 11.5-28.5T640-840q17 0 28.5 11.5T680-800q0 17-11.5 28.5T640-760Zm80 560q-17 0-28.5-11.5T680-240q0-17 11.5-28.5T720-280q17 0 28.5 11.5T760-240q0 17-11.5 28.5T720-200Zm0-160q-17 0-28.5-11.5T680-400q0-17 11.5-28.5T720-440q17 0 28.5 11.5T760-400q0 17-11.5 28.5T720-360Zm0-160q-17 0-28.5-11.5T680-560q0-17 11.5-28.5T720-600q17 0 28.5 11.5T760-560q0 17-11.5 28.5T720-520Zm0-160q-17 0-28.5-11.5T680-720q0-17 11.5-28.5T720-760q17 0 28.5 11.5T760-720q0 17-11.5 28.5T720-680Zm80 560q-17 0-28.5-11.5T760-160q0-17 11.5-28.5T800-200q17 0 28.5 11.5T840-160q0 17-11.5 28.5T800-120Zm0-160q-17 0-28.5-11.5T760-320q0-17 11.5-28.5T800-360q17 0 28.5 11.5T840-320q0 17-11.5 28.5T800-280Zm0-160q-17 0-28.5-11.5T760-480q0-17 11.5-28.5T800-520q17 0 28.5 11.5T840-480q0 17-11.5 28.5T800-440Zm0-160q-17 0-28.5-11.5T760-640q0-17 11.5-28.5T800-680q17 0 28.5 11.5T840-640q0 17-11.5 28.5T800-600Zm0-160q-17 0-28.5-11.5T760-800q0-17 11.5-28.5T800-840q17 0 28.5 11.5T840-800q0 17-11.5 28.5T800-760Z"/></svg>
                                  </Button>
                                </PopoverTrigger>
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
                                Tümünü İndir
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDownload(currentSlide)}
                              >
                                <Download className="mr-2 h-4 w-4" />
                                Bu Tasarımı İndir
                              </Button>
                            </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                </CardFooter>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
