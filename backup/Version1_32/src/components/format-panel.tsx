
"use client";

import React from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RectangleVertical, Smartphone, Square } from "lucide-react";
import { cn } from "@/lib/utils";

type CanvasSize = {
    name: 'Post' | 'Story' | 'Square';
    width: number;
    height: number;
};

type FormatPanelProps = {
  canvasSize: CanvasSize;
  setCanvasSize: (size: CanvasSize) => void;
  canvasSizes: CanvasSize[];
};

export function FormatPanel({ canvasSize, setCanvasSize, canvasSizes }: FormatPanelProps) {
  return (
    <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
      <Label className="bg-zinc-200 p-2 px-6 rounded-md">FORMAT</Label>
      <div className="grid grid-cols-3 gap-2">
        {canvasSizes.map((size) => (
          <Button
            key={size.name}
            variant="outline"
            onClick={() => setCanvasSize(size)}
            className={cn(
                "flex flex-col h-20 gap-1",
                canvasSize.name === size.name && "bg-primary/20 border-primary"
            )}
          >
            {size.name === 'Post' && <RectangleVertical className="h-6 w-6" />}
            {size.name === 'Story' && <Smartphone className="h-6 w-6" />}
            {size.name === 'Square' && <Square className="h-6 w-6" />}
            <span className="text-xs">{size.name}</span>
            <span className="text-xs text-muted-foreground">{size.name === 'Post' ? '(4:5)' : size.name === 'Story' ? '(9:16)' : '(1:1)'}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
