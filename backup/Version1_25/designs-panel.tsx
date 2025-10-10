
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

type DesignsPanelProps = {
  handleApplyTemplate: (template: DesignTemplate) => void;
};

export function DesignsPanel({ handleApplyTemplate }: DesignsPanelProps) {
  const imageBasedTemplates = designTemplates.filter(t => t.background.type === 'image');
  const styleBasedTemplates = designTemplates.filter(t => t.background.type === 'flat' || t.background.type === 'gradient');

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

    