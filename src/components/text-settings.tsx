
"use client";

import React, { useId } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Input } from "@/components/ui/input";
import { TextColorChooseIcon, TextBgBoxIcon, TextBoxOpacity, TextStrokeIcon } from "@/components/ui/icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FontOption } from "@/components/image-canvas";
import { Button } from "@/components/ui/button";
import { Bold, CaseUpper, Sparkles, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { defaultSolidColors } from "@/lib/colors";

type TextSettingsProps = {
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
  textShadow: boolean;
  setTextShadow: (value: boolean) => void;
  shadowColor: string;
  setShadowColor: (value: string) => void;
  shadowBlur: number;
  setShadowBlur: (value: number) => void;
  shadowOffsetX: number;
  setShadowOffsetX: (value: number) => void;
  shadowOffsetY: number;
  setShadowOffsetY: (value: number) => void;
  textStroke: boolean;
  setTextStroke: (value: boolean) => void;
  strokeColor: string;
  setStrokeColor: (value: string) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  rectBgColor: string;
  handleRectBgChange: (color: string) => void;
  rectOpacity: number;
  setRectOpacity: (value: number) => void;
};

export function TextSettings({
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
  textShadow,
  setTextShadow,
  shadowColor,
  setShadowColor,
  shadowBlur,
  setShadowBlur,
  shadowOffsetX,
  setShadowOffsetX,
  shadowOffsetY,
  setShadowOffsetY,
  textStroke,
  setTextStroke,
  strokeColor,
  setStrokeColor,
  strokeWidth,
  setStrokeWidth,
  rectBgColor,
  handleRectBgChange,
  rectOpacity,
  setRectOpacity,
}: TextSettingsProps) {
  const baseId = useId();

  return (
    <TooltipProvider>
      <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
        <Label className="bg-zinc-200 p-2 px-6 rounded-md">TEXT SETTINGS</Label>
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <Label>Text Color & Font</Label>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative h-10 w-10">
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
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
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
              <div className="flex-grow">
                <Select value={activeFont.value} onValueChange={handleFontChange}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SelectTrigger className="w-full flex-grow" id={`${baseId}-font-select`} aria-label="Select Font">
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
            </div>
          </div>
          <div className="pt-4">
            <Carousel className="w-full" opts={{ dragFree: true }}>
              <CarouselContent>
                {defaultSolidColors.map(color => (
                  <CarouselItem key={color} className="basis-1/7">
                    <Card className="overflow-hidden cursor-pointer" onClick={() => setTextColor(color)}>
                      <CardContent className="h-20" style={{ backgroundColor: color }} />
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4" />
              <CarouselNext className="-right-4" />
            </Carousel>
          </div>
          <div className="space-y-2">
            <Label>Style & Alignment</Label>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" data-active={isBold} onClick={() => setIsBold(!isBold)} className="data-[active=true]:bg-primary/20">
                    <Bold className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Bold</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" data-active={isUppercase} onClick={() => setIsUppercase(!isUppercase)} className="data-[active=true]:bg-primary/20">
                    <CaseUpper className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>Uppercase</p></TooltipContent>
              </Tooltip>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Sparkles className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Text Shadow</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-64 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`${baseId}-shadow-toggle`}>Text Shadow</Label>
                    <Switch id={`${baseId}-shadow-toggle`} checked={textShadow} onCheckedChange={setTextShadow} />
                  </div>
                  {textShadow && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Label>Color</Label>
                        <Input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="h-8 p-1"/>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${baseId}-shadow-blur`}>Blur</Label>
                        <Slider id={`${baseId}-shadow-blur`} max={40} min={0} step={1} value={[shadowBlur]} onValueChange={(v) => setShadowBlur(v[0])} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${baseId}-shadow-offset-x`}>X Offset</Label>
                        <Slider id={`${baseId}-shadow-offset-x`} max={20} min={-20} step={1} value={[shadowOffsetX]} onValueChange={(v) => setShadowOffsetX(v[0])} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`${baseId}-shadow-offset-y`}>Y Offset</Label>
                        <Slider id={`${baseId}-shadow-offset-y`} max={20} min={-20} step={1} value={[shadowOffsetY]} onValueChange={(v) => setShadowOffsetY(v[0])} />
                      </div>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
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
              <DropdownMenu>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
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
            </div>
          </div>
          <div className="space-y-2">
            <Label>Text Box</Label>
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="relative h-10 w-10">
                    <Label htmlFor={`${baseId}-rect-bg-color-picker`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
                      <TextBgBoxIcon color={rectBgColor}/>
                    </Label>
                    <Input
                      id={`${baseId}-rect-bg-color-picker`}
                      type="color"
                      value={rectBgColor}
                      onChange={(e) => handleRectBgChange(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Text Box Color</p>
                </TooltipContent>
              </Tooltip>
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <TextBoxOpacity />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Text Box Opacity</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-56 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`${baseId}-rect-opacity-slider`}>Transparency</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id={`${baseId}-rect-opacity-slider`}
                        max={1}
                        min={0}
                        step={0.01}
                        value={[rectOpacity]}
                        onValueChange={(value) => setRectOpacity(value[0])}
                        className="flex-grow"
                      />
                      <div className="text-sm p-2 rounded-md border border-input tabular-nums w-14 text-center">
                        {Math.round(rectOpacity * 100)}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        
      </div>
    </TooltipProvider>
  );
}
