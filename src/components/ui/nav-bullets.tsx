"use client";

import React from 'react';
import { type CarouselApi } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type NavBulletsProps = {
  api: CarouselApi | undefined;
  current: number;
  total: number;
  className?: string;
};

export function NavBullets({ api, current, total, className }: NavBulletsProps) {
  if (!api || total <= 1) return null;

  const visibleDots = 6;
  const half = Math.floor(visibleDots / 2);

  let start = Math.max(current - half, 0);
  let end = start + visibleDots - 1;

  if (end >= total) {
    end = total - 1;
    start = Math.max(end - visibleDots + 1, 0);
  }

  const dots = [];
  for (let i = start; i <= end; i++) {
    dots.push(
      <div
        key={i}
        data-active={i === current}
        onClick={() => api?.scrollTo(i)}
        className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
      />
    );
  }

  return (
    <div className={cn("flex justify-center items-center gap-2", className)}>
      {start > 0 && (
        <>
          <div
            key={0}
            onClick={() => api?.scrollTo(0)}
            className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
          />
          {start > 1 && <span className="text-foreground/50 -translate-y-0">・</span>}
        </>
      )}
      {dots}
      {end < total - 1 && (
        <>
          {end < total - 2 && <span className="text-foreground/50 -translate-y-0">・</span>}
          <div
            key={total - 1}
            onClick={() => api?.scrollTo(total - 1)}
            className="h-2 w-2 rounded-full bg-foreground cursor-pointer transition-all duration-300 bullet-indicator"
          />
        </>
      )}
    </div>
  );
}
