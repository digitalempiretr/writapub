"use client";

import { automaticallySplitTextIntoParagraphs } from "@/ai/flows/automatically-split-text-into-paragraphs";
import { suggestContrastingColorSchemes } from "@/ai/flows/suggest-contrasting-color-schemes";
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
import { Download, Loader2, Wand2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import Image from 'next/image';

type Design = {
  paragraph: string;
  title?: string;
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
    value: "playfair-inter",
    label: "Playfair Display & Inter",
    titleFont: "Playfair Display",
    bodyFont: "Inter",
    bodyWeight: "600",
    titleWeight: "700",
    titleSize: 90,
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
    { name: "Paper", value: "paper-effect" },
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

  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions[0]);
  const [designTab, setDesignTab] = useState("flat");
  const [bgColor, setBgColor] = useState("#E8F0FE");
  const [textColor, setTextColor] = useState("#172554");
  const [gradientBg, setGradientBg] = useState(gradientTemplates[0].css);
  const [imageBg, setImageBg] = useState(imageTemplates[0].value);

  const [colorSchemes, setColorSchemes] = useState<{backgroundColor: string, textColor: string}[]>([]);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const { toast } = useToast();

  const manuallySplitText = (text: string, title: string) => {
    const MIN_LENGTH = 300;
    const MAX_LENGTH = 350;
    const paragraphs = [];
    let remainingText = text.replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim();
  
    // Determine the title
    let derivedTitle = title;
    if (!derivedTitle) {
      const firstSentenceEnd = remainingText.search(/[.!?]/);
      if (firstSentenceEnd !== -1) {
        derivedTitle = remainingText.substring(0, firstSentenceEnd + 1).trim();
      } else {
        // Fallback if no sentence ending is found
        derivedTitle = remainingText.substring(0, 50).trim() + '...';
      }
    }

    while (remainingText.length > 0) {
      if (remainingText.length <= MAX_LENGTH) {
        paragraphs.push(remainingText);
        break;
      }
  
      let splitPos = -1;
      // Try to find a sentence end between MIN and MAX
      for (let i = MAX_LENGTH; i >= MIN_LENGTH; i--) {
        if ('.!?'.includes(remainingText[i])) {
          splitPos = i + 1;
          break;
        }
      }

      // If no sentence end, try to find a space
      if (splitPos === -1) {
        for (let i = MAX_LENGTH; i >= MIN_LENGTH; i--) {
          if (remainingText[i] === ' ') {
            splitPos = i;
            break;
          }
        }
      }
      
      // If still no good split point, force cut at MAX_LENGTH
      if (splitPos === -1) {
        splitPos = MAX_LENGTH;
      }

      paragraphs.push(remainingText.substring(0, splitPos).trim());
      remainingText = remainingText.substring(splitPos).trim();
    }
  
    return {
      title: derivedTitle,
      paragraphs: paragraphs.filter(p => p.length > 0), // Filter out empty paragraphs
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
      const result = manuallySplitText(text, title);

      const newDesigns: Design[] = result.paragraphs.map((p, index) => ({
        paragraph: p,
        title: index === 0 ? result.title.toUpperCase() : undefined,
      }));

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
      // Add a small delay between downloads to prevent browser from blocking them
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

  const renderCanvas = (design: Design, index: number) => {
    if (designTab === "image") {
        const specialFont: FontOption = {
            value: "paper-effect-font",
            label: "Paper Effect Font",
            titleFont: "Playfair Display",
            bodyFont: "Playfair Display",
            bodyWeight: "400",
            titleWeight: "700",
            titleSize: 50,
            bodySize: 45,
            lineHeight: 60,
        };
        const textToRender = design.title ? `${design.title}\n\n${design.paragraph}` : design.paragraph;

        return (
             <div className="aspect-[1080/1350] relative bg-black flex items-center justify-center">
                <Image
                    src="https://picsum.photos/seed/1/1080/1350"
                    alt="Background"
                    fill
                    objectFit="cover"
                    data-ai-hint="abstract texture"
                />
                <div className="relative bg-white/90 w-[830px] h-[1100px] flex items-center justify-center p-8">
                     <p className="w-[730px] h-auto font-serif text-black text-left" style={{ fontFamily: 'Playfair Display', fontSize: '45pt', fontWeight: 400, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>
                        {textToRender}
                    </p>
                </div>
                 {/* This canvas is hidden, only used for download */}
                <div className="absolute -z-10 opacity-0 pointer-events-none">
                    <ImageCanvas
                      font={specialFont}
                      text={design.paragraph}
                      title={design.title}
                      textColor="#000000"
                      backgroundColor="paper-effect"
                      width={1080}
                      height={1350}
                      onCanvasReady={(canvas) => {
                        canvasRefs.current[index] = canvas;
                      }}
                    />
                </div>
            </div>
        );
    }
    
    const currentBg = designTab === "flat" ? bgColor : gradientBg;
    
    return (
        <ImageCanvas
          font={activeFont}
          text={design.paragraph}
          title={design.title}
          textColor={textColor}
          backgroundColor={currentBg}
          width={1080}
          height={1350}
          onCanvasReady={(canvas) => {
            canvasRefs.current[index] = canvas;
          }}
        />
    )
  }

  const currentBg = designTab === "flat" ? bgColor : (designTab === "gradient" ? gradientBg : imageBg);
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
            <CardTitle>İçerik & Tasarım</CardTitle>
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
            <div className="space-y-2">
              <Label htmlFor="font">Yazı Tipi</Label>
              <Select onValueChange={handleFontChange} defaultValue={activeFont.value} disabled={designTab === 'image'}>
                <SelectTrigger id="font">
                  <SelectValue placeholder="Font seçin" />
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
                  <TabsTrigger value="image">Şablon</TabsTrigger>
                </TabsList>
                <TabsContent value="flat" className="pt-4 space-y-4">
                  <div className="flex items-center gap-4">
                    <Label>Renk Seç:</Label>
                    <Input type="color" value={bgColor} onChange={(e) => handleBgColorChange(e.target.value)} className="w-24 p-1"/>
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
                 <TabsContent value="image" className="pt-4">
                   <div className="grid grid-cols-3 gap-2">
                    {imageTemplates.map(t => (
                      <button key={t.name} className="h-12 rounded-md border-2 border-transparent focus:border-primary bg-gray-200" onClick={() => setImageBg(t.value)} title={t.name}>
                        {t.name}
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
              {designs.length > 0 ? (
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
