"use client";

import React, { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUp } from "lucide-react";

type ElementsPanelProps = {
  handleImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export function ElementsPanel({ handleImageUpload }: ElementsPanelProps) {
  const fileInputId = useId();

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4 mobile-tab-content">
      <div className="space-y-2">
        <Label>Upload Image</Label>
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
        <p className="text-xs text-muted-foreground">
          Upload your own image to use as an element on the canvas.
        </p>
      </div>
    </div>
  );
}
