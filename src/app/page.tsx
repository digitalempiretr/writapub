'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';

export default function WelcomePage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
  };

  if (isUserLoading || user) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen bg-background">
        <div className="w-64 h-64">
          <Lottie animationData={webflowAnimation} loop={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
      <Logo className="text-7xl md:text-8xl text-primary mb-4" />
      <h2 className="text-xl md:text-2xl text-foreground mb-8 font-serif">
        Create beautiful, shareable posts from your text in seconds.
      </h2>
      <div className="max-w-4xl mx-auto mb-12">
        <video
          className="rounded-lg shadow-2xl border"
          src="https://cdn.dribbble.com/userupload/11831448/file/original-5979201b13b708b7921855325a75b7a5.mp4"
          autoPlay
          loop
          muted
          playsInline
        ></video>
      </div>
      <Button onClick={handleLogin} size="lg" disabled={isUserLoading}>
        {isUserLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          'Get Started with Google'
        )}
      </Button>
    </div>
  );
}
