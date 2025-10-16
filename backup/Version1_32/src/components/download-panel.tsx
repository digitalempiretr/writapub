
"use client";

import React, { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type DownloadPanelProps = {
  fileName: string;
  setFileName: (name: string) => void;
  handleDownloadAll: () => void;
  designs: any[];
  currentSlide: number;
  handleDownload: (index: number) => void;
};

export function DownloadPanel({
  fileName,
  setFileName,
  handleDownloadAll,
  designs,
  currentSlide,
  handleDownload,
}: DownloadPanelProps) {
  const baseId = useId();

  return (
    <div className="p-4 bg-[#f4fdff] text-card-foreground rounded-b-lg space-y-4">
      <Label className="bg-zinc-200 p-2 px-6 rounded-md">DOWNLOAD SETTINGS</Label>
      <div className="space-y-2">
        <Label htmlFor={`${baseId}-file-name`}>File Name</Label>
        <Input
          id={`${baseId}-file-name`}
          name="file-name"
          type="text"
          placeholder="Enter file name..."
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
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
        >
          <Download className="mr-2 h-4 w-4" />
          Download This Design
        </Button>
      </div>
    </div>
  );
}

    