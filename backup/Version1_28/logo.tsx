
import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cn("font-['Libertinus_Keyboard'] uppercase text-[#f4fdff]", className)}
      {...props}
    >
      Writa
    </h1>
  );
}
