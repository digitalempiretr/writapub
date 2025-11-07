
"use client";

import React, { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type DownloadPanelProps = {
  handleDownloadAll: () => void;
  designs: any[];
  currentSlide: number;
  handleDownload: (index: number) => void;
};

export function DownloadPanel({
  handleDownloadAll,
  designs,
  currentSlide,
  handleDownload,
}: DownloadPanelProps) {
  const baseId = useId();

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

    
