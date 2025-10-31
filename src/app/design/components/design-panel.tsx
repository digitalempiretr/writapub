
"use client";

import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HeartIconG } from "@/components/ui/icons";
import type { Design, CanvasSize } from "@/lib/types";

type DesignPanelProps = {
  designs: Design[];
  setCarouselApi: (api: CarouselApi | undefined) => void;
  canvasSize: CanvasSize;
  renderCanvas: (design: Design, index: number) => React.ReactNode;
  handleSaveDesign: () => void;
  renderBulletNavigation: () => React.ReactNode;
  designsRef: React.RefObject<HTMLDivElement>;
  handleMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleMouseUp: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleZoom: (direction: 'in' | 'out') => void;
  panOffset: { x: number; y: number };
  zoomLevel: number;
};

export const DesignPanel: React.FC<DesignPanelProps> = ({
  designs,
  setCarouselApi,
  canvasSize,
  renderCanvas,
  handleSaveDesign,
  renderBulletNavigation,
  designsRef,
  handleMouseDown,
  handleMouseMove,
  handleMouseUp,
  handleZoom,
  panOffset,
  zoomLevel,
}) => {
  return (
    <div
      ref={designsRef}
      className="w-full h-full flex flex-col items-center justify-center cursor-grab"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={(e) => {
        const activeElement = document.activeElement;
        if (activeElement && (activeElement.tagName === 'TEXTAREA' || activeElement.tagName === 'INPUT')) {
          return;
        }
        e.preventDefault();
        const direction = e.deltaY > 0 ? 'out' : 'in';
        handleZoom(direction);
      }}
    >
      <div
        className="relative transition-transform duration-75"
        style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})` }}
      >
        <Carousel className="w-full" setApi={setCarouselApi}>
          <CarouselContent>
            {designs.map((design, index) => (
              <CarouselItem key={index} data-index={index}>
                <div className="p-1 group relative">
                  <Card className="overflow-hidden border-0">
                    <CardContent className="p-0 relative bg-card" style={{ aspectRatio: `${canvasSize.width}/${canvasSize.height}`}}>
                      {renderCanvas(design, index)}
                    </CardContent>
                  </Card>
                  <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <AlertDialog>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-14 w-14 flex items-center justify-center rounded-full bg-gray/20 backdrop-blur-sm text-white hover:bg-red/50 hover:text-red-400 [&_svg]:size-8"
                              >
                                <HeartIconG className="h-12 w-12" />
                              </Button>
                            </AlertDialogTrigger>
                          </TooltipTrigger>
                          <TooltipContent side="left">
                            <p>Save to Favorites</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will save the current background, font, and color settings as a new favorite template.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSaveDesign}>Save</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      {renderBulletNavigation()}
    </div>
  );
};
