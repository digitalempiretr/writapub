"use client";

import { automaticallySplitTextIntoParagraphs } from "@/ai/flows/automatically-split-text-into-paragraphs";
import { suggestContrastingColorSchemes } from "@/ai/flows/suggest-contrasting-color-schemes";
import { findImages } from "@/ai/flows/find-images-flow";
import { ImageCanvas, type FontOption } from "@/components/image-canvas";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Download, Loader2, Search, Wand2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from 'next/image';

type Design = {
  paragraph: string;
};

const fontOptions: FontOption[] = [
  {
    value: "plus-jakarta-sans",
    label: "Plus Jakarta Sans",
    titleFont: "Plus Jakarta Sans",
    bodyFont: "Plus Jakarta Sans",
    bodyWeight: "400",
    titleWeight: "700",
    titleSize: 80,
    bodySize: 48,
    lineHeight: 64,
  },
  {
    value: "playfair-display",
    label: "Playfair Display",
    titleFont: "Playfair Display",
    bodyFont: "Playfair Display",
    bodyWeight: "700",
    titleWeight: "700",
    titleSize: 90,
    bodySize: 52,
    lineHeight: 70,
  },
  {
    value: "inter",
    label: "Inter",
    titleFont: "Inter",
    bodyFont: "Inter",
    bodyWeight: "600",
    titleWeight: "600",
    titleSize: 80,
    bodySize: 52,
    lineHeight: 70,
  },
  {
    value: "special-elite",
    label: "Special Elite",
    titleFont: "Special Elite",
    bodyFont: "Special Elite",
    bodyWeight: "400",
    titleWeight: "400",
    titleSize: 72,
    bodySize: 50,
    lineHeight: 68,
  },
];

