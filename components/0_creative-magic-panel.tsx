
"use client";

import React, { useId } from "react";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUp, Info } from "lucide-react";
import { Input } from "./ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

type CreativeMagicPanelProps = {
  title: string;
  setTitle: (title: string) => void;
  text: string;
  setText: (text: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
};

export function CreativeMagicPanel({ title, setTitle, text, setText, handleGenerate, isLoading }: CreativeMagicPanelProps) {
  const titleId = useId();
  const mainTextAreaId = useId();
  const isMobile = useIsMobile();

  const infoContent = "As The Cover Design (1st Carousel Item).";

  const renderInfoIcon = () => {
    if (isMobile) {
      return (
        <Dialog>
          <DialogTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-muted-foreground">The Text Written Title Will Be Used</DialogTitle>
              <DialogDescription>
                {infoContent}
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-pointer hover:text-primary" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{infoContent}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="space-y-10 max-w-[1000px] mx-auto w-full">
      <CardTitle className="text-foreground text-3xl md:text-2xl text-left font-serif">Hi, <span className = "text-primary">
        [Users Name] </span></CardTitle>
      <div className="space-y-4">
        <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label className="border-s-4 border-primary px-2 font-bold font-sans text-xl" htmlFor={titleId}>Title</Label>
              {renderInfoIcon()}
            </div>
            <Input
                id={titleId}
                placeholder="For cover, first page text...(optional)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg relative z-10 text-md md:text-lg text-card-foreground placeholder:text-muted-foreground border-1 shadow "
            />
        </div>
        <div className="space-y-2">
            <Label className="border-s-4 border-primary px-2 font-bold font-sans text-xl" htmlFor={mainTextAreaId}>What will you<span className = "text-primary"> Write </span>today?</Label>
            <div className="relative text-md md:text-lg rounded-lg">
            <Textarea
                id={mainTextAreaId}
                name="main-text-area"
                placeholder="Your magnificent text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="rounded-lg relative z-10 text-md md:text-lg text-card-foreground placeholder:text-muted-foreground border-1 shadow  "
            />
            </div>
        </div>
        <div className="flex items-center justify-end gap-4">
          <p className="text-xs text-foreground">{text.length} characters</p>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            size="icon"
            className="rounded-full bg-primary hover:bg-background text-primary-foreground hover:text-primary"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
