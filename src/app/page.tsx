"use client";

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
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlignCenter, AlignLeft, AlignRight, Download, Loader2, Search, Wand2 } from "lucide-react";
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from "react";

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
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions.find(f => f.value === 'special-elite') || fontOptions[0]);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [designTab, setDesignTab] = useState("flat");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [textColor, setTextColor] = useState("#172554");
  const [gradientBg, setGradientBg] = useState(gradientTemplates[0].css);
  const [imageBgUrl, setImageBgUrl] = useState(imageTemplates[0].imageUrl);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [rectBgColor, setRectBgColor] = useState("#FFFFFF");
  const [rectOpacity, setRectOpacity] = useState(0.9);

  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);
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
    setDesigns([]); // Clear all previous designs
    
    // Use a short timeout to allow the UI to update and clear the old designs
    // before we start generating new ones. This prevents race conditions.
    setTimeout(() => {
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
        setIsLoading(false);
    }, 50);
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
          key={`${designTab}-${activeFont.value}-${bgColor}-${textColor}-${gradientBg}-${imageBgUrl}-${rectBgColor}-${rectOpacity}-${index}-${design.text}-${textAlign}`}
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
  }, [designTab, activeFont, bgColor, textColor, gradientBg, imageBgUrl, handleTextRemaining, rectBgColor, rectOpacity, textAlign]);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="text-left mb-10">
        <Logo className="text-[2rem]" />
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 lg:sticky top-8">
            <Card>
              <CardHeader>
                <CardTitle>Creative Magic</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Textarea
                    id="text"
                    placeholder="Metninizi buraya yapıştırın..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground text-right">{text.length} karakter</p>
                </div>

                <div className="space-y-4">
                  <Label>Metin Kutusu Ayarları</Label>
                  <div className="flex items-center gap-4">
                    <Label>Renk:</Label>
                    <Input type="color" value={rectBgColor} onChange={(e) => setRectBgColor(e.target.value)} className="w-24 p-1"/>
                    <Label>Opaklık:</Label>
                    <Slider
                      value={[rectOpacity]}
                      onValueChange={(value) => setRectOpacity(value[0])}
                      max={1}
                      step={0.05}
                      className="w-[120px]"
                    />
                  </div>
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
                        <Label>Arka Plan:</Label>
                        <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-24 p-1"/>
                      </div>
                    </TabsContent>
                    <TabsContent value="gradient" className="pt-4">
                       <div className="grid grid-cols-4 gap-2">
                        {gradientTemplates.map(g => (
                          <button key={g.name} className="aspect-[1080/1350] w-full rounded-md border-2 border-transparent focus:border-primary" style={{background: g.css}} onClick={() => setGradientBg(g.css)} title={g.name} />
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
                        <div className="grid grid-cols-4 gap-2">
                          {imageTemplates.map(t => (
                            <button key={t.name} className="aspect-[1080/1350] w-full rounded-md border-2 border-transparent focus:border-primary bg-gray-200 overflow-hidden relative" onClick={() => setImageBgUrl(t.imageUrl)} title={t.name}>
                              <Image src={t.imageUrl} alt={t.name} layout="fill" className="object-cover" />
                            </button>
                          ))}
                          {searchedImages.map((url, i) => (
                             <button key={i} className="aspect-[1080/1350] w-full rounded-md border-2 border-transparent focus:border-primary bg-gray-200 overflow-hidden relative" onClick={() => setImageBgUrl(url)} title={`Searched Image ${i+1}`}>
                              <Image src={url} alt={`Searched Image ${i+1}`} layout="fill" className="object-cover" unoptimized/>
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
        </div>

        <div className="lg:col-span-7 mt-8 lg:mt-0">
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
                        <CarouselItem key={index} data-index={index}>
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
               <Separator className="my-6" />
                <div className="space-y-4 px-1">
                  <Label>Yazı Tipi Ayarları</Label>
                   <div className="flex flex-col gap-4">
                     <Select onValueChange={handleFontChange} defaultValue={activeFont.value}>
                       <SelectTrigger>
                         <SelectValue placeholder="Bir yazı tipi seçin" />
                       </SelectTrigger>
                       <SelectContent>
                         {fontOptions.map(font => (
                           <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.fontFamily }}>
                             {font.label}
                           </SelectItem>
                         ))}
                       </SelectContent>
                     </Select>
                     <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                         <Label>Metin:</Label>
                         <Input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-20 p-1"/>
                       </div>
                       <div className="flex items-center gap-1 rounded-md border border-input p-1">
                          <Button variant={textAlign === 'left' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('left')} className="h-8 w-8">
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                           <Button variant={textAlign === 'center' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('center')} className="h-8 w-8">
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                           <Button variant={textAlign === 'right' ? 'secondary' : 'ghost'} size="icon" onClick={() => setTextAlign('right')} className="h-8 w-8">
                            <AlignRight className="h-4 w-4" />
                          </Button>
                       </div>
                     </div>
                   </div>
                 </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
