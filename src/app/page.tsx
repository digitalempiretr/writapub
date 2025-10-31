"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-background text-foreground">
      <div className="text-center space-y-6">
        <Logo className="text-6xl text-primary mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Welcome to WritA
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
          Your creative partner for generating stunning social media visuals. Turn your text into beautiful, shareable designs in seconds.
        </p>
        <div className="flex justify-center gap-4">
            <Link href="/design">
                <Button size="lg" className="text-lg px-8 py-6">
                    Start Designing
                </Button>
            </Link>
        </div>
      </div>
    </main>
  );
}
