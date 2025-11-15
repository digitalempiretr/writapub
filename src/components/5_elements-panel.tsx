
"use client";

import React, { useId, useState } from "react";
import { useDesignEditor } from "@/context/DesignEditorContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlignCenter, AlignLeft, AlignRight, Circle, ImageUp, Plus, Settings, Trash2, Square as SquareIcon } from "lucide-react";
import { Separator } from "./ui/separator";
import Image from "next/image";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Switch } from "./ui/switch";

export type CanvasElement = {
  id: string;
  type: 'image' | 'text';
  url?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  shape: 'square' | 'circle';
  alignment: 'left' | 'center' | 'right';
};

export function ElementsPanel() {
  const { state, dispatch } = useDesignEditor();
  const { elements, selectedElement, areElementsEnabled } = state;
  
  const fileInputId = useId();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const setElements = (updater: (prev: CanvasElement[]) => CanvasElement[]) => {
    const newElements = updater(elements);
    dispatch({ type: 'SET_ELEMENTS', payload: newElements });
  };
  const setSelectedElement = (id: string | null) => dispatch({ type: 'SET_STATE', payload: { selectedElement: id } });
  const setAreElementsEnabled = (enabled: boolean) => dispatch({ type: 'SET_STATE', payload: { areElementsEnabled: enabled } });
  const updateElement = (id: string, newProps: Partial<CanvasElement>) => dispatch({ type: 'UPDATE_ELEMENT', payload: { id, newProps } });

  const currentElement = elements.find(el => el.id === selectedElement);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const newElement: CanvasElement = {
          id: `element-${Date.now()}`,
          type: 'image',
          url: reader.result as string,
          x: 50,
          y: 50,
          width: 150,
          height: 150,
          rotation: 0,
          opacity: 1,
          shape: 'square',
          alignment: 'left',
        };
        setElements(prev => [...prev, newElement]);
        setSelectedElement(newElement.id);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteElement = (id: string) => {
    setElements(prev => prev.filter(el => el.id !== id));
    if (selectedElement === id) {
        setSelectedElement(null);
    }
  };

  const openSettingsForElement = (id: string) => {
    setSelectedElement(id);
    setIsPopoverOpen(true);
  }

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <div className="flex justify-start items-center">
        <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
          <PopoverTrigger asChild>
            <Button size="sm"><Plus className="mr-2 h-4 w-4" /> Add Photo</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
                  <div className="space-y-1">
                      <h4 className="font-medium leading-none">Add Logo or Profile Photo</h4>
                      <p className="text-sm text-muted-foreground">
                          Upload an image to place on the canvas.
                      </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      id={fileInputId}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Label
                      htmlFor={fileInputId}
                      className="flex-grow inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 cursor-pointer"
                    >
                      <ImageUp className="mr-2 h-4 w-4" />
                      Choose a file...
                    </Label>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                      <Label htmlFor="elements-toggle" className="flex flex-col space-y-1">
                          <span>Show Elements</span>
                           <span className="font-normal leading-snug text-muted-foreground">
                            Toggle visibility of all logos on canvas.
                          </span>
                      </Label>
                      <Switch
                          id="elements-toggle"
                          checked={areElementsEnabled}
                          onCheckedChange={setAreElementsEnabled}
                      />
                  </div>
                  {currentElement && areElementsEnabled && (
                    <div className="space-y-4 pt-4 border-t">
                        <Label className="font-medium">Selected Element Settings</Label>
                        <div className="space-y-2">
                            <Label className="text-xs">Shape</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant={currentElement.shape === 'square' ? 'secondary' : 'outline'} size="sm" onClick={() => updateElement(currentElement.id, { shape: 'square' })}>
                                    <SquareIcon className="mr-2 h-4 w-4" /> Square
                                </Button>
                                <Button variant={currentElement.shape === 'circle' ? 'secondary' : 'outline'} size="sm" onClick={() => updateElement(currentElement.id, { shape: 'circle' })}>
                                    <Circle className="mr-2 h-4 w-4" /> Circle
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Alignment</Label>
                            <div className="grid grid-cols-3 gap-2">
                                <Button variant={currentElement.alignment === 'left' ? 'secondary' : 'outline'} size="sm" onClick={() => updateElement(currentElement.id, { alignment: 'left' })}>
                                    <AlignLeft className="mr-2 h-4 w-4" /> Left
                                </Button>
                                <Button variant={currentElement.alignment === 'center' ? 'secondary' : 'outline'} size="sm" onClick={() => updateElement(currentElement.id, { alignment: 'center' })}>
                                    <AlignCenter className="mr-2 h-4 w-4" /> Center
                                </Button>
                                <Button variant={currentElement.alignment === 'right' ? 'secondary' : 'outline'} size="sm" onClick={() => updateElement(currentElement.id, { alignment: 'right' })}>
                                    <AlignRight className="mr-2 h-4 w-4" /> Right
                                </Button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="opacity-slider" className="text-xs">Opacity</Label>
                            <div className="flex items-center gap-2">
                                <Slider
                                    id="opacity-slider"
                                    min={0}
                                    max={1}
                                    step={0.01}
                                    value={[currentElement.opacity]}
                                    onValueChange={(value) => updateElement(currentElement.id, { opacity: value[0] })}
                                />
                                <span className="text-xs font-mono p-1.5 border rounded-md">{Math.round(currentElement.opacity * 100)}</span>
                            </div>
                        </div>
                    </div>
                  )}
              </div>
          </PopoverContent>
        </Popover>
      </div>
       <Separator />
        <div className="space-y-2">
            {elements.length > 0 ? (
                <div className="space-y-2">
                    {elements.map(el => (
                         <div 
                            key={el.id} 
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-md border",
                                selectedElement === el.id ? "border-primary bg-primary/10" : "border-border"
                            )}
                        >
                            <Image src={el.url!} alt="element" width={40} height={40} className="rounded object-cover aspect-square"/>
                            <p className="text-sm font-medium truncate flex-grow">Element</p>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openSettingsForElement(el.id)}>
                                <Settings className="h-4 w-4 text-muted-foreground"/>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); handleDeleteElement(el.id); }}>
                                <Trash2 className="h-4 w-4 text-destructive"/>
                            </Button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                  <p className="text-sm text-muted-foreground">No elements added yet.</p>
                  <p className="text-xs text-muted-foreground">Click "Add Photo" to upload your logo.</p>
                </div>
            )}
        </div>
    </div>
  );
}
