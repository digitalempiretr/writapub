
"use client";

import React from 'react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type LayersPanelProps = {
  uploadedImages: string[];
  handleCustomImageUpload: (dataUrl: string) => void;
  addImageToCanvas: (imageUrl: string) => void;
};

export function LayersPanel({
  uploadedImages,
  handleCustomImageUpload,
  addImageToCanvas,
}: LayersPanelProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        handleCustomImageUpload(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="p-4 bg-sidebar text-sidebar-foreground rounded-b-lg space-y-4">
      <Button onClick={triggerFileSelect} className="w-full" variant="outline">
        <Upload className="mr-2 h-4 w-4" /> Upload Image
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={onFileChange}
      />
      
      {uploadedImages.length > 0 && (
        <div className="space-y-2">
          <Label>Your Layers</Label>
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2">
              {uploadedImages.map((imageUrl, index) => (
                <CarouselItem key={index} className="basis-1/3 pl-2">
                  <button onClick={() => addImageToCanvas(imageUrl)} className="w-full">
                    <Image
                      src={imageUrl}
                      alt={`Uploaded layer ${index + 1}`}
                      width={100}
                      height={100}
                      className="object-cover aspect-square rounded-md w-full"
                    />
                  </button>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      )}
    </div>
  );
}

    