const gradientTemplates = [
  { name: "Sunrise", css: "linear-gradient(to top right, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)" },
  { name: "Ocean", css: "linear-gradient(to top right, #2E3192 0%, #1BFFFF 100%)" },
  { name: "Sunset", css: "linear-gradient(to top right, #F3904F 0%, #3B4371 100%)" },
  { name: "Forest", css: "linear-gradient(to top right, #13547a 0%, #80d0c7 100%)" },
  { name: "Royal", css: "linear-gradient(to top right, #473B7B 0%, #3584A7 50%, #30D2BE 100%)" },
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
  const [isLoadingColors, setIsLoadingColors] = useState(false);
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions[0]);
  const [designTab, setDesignTab] = useState("flat");
  const [bgColor, setBgColor] = useState("#E8F0FE");
  const [textColor, setTextColor] = useState("#172554");
  const [gradientBg, setGradientBg] = useState(gradientTemplates[0].css);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[0].imageUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);


  const [colorSchemes, setColorSchemes] = useState<{backgroundColor: string, textColor: string}[]>([]);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const { toast } = useToast();

  const manuallySplitText = (text: string, title: string) => {
    const MIN_LENGTH = 300;
    const MAX_LENGTH = 350;
    const paragraphs = [];
    let currentText = text.replace(/\\n/g, ' ').replace(/\\s+/g, ' ').trim();
  
    let derivedTitle = title;
    let titleCreated = false;
    if (!derivedTitle && currentText.length > 0) {
      const firstSentenceEnd = currentText.search(/[.!?]/);
      if (firstSentenceEnd !== -1) {
        derivedTitle = currentText.substring(0, firstSentenceEnd + 1).trim();
        currentText = currentText.substring(firstSentenceEnd + 1).trim();
      } else {
        const approxTitleEnd = currentText.indexOf(' ', 50);
        if(approxTitleEnd !== -1) {
            derivedTitle = currentText.substring(0, approxTitleEnd).trim() + '...';
            currentText = currentText.substring(approxTitleEnd).trim();
        } else {
            derivedTitle = currentText;
            currentText = "";
        }
      }
      titleCreated = true;
    }

    while (currentText.length > 0) {
      if (currentText.length <= MAX_LENGTH) {
        paragraphs.push(currentText);
        break;
      }
  
      let splitPos = -1;
      for (let i = MAX_LENGTH; i >= MIN_LENGTH; i--) {
        if ('.!?'.includes(currentText[i])) {
          splitPos = i + 1;
          break;
        }
      }

      if (splitPos === -1) {
        for (let i = MAX_LENGTH; i >= MIN_LENGTH; i--) {
          if (currentText[i] === ' ') {
            splitPos = i;
            break;
          }
        }
      }
      
      if (splitPos === -1) {
        splitPos = MAX_LENGTH;
      }

      paragraphs.push(currentText.substring(0, splitPos).trim());
      currentText = currentText.substring(splitPos).trim();
    }
  
    return {
      title: derivedTitle || '',
      paragraphs: paragraphs.filter(p => p.length > 0),
    };
  }

  const handleGenerate = async () => {
    if (!text) {
      toast({
        title: "Metin Girilmedi",
        description: "Lütfen bir köşe yazısı metni girin.",
        variant: "destructive",
      });
      return;
    }
    setIsLoading(true);
    setDesigns([]);
    try {
      const { title: resultTitle, paragraphs } = manuallySplitText(text, title);

      const newDesigns: Design[] = [];
      if(resultTitle) {
        newDesigns.push({ paragraph: resultTitle.toUpperCase() });
      }
      paragraphs.forEach(p => {
        newDesigns.push({ paragraph: p });
      });

      setDesigns(newDesigns);

      if (newDesigns.length === 0) {
        toast({
          title: "Tasarım Oluşturulamadı",
          description: "Metin paragraflara bölünemedi. Lütfen daha uzun bir metin deneyin.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Bir Hata Oluştu",
        description:
          "Tasarım oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };
  
  const handleDownload = (index: number) => {
    const canvas = canvasRefs.current[index];
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `post-weaver-${index + 1}.jpg`;
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

  const handleBgColorChange = async (color: string) => {
    setBgColor(color);
    setIsLoadingColors(true);
    setColorSchemes([]);
    try {
      const schemes = await suggestContrastingColorSchemes({ baseBackgroundColor: color });
      setColorSchemes(schemes.colorSchemes);
    } catch(e) {
      console.error(e);
      toast({
        title: "Renk Şemaları Alınamadı",
        description: "AI renk önerileri getirilemedi. Lütfen varsayılan renkleri kullanın.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingColors(false);
    }
  };

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
        description: "Görseller aranırken bir hata oluştu. Lütfen API anahtarınızın ve Özel Arama Motoru Kimliğinizin doğru yapılandırıldığından emin olun.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const renderCanvas = useCallback((design: Design, index: number) => {
    let currentBg: string | undefined;
    let imageUrl: string | undefined;

    switch(designTab) {
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
          key={`${designTab}-${activeFont.value}-${bgColor}-${textColor}-${gradientBg}-${imageBgUrl}-${index}-${design.paragraph}`}
          font={activeFont}
          text={design.paragraph}
          textColor={textColor}
          backgroundColor={currentBg}
          backgroundImageUrl={imageUrl}
          width={1080}
          height={1350}
          onCanvasReady={(canvas) => {
            canvasRefs.current[index] = canvas;
          }}
        />
    )
  }, [designTab, activeFont, bgColor, textColor, gradientBg, imageBgUrl]);

  const showColorSuggestions = designTab === 'flat' && colorSchemes.length > 0;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-center mb-10">
        <div className="flex items-center justify-center gap-4 mb-2">
          <Logo className="w-12 h-12 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary">Post Weaver</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Köşe Yazılarınızı Göz Alıcı Instagram Paylaşımlarına Dönüştürün
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Card className="lg:col-span-4 xl:col-span-3 sticky top-8">
          <CardHeader>
            <CardTitle>İçerik &amp; Tasarım</CardTitle>
            <CardDescription>
              Metninizi girin ve tasarım ayarlarınızı yapın.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Başlık (İsteğe Bağlı)</Label>
              <Input
                id="title"
                placeholder="Paylaşım başlığı"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Köşe Yazısı Metni</Label>
              <Textarea
                id="text"
                placeholder="Metninizi buraya yapıştırın..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground text-right">{text.length} karakter</p>
            </div>
             <div className="space-y-4">
              <Label>Yazı Tipi</Label>
              <Select onValueChange={handleFontChange} defaultValue={activeFont.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Bir yazı tipi seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {fontOptions.map(font => (
                      <SelectItem key={font.value} value={font.value}>{font.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
             <div className="space-y-4">
              <Label>Arka Plan</Label>
              <Tabs value={designTab} onValueChange={setDesignTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="flat">Düz Renk</TabsTrigger>
                  <TabsTrigger value="gradient">Gradyan</TabsTrigger>
                  <TabsTrigger value="image">Görsel</TabsTrigger>
                </TabsList>
                <TabsContent value="flat" className="pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label>Renk Seç:</Label>
                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} onBlur={(e) => handleBgColorChange(e.target.value)} className="w-24 p-1"/>
                  </div>
                  { isLoadingColors && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin"/> Renk önerileri oluşturuluyor...</div>}
                  { showColorSuggestions && (
                    <div className="space-y-2">
                      <Label>AI Renk Önerileri</Label>
                      <div className="grid grid-cols-5 gap-2">
                        {colorSchemes.map((scheme, i) => (
                           <button key={i} className="h-10 rounded-md border-2 border-transparent focus:border-primary" style={{backgroundColor: scheme.backgroundColor}} onClick={() => { setBgColor(scheme.backgroundColor); setTextColor(scheme.textColor)}}>
                             <span className="sr-only">Arka plan {scheme.backgroundColor} ve metin {scheme.textColor}</span>
                           </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-4">
                    <Label>Metin Rengi:</Label>
                    <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-24 p-1"/>
                  </div>
                </TabsContent>
                <TabsContent value="gradient" className="pt-4">
                   <div className="grid grid-cols-3 gap-2">
                    {gradientTemplates.map(g => (
                      <button key={g.name} className="h-12 rounded-md border-2 border-transparent focus:border-primary" style={{background: g.css}} onClick={() => setGradientBg(g.css)} title={g.name} />
                    ))}
                   </div>
                </TabsContent>
                 <TabsContent value="image" className="pt-4 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="image-search">Görsel Ara</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="image-search" 
                          placeholder="Örn: dokulu kağıt, ahşap..." 
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSearchImages()}
                        />
                        <Button onClick={handleSearchImages} disabled={isSearching} variant="outline" size="icon">
                          {isSearching ? <Loader2 className="animate-spin" /> : <Search />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {imageTemplates.map(t => (
                        <button key={t.name} className="h-16 rounded-md border-2 border-transparent focus:border-primary bg-gray-200 overflow-hidden" onClick={() => setImageBgUrl(t.imageUrl)} title={t.name}>
                          <Image src={t.imageUrl} alt={t.name} width={64} height={64} className="object-cover w-full h-full" />
                        </button>
                      ))}
                      {searchedImages.map((url, i) => (
                         <button key={i} className="h-16 rounded-md border-2 border-transparent focus:border-primary bg-gray-200 overflow-hidden" onClick={() => setImageBgUrl(url)} title={`Searched Image ${i+1}`}>
                          <Image src={url} alt={`Searched Image ${i+1}`} width={64} height={64} className="object-cover w-full h-full" unoptimized/>
                        </button>
                      ))}
                    </div>
                 </TabsContent>
              </Tabs>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              Oluştur
            </Button>
          </CardFooter>
        </Card>

        <div className="lg:col-span-8 xl:col-span-9">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasarimlar</CardTitle>
                <CardDescription>
                  Oluşturulan görselleri kaydırarak inceleyebilirsiniz.
                </CardDescription>
              </div>
              <Button onClick={handleDownloadAll} variant="outline" size="sm" disabled={designs.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Tümünü İndir
              </Button>
            </CardHeader>
            <CardContent>
              { isClient && designs.length > 0 ? (
                 <Carousel className="w-full max-w-lg mx-auto" setApi={(api) => api?.reInit()}>
                    <CarouselContent>
                      {designs.map((design, index) => (
                        <CarouselItem key={index}>
                          <div className="p-1">
                            <Card className="overflow-hidden">
                              <CardContent className="p-0 aspect-[1080/1350] relative bg-card">
                               {renderCanvas(design, index)}
                              </CardContent>
                              <CardFooter className="py-2 px-4 justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownload(index)}
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  JPG İndir
                                </Button>
                              </CardFooter>
                            </Card>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4 md:-left-12" />
                    <CarouselNext className="-right-4 md:-right-12" />
                  </Carousel>
              ) : (
                <div className="aspect-[1080/1350] max-w-lg mx-auto flex flex-col items-center justify-center rounded-lg border-2 border-dashed bg-muted/50 text-center p-8">
                    <Wand2 className="w-16 h-16 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Görselleriniz burada görünecek.
                    </p>
                    <p className="text-sm text-muted-foreground/80">
                      Başlamak için soldaki panelden metninizi girip "Oluştur" butonuna tıklayın.
                    </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
