
"use client";

import React, { useId, useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { TextColorChooseIcon, TextBgBoxIcon, TextBoxOpacity, TextStrokeIcon, RefreshIcon } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontOption } from "@/components/image-canvas";
import { Button } from "@/components/ui/button";
import { Bold, CaseUpper, Sparkles, AlignLeft, AlignCenter, AlignRight, Loader2, Trash2, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { defaultSolidColors } from "@/lib/colors";
import { Separator } from "./ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { textEffects, TextEffect } from "@/lib/text-effects";

export type Shadow = {
  id: number;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
};

type TextSettingsProps = {
  text: string;
  setText: (text: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
  textColor: string;
  setTextColor: (color: string) => void;
  textOpacity: number;
  setTextOpacity: (value: number) => void;
  activeFont: FontOption;
  handleFontChange: (value: string) => void;
  fontOptions: FontOption[];
  isBold: boolean;
  setIsBold: (value: boolean) => void;
  isUppercase: boolean;
  setIsUppercase: (value: boolean) => void;
  textAlign: 'left' | 'center' | 'right';
  setTextAlign: (align: 'left' | 'center' | 'right') => void;
  textShadowEnabled: boolean;
  setTextShadowEnabled: (value: boolean) => void;
  shadows: Shadow[];
  setShadows: (shadows: Shadow[]) => void;
  textStroke: boolean;
  setTextStroke: (value: boolean) => void;
  strokeColor: string;
  setStrokeColor: (value: string) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  rectBgColor: string;
  setRectBgColor: (color: string) => void;
  rectOpacity: number;
  setRectOpacity: (value: number) => void;
  isTextBoxEnabled: boolean;
  setIsTextBoxEnabled: (value: boolean) => void;
  activeEffect: TextEffect;
  setActiveEffect: (effect: TextEffect) => void;
};

export function TextSettings({
  text,
  setText,
  handleGenerate,
  isLoading,
  textColor,
  setTextColor,
  textOpacity,
  setTextOpacity,
  activeFont,
  handleFontChange,
  fontOptions,
  isBold,
  setIsBold,
  isUppercase,
  setIsUppercase,
  textAlign,
  setTextAlign,
  textShadowEnabled,
  setTextShadowEnabled,
  shadows,
  setShadows,
  textStroke,
  setTextStroke,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  rectBgColor,
  setRectBgColor,
  rectOpacity,
  setRectOpacity,
  isTextBoxEnabled,
  setIsTextBoxEnabled,
  activeEffect,
  setActiveEffect,
}: TextSettingsProps) {
  const baseId = useId();
  const [internalText, setInternalText] = useState(text);

  useEffect(() => {
    setInternalText(text);
  }, [text]);

  const handleRegenerateClick = () => {
    setText(internalText);
    setTimeout(() => {
      handleGenerate();
    }, 0);
  }

  const addShadow = () => {
    setShadows([...shadows, { id: Date.now(), color: '#000000', offsetX: 2, offsetY: 2, blur: 4 }]);
  };

  const updateShadow = (id: number, newProps: Partial<Shadow>) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, ...newProps } : s));
  };

  const removeShadow = (id: number) => {
    setShadows(shadows.filter(s => s.id !== id));
  };

  return (
    <TooltipProvider>
      <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
        <div className="relative">
          <Label htmlFor={`${baseId}-text-editor`} className="sr-only">Text Editor</Label>
          <Textarea
              id={`${baseId}-text-editor`}
              name="text-editor"
              placeholder="Paste your text here..."
              value={internalText}
              onChange={(e) => setInternalText(e.target.value)}
              onBlur={() => setText(internalText)}
              rows={4}
              className="bg-background text-foreground placeholder:text-muted-foreground border pr-12"
          />
           <div className="absolute md:bottom-2 md:right-5 bottom-1 right-9">
            <Button
              onClick={handleRegenerateClick}
              disabled={isLoading}
              size="icon"
              className="h-8 w-8 rounded-full bg-primary hover:bg-primary/80"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshIcon />
              )}
              <span className="sr-only">Regenerate</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-4">
             <Label className="bg-zinc-200 p-2 px-6 rounded-md">TEXT SETTINGS</Label>
             <div className="overflow-x-auto pb-2 -mb-2">
                <div className="flex items-center gap-2 flex-nowrap">
                <div className="flex-grow">
                  <Select value={activeFont.value} onValueChange={handleFontChange}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SelectTrigger className="w-full h-10" id={`${baseId}-font-select`} aria-label="Select Font">
                          <SelectValue placeholder="Select Font" />
                        </SelectTrigger>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select Font</p>
                      </TooltipContent>
                    </Tooltip>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.fontFamily }}>
                          {font.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="relative h-10 w-10 flex-shrink-0">
                      <Label htmlFor={`${baseId}-text-color-picker`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                        <TextColorChooseIcon color={textColor} />
                      </Label>
                      <Input
                        id={`${baseId}-text-color-picker`}
                        type="color"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select Text Color</p>
                  </TooltipContent>
                </Tooltip>

                <DropdownMenu>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0 h-10 w-10">
                          {textAlign === 'left' && <AlignLeft className="h-4 w-4" />}
                          {textAlign === 'center' && <AlignCenter className="h-4 w-4" />}
                          {textAlign === 'right' && <AlignRight className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Text Alignment</p>
                    </TooltipContent>
                  </Tooltip>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setTextAlign('left')}>
                      <AlignLeft className="mr-2 h-4 w-4" />
                      <span>Align Left</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTextAlign('center')}>
                      <AlignCenter className="mr-2 h-4 w-4" />
                      <span>Center</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTextAlign('right')}>
                      <AlignRight className="mr-2 h-4 w-4" />
                      <span>Align Right</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0 h-10 w-10">
                          <TextBoxOpacity />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Text Opacity</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-56 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${baseId}-text-opacity-slider`}>Text Opacity</Label>
                      <div className="flex items-center gap-2">
                        <Slider
                          id={`${baseId}-text-opacity-slider`}
                          max={1}
                          min={0}
                          step={0.01}
                          value={[textOpacity]}
                          onValueChange={(value) => setTextOpacity(value[0])}
                          className="flex-grow"
                        />
                        <div className="text-sm p-2 rounded-md border border-input tabular-nums w-14 text-center">
                          {Math.round(textOpacity * 100)}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Separator orientation="vertical" className="h-10 flex-shrink-0" />

                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" data-active={isBold} onClick={() => setIsBold(!isBold)} className="data-[active=true]:bg-primary/20 flex-shrink-0 h-10 w-10">
                        <Bold className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Bold</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon" data-active={isUppercase} onClick={() => setIsUppercase(!isUppercase)} className="data-[active=true]:bg-primary/20 flex-shrink-0 h-10 w-10">
                        <CaseUpper className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Uppercase</p></TooltipContent>
                </Tooltip>
                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0 h-10 w-10" data-active={textShadowEnabled} >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Text Shadow</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-72 space-y-4" align="end">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${baseId}-shadow-toggle`}>Enable Text Shadow</Label>
                      <Switch id={`${baseId}-shadow-toggle`} checked={textShadowEnabled} onCheckedChange={setTextShadowEnabled} />
                    </div>
                    {textShadowEnabled && (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {shadows.map((shadow, index) => (
                          <div key={shadow.id} className="p-2 border rounded-md space-y-3">
                            <div className="flex justify-between items-center">
                               <Label className="text-xs font-medium">Layer {index + 1}</Label>
                               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeShadow(shadow.id)}>
                                <Trash2 className="h-4 w-4" />
                               </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Color</Label>
                              <Input type="color" value={shadow.color} onChange={(e) => updateShadow(shadow.id, { color: e.target.value })} className="h-8 p-1"/>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`${baseId}-shadow-blur-${index}`} className="text-xs">Blur</Label>
                              <Slider id={`${baseId}-shadow-blur-${index}`} max={40} min={0} step={1} value={[shadow.blur]} onValueChange={(v) => updateShadow(shadow.id, { blur: v[0] })} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`${baseId}-shadow-offset-x-${index}`} className="text-xs">X Offset</Label>
                              <Slider id={`${baseId}-shadow-offset-x-${index}`} max={20} min={-20} step={1} value={[shadow.offsetX]} onValueChange={(v) => updateShadow(shadow.id, { offsetX: v[0] })} />
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`${baseId}-shadow-offset-y-${index}`} className="text-xs">Y Offset</Label>
                              <Slider id={`${baseId}-shadow-offset-y-${index}`} max={20} min={-20} step={1} value={[shadow.offsetY]} onValueChange={(v) => updateShadow(shadow.id, { offsetY: v[0] })} />
                            </div>
                          </div>
                        ))}
                         <Button variant="outline" size="sm" onClick={addShadow} className="w-full">
                           <Plus className="mr-2 h-4 w-4" /> Add Shadow Layer
                         </Button>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>

                <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0 h-10 w-10">
                          <TextStrokeIcon />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Text Stroke</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${baseId}-stroke-toggle`}>Text Stroke</Label>
                      <Switch id={`${baseId}-stroke-toggle`} checked={textStroke} onCheckedChange={setTextStroke} />
                    </div>
                    {textStroke && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2">
                          <Label>Color</Label>
                          <Input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} className="h-8 p-1"/>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`${baseId}-stroke-width`}>Width</Label>
                          <Slider id={`${baseId}-stroke-width`} max={10} min={1} step={0.5} value={[strokeWidth]} onValueChange={(v) => setStrokeWidth(v[0])} />
                        </div>
                      </div>
                    )}
                  </PopoverContent>
                </Popover>
                
                <Separator orientation="vertical" className="h-10 flex-shrink-0" />
            
                <Popover>
                    <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="flex-shrink-0 h-10 w-10">
                            <TextBgBoxIcon color={isTextBoxEnabled ? rectBgColor : '#999'} />
                        </Button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Text Box Settings</p>
                    </TooltipContent>
                    </Tooltip>
                    <PopoverContent className="w-64 space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor={`${baseId}-textbox-toggle`}>Text Box Background</Label>
                        <Switch
                        id={`${baseId}-textbox-toggle`}
                        checked={isTextBoxEnabled}
                        onCheckedChange={setIsTextBoxEnabled}
                        />
                    </div>
                    {isTextBoxEnabled && (
                        <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Label>Color</Label>
                            <Input
                            type="color"
                            value={rectBgColor}
                            onChange={(e) => setRectBgColor(e.target.value)}
                            className="h-8 p-1"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor={`${baseId}-rect-opacity-slider`}>Opacity</Label>
                            <div className="flex items-center gap-2">
                            <Slider
                                id={`${baseId}-rect-opacity-slider`}
                                max={1}
                                min={0}
                                step={0.01}
                                value={[rectOpacity]}
                                onValueChange={(value) => setRectOpacity(value[0])}
                            />
                            <div className="text-sm p-2 rounded-md border border-input tabular-nums w-14 text-center">
                                {Math.round(rectOpacity * 100)}
                            </div>
                            </div>
                        </div>
                        </div>
                    )}
                    </PopoverContent>
                </Popover>

              </div>
            </div>
            
          <div className="pt-2">
            <Label className="text-sm font-medium">Color Palette</Label>
            <Carousel className="w-full" opts={{ dragFree: true }}>
              <CarouselContent>
                {defaultSolidColors.map(color => (
                  <CarouselItem key={color} className="basis-1/7">
                    <Card 
                      className="overflow-hidden cursor-pointer bg-transparent border-0 shadow-none" 
                      onClick={() => setTextColor(color)}
                    >
                      <CardContent 
                        className="h-20 flex items-center justify-center p-0"
                      >
                         <span
                            className="font-['Playfair_Display'] text-5xl font-bold"
                            style={{ color: color }}
                          >
                            W
                          </span>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>

          <div className="pt-2">
            <Label>Text Effects</Label>
            <Carousel className="w-full" opts={{ dragFree: true, align: "start" }}>
              <CarouselContent>
                {textEffects.map(effect => {
                  const effectStyle: React.CSSProperties = {
                    backgroundColor: effect.previewBg || (effect.id === 'none' ? '#e2e8f0' : '#333'),
                    fontFamily: effect.style.fontFamily || "'Playfair Display', serif",
                    fontWeight: effect.style.fontWeight || 'bold',
                  };
                  const finalColor = effect.style.color || textColor;
                  effectStyle.color = finalColor;

                  if (effect.style.textShadow) {
                      const finalShadowString = effect.style.textShadow
                        .replace(/{{color}}/g, finalColor)
                        .replace(/{{glow}}/g, effect.style.glowColor || finalColor);
                      effectStyle.textShadow = finalShadowString;
                  }
                  
                  return (
                    <CarouselItem key={effect.id} className="basis-1/4 md:basis-1/5 lg:basis-1/7">
                      <Card 
                          className="overflow-hidden cursor-pointer"
                          onClick={() => setActiveEffect(effect)}
                      >
                        <CardContent 
                          className="h-20 flex items-center justify-center p-0 text-5xl"
                          style={effectStyle}
                        >
                          W
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
