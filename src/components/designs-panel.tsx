
"use client";

import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { designTemplates, DesignTemplate } from "@/lib/design-templates";
import { fontOptions } from "@/lib/font-options";
import Image from "next/image";
import { textEffects } from "@/lib/text-effects";

type DesignsPanelProps = {
  handleApplyTemplate: (template: DesignTemplate) => void;
};

export function DesignsPanel({ handleApplyTemplate }: DesignsPanelProps) {
  const imageBasedTemplates = designTemplates.filter(t => t.background.type === 'image');
  const styleBasedTemplates = designTemplates.filter(t => t.background.type === 'flat' || t.background.type === 'gradient');

  const renderPreview = (template: DesignTemplate) => {
    if (template.previewImage) {
      return <Image src={template.previewImage} alt={template.name} width={200} height={300} className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105" />;
    }
    
    const font = fontOptions.find(f => f.value === template.font.value);
    const effect = template.effect ? textEffects.find(e => e.id === template.effect!.id) : null;
    
    const textStyle: React.CSSProperties = {
      fontFamily: font?.fontFamily || 'sans-serif',
      color: template.font.color,
      fontWeight: 'bold',
    };

    if (effect && effect.style.textShadow) {
      const finalColor = effect.style.color || template.font.color;
      textStyle.color = finalColor;
      if (effect.style.fontFamily) {
        textStyle.fontFamily = effect.style.fontFamily;
      }
      const finalShadowString = effect.style.textShadow
        .replace(/{{color}}/g, finalColor)
        .replace(/{{glow}}/g, effect.style.glowColor || finalColor);
      textStyle.textShadow = finalShadowString;
    }

    return (
      <div 
        className="w-full h-full flex items-center justify-center p-2 text-center transition-transform duration-300 group-hover:scale-105" 
        style={{ background: template.background.value }}>
        <span 
          style={textStyle}
          className="text-lg"
        >
          {template.name}
        </span>
      </div>
    );
  };


  return (
    <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
        </TabsList>
        <TabsContent value="templates" className="pt-4">
          <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {imageBasedTemplates.map((template) => (
                <CarouselItem key={template.id} className="basis-1/4 pl-2">
                  <button onClick={() => handleApplyTemplate(template)} className="w-full group">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0 aspect-[2/3] w-full">
                        {renderPreview(template)}
                      </CardContent>
                      <CardFooter className="p-2 justify-center">
                        <p className="text-xs font-semibold truncate">{template.name}</p>
                      </CardFooter>
                    </Card>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </TabsContent>
        <TabsContent value="styles" className="pt-4">
            <Carousel
            opts={{
              align: "start",
              dragFree: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {styleBasedTemplates.map((template) => (
                <CarouselItem key={template.id} className="basis-1/4 pl-2">
                  <button onClick={() => handleApplyTemplate(template)} className="w-full group">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0 aspect-[2/3] w-full">
                        {renderPreview(template)}
                      </CardContent>
                        <CardFooter className="p-2 justify-center">
                        <p className="text-xs font-semibold truncate">{template.name}</p>
                      </CardFooter>
                    </Card>
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="-left-4" />
            <CarouselNext className="-right-4" />
          </Carousel>
        </TabsContent>
      </Tabs>
    </div>
  );
}
