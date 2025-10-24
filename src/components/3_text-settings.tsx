
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
import { TextColorChooseIcon, TextBgBoxIcon, TextBoxOpacity, TextStrokeIcon, RefreshIcon, FontSizeIcon, TextShadowIcon } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontOption, fontOptions } from "@/lib/font-options";
import { Button } from "@/components/ui/button";
import { Bold, CaseUpper, AlignLeft, AlignCenter, AlignRight, Loader2, Trash2, Plus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { defaultSolidColors } from "@/lib/colors";
import { Separator } from "./ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { textEffects, TextEffect } from "@/lib/text-effects";
import { cn } from "@/lib/utils";
import { useCarouselSync } from "@/hooks/use-carousel-sync";


type Unit = 'px' | 'em' | 'rem';

export type Shadow = {
  id: number;
  color: string;
  offsetX: number;
  offsetY: number;
  blur: number;
  offsetXUnit: Unit;
  offsetYUnit: Unit;
  blurUnit: Unit;
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
  setActiveFont: (font: FontOption) => void;
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
  setActiveFont,
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

  const [colorPaletteApi, setColorPaletteApi] = useState<CarouselApi>();
  const [currentPaletteSlide, setCurrentPaletteSlide] = useState(0);

  const [effectsApi, setEffectsApi] = useState<CarouselApi>();
  const [currentEffectSlide, setCurrentEffectSlide] = useState(0);

  useCarouselSync(colorPaletteApi, setCurrentPaletteSlide);
  useCarouselSync(effectsApi, setCurrentEffectSlide);

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
    setShadows([...shadows, { id: Date.now(), color: '#000000', offsetX: 2, offsetY: 2, blur: 4, offsetXUnit: 'px', offsetYUnit: 'px', blurUnit: 'px' }]);
  };

  const updateShadow = (id: number, newProps: Partial<Shadow>) => {
    setShadows(shadows.map(s => s.id === id ? { ...s, ...newProps } : s));
  };

  const removeShadow = (id: number) => {
    setShadows(shadows.filter(s => s.id !== id));
  };

  const handleFontValueChange = <K extends keyof FontOption>(key: K, value: FontOption[K]) => {
    setActiveFont({
      ...activeFont,
      [key]: value
    });
  }

  const unitOptions: Unit[] = ['px', 'em', 'rem'];

  const renderBulletNavigation = (api: CarouselApi | undefined, current: number, total: number) => {
    if (!api || total <= 1) return null;

    const visibleDots = 7;
    const half = Math.floor(visibleDots / 2);

    let start = Math.max(current - half, 0);
    let end = start + visibleDots - 1;

    if (end >= total) {
      end = total - 1;
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
        {end < total - 1 && (
          <>
            {end < total - 2 && <span className="text-foreground/50 -translate-y-1">...</span>}
            <div
              key={total - 1}
              onClick={() => api?.scrollTo(total - 1)}
              className="h-2 w-2 rounded-full bg-accent cursor-pointer transition-all duration-300 bullet-indicator"
            />
          </>
        )}
      </div>
    );
  };


  return (
    <TooltipProvider>
      <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4">
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
             
             <div className="overflow-x-auto pb-2 -mb-2">
                <div className="flex items-center gap-2 flex-nowrap">
                <div className="flex-shrink-0 min-w-[150px]">
                  <Select
                    value={activeFont.value}
                    onValueChange={(value) => {
                      const newFont = fontOptions.find(f => f.value === value);
                      if (newFont) {
                        setActiveFont(newFont);
                      }
                    }}
                  >
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
                 <Popover>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="icon" className="h-10 w-10 flex-shrink-0">
                          <FontSizeIcon />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent><p>Font Size & Line Height</p></TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-64 space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor={`${baseId}-font-size-slider`}>Font Size</Label>
                         <div className="flex items-center gap-2">
                            <Slider id={`${baseId}-font-size-slider`} max={200} min={20} step={1} value={[typeof activeFont.size === 'number' ? activeFont.size : 48]} onValueChange={(v) => handleFontValueChange('size', v[0])}/>
                            <Input type="number" value={activeFont.size} onChange={(e) => handleFontValueChange('size', Number(e.target.value))} className="w-20 h-8 text-xs" />
                         </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor={`${baseId}-line-height-slider`}>Line Height</Label>
                        <div className="flex items-center gap-2">
                            <Slider id={`${baseId}-line-height-slider`} max={2.5} min={0.8} step={0.1} value={[typeof activeFont.lineHeight === 'number' ? activeFont.lineHeight : 1.4]} onValueChange={(v) => handleFontValueChange('lineHeight', v[0])}/>
                             <Input type="number" value={activeFont.lineHeight} onChange={(e) => handleFontValueChange('lineHeight', Number(e.target.value))} step="0.1" className="w-20 h-8 text-xs" />
                        </div>
                    </div>
                  </PopoverContent>
                </Popover>

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
                           <TextShadowIcon />
                        </Button>
                      </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Text Shadow</p>
                    </TooltipContent>
                  </Tooltip>
                  <PopoverContent className="w-96 space-y-4" align="end">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`${baseId}-shadow-toggle`}>Enable Text Shadow</Label>
                      <Switch id={`${baseId}-shadow-toggle`} checked={textShadowEnabled} onCheckedChange={setTextShadowEnabled} />
                    </div>
                    {textShadowEnabled && (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {shadows.map((shadow, index) => (
                          <div key={shadow.id} className="p-2 border rounded-md space-y-3">
                            <div className="flex justify-between items-center">
                               <div className="flex items-center gap-2">
                                <Label className="text-xs font-medium">Layer {index + 1}</Label>
                                 <Input type="color" value={shadow.color} onChange={(e) => updateShadow(shadow.id, { color: e.target.value })} className="h-6 w-8 p-0.5"/>
                               </div>
                               <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeShadow(shadow.id)}>
                                <Trash2 className="h-4 w-4" />
                               </Button>
                            </div>

                            <div className="space-y-1">
                              <Label htmlFor={`${baseId}-shadow-blur-${index}`} className="text-xs">Blur</Label>
                              <div className="flex items-center gap-2">
                                <Slider id={`${baseId}-shadow-blur-${index}`} max={40} min={0} step={1} value={[shadow.blur]} onValueChange={(v) => updateShadow(shadow.id, { blur: v[0] })} />
                                <Input type="number" value={shadow.blur} onChange={e => updateShadow(shadow.id, {blur: Number(e.target.value)})} className="h-7 w-20 text-xs" />
                                <Select value={shadow.blurUnit} onValueChange={(v: Unit) => updateShadow(shadow.id, { blurUnit: v })}>
                                  <SelectTrigger className="w-20 h-7 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {unitOptions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`${baseId}-shadow-offset-x-${index}`} className="text-xs">X Offset</Label>
                               <div className="flex items-center gap-2">
                                <Slider id={`${baseId}-shadow-offset-x-${index}`} max={20} min={-20} step={1} value={[shadow.offsetX]} onValueChange={(v) => updateShadow(shadow.id, { offsetX: v[0] })} />
                                <Input type="number" value={shadow.offsetX} onChange={e => updateShadow(shadow.id, {offsetX: Number(e.target.value)})} className="h-7 w-20 text-xs" />
                                 <Select value={shadow.offsetXUnit} onValueChange={(v: Unit) => updateShadow(shadow.id, { offsetXUnit: v })}>
                                    <SelectTrigger className="w-20 h-7 text-xs"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                      {unitOptions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                               </div>
                            </div>
                            <div className="space-y-1">
                              <Label htmlFor={`${baseId}-shadow-offset-y-${index}`} className="text-xs">Y Offset</Label>
                              <div className="flex items-center gap-2">
                                <Slider id={`${baseId}-shadow-offset-y-${index}`} max={20} min={-20} step={1} value={[shadow.offsetY]} onValueChange={(v) => updateShadow(shadow.id, { offsetY: v[0] })} />
                                <Input type="number" value={shadow.offsetY} onChange={e => updateShadow(shadow.id, {offsetY: Number(e.target.value)})} className="h-7 w-20 text-xs" />
                                <Select value={shadow.offsetYUnit} onValueChange={(v: Unit) => updateShadow(shadow.id, { offsetYUnit: v })}>
                                  <SelectTrigger className="w-20 h-7 text-xs"><SelectValue /></SelectTrigger>
                                  <SelectContent>
                                    {unitOptions.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
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
             <Carousel className="w-full" opts={{ dragFree: true }} setApi={setColorPaletteApi}>
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
                            className="font-['Oswald'] text-4xl font-bold"
                            style={{ color: color }}
                          >
                            Abc
                          </span>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {renderBulletNavigation(colorPaletteApi, currentPaletteSlide, defaultSolidColors.length)}
          </div>

          <div className="pt-2">
            <Label>Text Effects</Label>
            <Carousel className="w-full" opts={{ dragFree: true, align: "start" }} setApi={setEffectsApi}>
              <CarouselContent>
                {textEffects.map(effect => {
                  const effectStyle: React.CSSProperties = {
                    backgroundColor: effect.previewBg || (effect.id === 'none' ? '#e2e8f0' : '#333'),
                    fontFamily: effect.style.fontFamily || "'Playfair Display', serif",
                    fontWeight: effect.style.fontWeight || 'bold',
                  };
                  const finalColor = effect.style.color || '#000000'; // Default to black if no color is defined
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
                          className="h-20 flex items-center justify-center p-2 text-center text-lg"
                          style={effectStyle}
                        >
                          {effect.name}
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
            </Carousel>
            {renderBulletNavigation(effectsApi, currentEffectSlide, textEffects.length)}
          </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}

    