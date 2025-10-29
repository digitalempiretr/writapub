
"use client";

import React, { useState, useEffect } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
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
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FilePenLine, Check, X, Trash2 } from "lucide-react";
import { DesignTemplate } from "@/lib/types";
import Image from 'next/image';
import { fontOptions } from "@/lib/font-options";
import { textEffects } from "@/lib/text-effects";

type MyDesignsPanelProps = {
  myDesigns: DesignTemplate[];
  handleSaveDesign: () => void;
  handleDeleteDesign: (id: string) => void;
  handleUpdateDesign: (id: string) => void;
  editingDesignId: string | null;
  handleEditClick: (id: string, name: string) => void;
  handleCancelEdit: () => void;
  editingName: string;
  setEditingName: (name: string) => void;
  designToDelete: string | null;
  setDesignToDelete: (id: string | null) => void;
  handleApplyTemplate: (template: DesignTemplate) => void;
};

export function MyDesignsPanel({
  myDesigns,
  handleSaveDesign,
  handleDeleteDesign,
  handleUpdateDesign,
  editingDesignId,
  handleEditClick,
  handleCancelEdit,
  editingName,
  setEditingName,
  designToDelete,
  setDesignToDelete,
  handleApplyTemplate,
}: MyDesignsPanelProps) {
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

  const renderPreview = (template: DesignTemplate) => {
    if (template.previewImage) {
      return <Image src={template.previewImage} alt={template.name} width={200} height={300} className="object-cover h-full w-full" />;
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
        className="w-full h-full flex items-center justify-center p-2 text-center" 
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
  
  const renderBulletNavigation = () => {
    if (!api || !myDesigns) return null;
    
    const totalSlides = myDesigns.length;
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
                className="h-2 w-2 rounded-full bg-accent cursor-pointer transition-all duration-300 bullet-indicator"
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
              className="h-2 w-2 rounded-full bg-accent cursor-pointer transition-all duration-300 bullet-indicator"
            />
            {start > 1 && <span className="text-foreground/50 -translate-y-1">...</span>}
          </>
        )}
        {dots}
        {end < totalSlides - 1 && (
          <>
            {end < totalSlides - 2 && <span className="text-foreground/50 -translate-y-1">...</span>}
            <div
              key={totalSlides - 1}
              onClick={() => api?.scrollTo(totalSlides - 1)}
              className="h-2 w-2 rounded-full bg-accent cursor-pointer transition-all duration-300 bullet-indicator"
            />
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <div className="flex justify-between items-center">
        
        <div className="flex gap-2">
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSaveDesign} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Save Current
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save the current settings as a new favorite.</p>
            </TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {myDesigns && myDesigns.length > 0 ? (
        <AlertDialog open={!!designToDelete} onOpenChange={(open) => !open && setDesignToDelete(null)}>
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
                {myDesigns.map((template) => (
                  <CarouselItem key={template.id} className="basis-1/3 md:basis-1/4 pl-2">
                    <div className="relative group">
                      <button onClick={() => editingDesignId !== template.id && handleApplyTemplate(template)} className="w-full" disabled={editingDesignId === template.id}>
                        <Card className="overflow-hidden">
                          <CardContent className="p-0 aspect-[2/3] w-full">
                            {renderPreview(template)}
                          </CardContent>
                          <CardFooter className="p-2 justify-center flex-col items-center">
                            {editingDesignId === template.id ? (
                              <div className="flex items-center gap-1 w-full">
                                <Input
                                  type="text"
                                  value={editingName}
                                  onChange={(e) => setEditingName(e.target.value)}
                                  className="h-7 text-xs"
                                  autoFocus
                                  onKeyDown={(e) => e.key === 'Enter' && handleUpdateDesign(template.id)}
                                />
                              </div>
                            ) : (
                              <p className="text-xs font-semibold truncate">{template.name}</p>
                            )}
                          </CardFooter>
                        </Card>
                      </button>
                      <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <TooltipProvider>
                        {editingDesignId === template.id ? (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7 bg-green-100 hover:bg-green-200" onClick={() => handleUpdateDesign(template.id)}>
                                  <Check className="h-4 w-4 text-green-700" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Save Name</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleCancelEdit}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Cancel</p></TooltipContent>
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleEditClick(template.id, template.name)}>
                                  <FilePenLine className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent><p>Edit Name</p></TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => setDesignToDelete(template.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Delete Favorite</p></TooltipContent>
                            </Tooltip>
                          </>
                        )}
                        </TooltipProvider>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {renderBulletNavigation()}
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your favorite design.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => designToDelete && handleDeleteDesign(designToDelete)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          <p>You haven't saved any favorites yet.</p>
          <p className="text-xs">Click "Save Current" to add a design.</p>
        </div>
      )}
    </div>
  );
}
