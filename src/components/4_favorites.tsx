
"use client";

import React, { useState, useEffect } from "react";
import { useDesignEditor } from "@/context/DesignEditorContext";
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
import { Plus, Copy, FilePenLine, Check, X, Trash2 } from "lucide-react";
import { DesignTemplate } from "@/lib/design-templates";
import Image from 'next/image';
import { fontOptions } from "@/lib/font-options";
import { textEffects } from "@/lib/text-effects";
import { NavBullets } from "./ui/nav-bullets";
import { useToast } from "@/hooks/use-toast";

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
    fontSize: `${template.font.fontSize}px`,
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

export function MyDesignsPanel() {
  const { state, dispatch } = useDesignEditor();
  const { myDesigns, editingDesignId, editingName, designToDelete } = state;
  const { toast } = useToast();
  
  const setMyDesigns = (designs: DesignTemplate[]) => dispatch({ type: 'SET_MY_DESIGNS', payload: designs });
  const setEditingDesignId = (id: string | null) => dispatch({ type: 'SET_STATE', payload: { editingDesignId: id } });
  const setEditingName = (name: string) => dispatch({ type: 'SET_STATE', payload: { editingName: name } });
  const setDesignToDelete = (id: string | null) => dispatch({ type: 'SET_STATE', payload: { designToDelete: id } });

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    return () => api.off("select", onSelect);
  }, [api]);

  const handleSaveDesign = () => {
    const newDesign: DesignTemplate = {
        id: `design-${Date.now()}`,
        name: `Favorite ${state.myDesigns.length + 1}`,
        category: 'Favorites',
        previewImage: '',
        background: { type: state.backgroundType, value: state.backgroundType === 'flat' ? state.bgColor : state.backgroundType === 'gradient' ? state.gradientBg : state.imageBgUrl },
        font: { value: state.activeFont.value, color: state.textColor, fontSize: state.fontSize },
        textBox: { color: state.rectBgColor, opacity: state.rectOpacity },
        overlay: { color: state.overlayColor, opacity: state.overlayOpacity },
        canvasSize: state.canvasSize.name,
        effect: { id: state.activeEffect.id },
      };
  
      setMyDesigns([newDesign, ...myDesigns]);
      toast({
        title: "Favorite Saved!",
        description: "Your current design has been saved to your favorites.",
      });
  };

  const handleApplyTemplate = (template: DesignTemplate) => {
    dispatch({type: 'SET_STATE', payload: {
        backgroundType: template.background.type,
        bgColor: template.background.type === 'flat' ? template.background.value : state.bgColor,
        gradientBg: template.background.type === 'gradient' ? template.background.value : state.gradientBg,
        imageBgUrl: template.background.type === 'image' ? template.background.value : state.imageBgUrl,
        activeFont: fontOptions.find(f => f.value === template.font.value) || state.activeFont,
        isTextBoxEnabled: template.textBox.opacity > 0,
        rectBgColor: template.textBox.color,
        rectOpacity: template.textBox.opacity,
        isOverlayEnabled: template.overlay.opacity > 0,
        overlayColor: template.overlay.color,
        overlayOpacity: template.overlay.opacity,
        activeEffect: textEffects.find(e => e.id === template.effect?.id) || textEffects[0],
        textColor: template.font.color
    }});
};

  const handleDeleteDesign = (id: string) => {
    setMyDesigns(myDesigns.filter(d => d.id !== id));
    setDesignToDelete(null);
    toast({ title: "Favorite Deleted", variant: "destructive" });
  };

  const handleEditClick = (id: string, name: string) => {
    setEditingDesignId(id);
    setEditingName(name);
  };
  
  const handleUpdateDesign = (id: string) => {
    setMyDesigns(myDesigns.map(d => d.id === id ? { ...d, name: editingName } : d));
    setEditingDesignId(null);
    setEditingName('');
  };

  const handleCancelEdit = () => {
    setEditingDesignId(null);
    setEditingName('');
  };

  const handleLogDesign = () => {
    // This function can be kept for debugging purposes as it was in page.tsx
    console.log("Logging current design state:", state);
    toast({
        title: "Design Logged to Console",
        description: "Open developer tools (F12) to see the design state.",
      });
  };

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleLogDesign} size="sm" variant="outline">
                <Copy className="mr-2 h-4 w-4" /> Log
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Log current design to console.</p></TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={handleSaveDesign} size="sm">
                <Plus className="mr-2 h-4 w-4" /> Save Current
              </Button>
            </TooltipTrigger>
            <TooltipContent><p>Save current settings as a new favorite.</p></TooltipContent>
          </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      {myDesigns.length > 0 ? (
        <AlertDialog open={!!designToDelete} onOpenChange={(open) => !open && setDesignToDelete(null)}>
          <div className="space-y-2">
            <Carousel opts={{ align: "start", dragFree: true }} setApi={setApi} className="w-full">
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
                                  type="text" value={editingName} onChange={(e) => setEditingName(e.target.value)}
                                  className="h-7 text-xs" autoFocus
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
                              <TooltipContent><p>Delete Favorite</p></TooltipContent>
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
            <NavBullets api={api} current={current} total={myDesigns.length} className="mt-2"/>
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete your favorite design.</AlertDialogDescription>
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
