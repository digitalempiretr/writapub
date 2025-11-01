
"use client";

import React, { useId } from "react";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUp } from "lucide-react";
import { Input } from "./ui/input";

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

  return (
    <div className="space-y-10 max-w-[1000px] mx-auto w-full">
      <CardTitle className="text-foreground text-3xl md:text-5xl text-center font-sans ">What will you <span className = "text-primary">Write </span>today?</CardTitle>
      <div className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor={titleId}>Title (Optional)</Label>
            <Input
                id={titleId}
                placeholder="Enter your title here..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="rounded-lg text-lg text-card-foreground placeholder:text-muted-foreground border-1 shadow font-serif"
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor={mainTextAreaId}>Body Text</Label>
            <div className="relative text-xl rounded-lg">
            <Textarea
                id={mainTextAreaId}
                name="main-text-area"
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                className="rounded-lg relative z-10 text-xl text-card-foreground placeholder:text-muted-foreground border-1 shadow font-serif "
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
