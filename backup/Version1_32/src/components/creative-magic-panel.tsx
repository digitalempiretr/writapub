
"use client";

import React, { useId } from "react";
import { CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUp } from "lucide-react";

type CreativeMagicPanelProps = {
  text: string;
  setText: (text: string) => void;
  handleGenerate: () => void;
  isLoading: boolean;
};

export function CreativeMagicPanel({ text, setText, handleGenerate, isLoading }: CreativeMagicPanelProps) {
  const mainTextAreaId = useId();

  return (
    <div className="space-y-6 max-w-[800px] mx-auto w-full">
      <CardTitle className="text-primary-foreground">Creative Magic</CardTitle>
      <div className="space-y-4">
        <Label htmlFor={mainTextAreaId} className="sr-only">Main text area</Label>
        <Textarea
          id={mainTextAreaId}
          name="main-text-area"
          placeholder="Paste your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          className="bg-[hsl(60,75%,97%)] text-[#2b323f] placeholder:text-gray-400 border-0"
        />
        <div className="flex items-center justify-end gap-4">
          <p className="text-xs text-[#fdfdf2]">{text.length} characters</p>
          <Button
            onClick={handleGenerate}
            disabled={isLoading}
            size="icon"
            className="rounded-full bg-primary hover:bg-[#2b323f]"
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

    