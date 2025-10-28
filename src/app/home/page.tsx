'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';

export default function HomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
        background: 'linear-gradient(to top right, var(--primary), var(--secondary), var(--accent))'
      }}>
          <div className="w-64 h-64">
              <Lottie animationData={webflowAnimation} loop={true} />
          </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center flex-1 h-full">
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome Home</h1>
            <p className="text-muted-foreground mb-8">Ready to create something amazing?</p>
            <Button asChild size="lg">
                <Link href="/enter-text">
                <PlusCircle className="mr-2 h-5 w-5" /> Create New Design
                </Link>
            </Button>
        </div>
      </div>
    </>
  );
}
