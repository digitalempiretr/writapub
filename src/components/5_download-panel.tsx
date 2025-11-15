
"use client";

import React from "react";
import { useDesignEditor } from "@/context/DesignEditorContext";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadPanel() {
  const { state } = useDesignEditor();
  const { designs, currentSlide } = state;

  // Note: The actual download logic will need access to the canvas references,
  // which are now in CanvasContainer. This could be handled by passing a function
  // down or using a ref that's accessible via context. For now, this is a placeholder.

  const handleDownload = (index: number) => {
    console.log(`Placeholder: Download slide ${index}`);
    // The actual logic would be:
    // const canvas = canvasRefs.current[index];
    // if (canvas) { ... }
  };
  
  const handleDownloadAll = () => {
    console.log("Placeholder: Download all slides");
  };

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4">
      <div className="flex justify-around items-center pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDownloadAll}
          disabled={designs.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Download All
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload(currentSlide)}
          disabled={designs.length === 0}
        >
          <Download className="mr-2 h-4 w-4" />
          Download This Design
        </Button>
      </div>
    </div>
  );
}
