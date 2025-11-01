
"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { designTemplates, DesignTemplate } from "@/lib/design-templates";
import { fontOptions } from "@/lib/font-options";
import Image from "next/image";
import { textEffects } from "@/lib/text-effects";

type DesignsPanelProps = {
  handleApplyTemplate: (template: DesignTemplate) => void;
};

const renderPreview = (template: DesignTemplate) => {
  if (template.previewImage) {
    return <Image src={template.previewImage} alt={template.name} width={200} height={250} className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-115" />;
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

const TemplateCarousel = ({ templates, handleApplyTemplate }: { templates: DesignTemplate[], handleApplyTemplate: (template: DesignTemplate) => void }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect(); // Initial call

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);
  
  const renderBulletNavigation = () => {
    const totalSlides = templates.length;
    if (totalSlides <= 1) return null;

    const visibleDots = 7;
    const half = Math.floor(visibleDots / 2);

    let start = Math.max(current - half, 0);
    let end = start + visibleDots - 1;

    if (end >= totalSlides) {
      end = totalSlides - 1;
      start = Math.max(end - visibleDots + 1, 0);
    }
    
    const dots = [];
    for (let i = start; i <= end; i++) {
        dots.push(
            <div
                key={i}
                data-active={i === current}
                onClick={() => api?.scrollTo(i)}
                className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
        );
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-2">
        {start > 0 && (
          <>
            <div
              key={0}
              onClick={() => api?.scrollTo(0)}
              className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
            {start > 1 && <span className="text-foreground -translate-y-1">...</span>}
          </>
        )}
        {dots}
        {end < totalSlides - 1 && (
          <>
            {end < totalSlides - 2 && <span className="text-foreground -translate-y-1">...</span>}
            <div
              key={totalSlides - 1}
              onClick={() => api?.scrollTo(totalSlides - 1)}
              className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-2">
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        setApi={setApi}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {templates.map((template) => (
            <CarouselItem key={template.id} className="basis-1/4 md:basis-1/4 pl-2">
              <button onClick={() => handleApplyTemplate(template)} className="w-full group">
                <Card className="overflow-hidden">
                  <CardContent className="p-0 aspect-[4/5] w-full">
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
      </Carousel>
      {renderBulletNavigation()}
    </div>
  );
};


export function DesignsPanel({ handleApplyTemplate }: DesignsPanelProps) {
  const groupedTemplates = designTemplates.reduce((acc, template) => {
    const category = template.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, DesignTemplate[]>);

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-6">
      {Object.entries(groupedTemplates).map(([category, templates]) => (
        <div key={category} className="space-y-3">
          <Label className="bg-transparent p-2 px-0 rounded-md capitalize text-md font-semibold text-sidebar-foreground">{category}</Label>
          <TemplateCarousel templates={templates} handleApplyTemplate={handleApplyTemplate} />
        </div>
      ))}
    </div>
  );
}

    

    
