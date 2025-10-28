'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { getAuth, GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { Icons } from '@/components/ui/icons';

export default function WelcomePage() {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const [isLoginInProgress, setIsLoginInProgress] = useState(false);
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push('/home');
    }
  }, [user, isAuthLoading, router]);

  const isLoading = isAuthLoading || isLoginInProgress;

  useEffect(() => {
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSplashScreen(false);
      }, 1000); // Wait for 1 extra second after loading is finished

      return () => clearTimeout(timer);
    }
  }, [isLoading]);


  const handleGoogleLogin = () => {
    setIsLoginInProgress(true);
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch(error => {
        console.error("Google sign-in error:", error);
        setIsLoginInProgress(false);
    });
  };
  
  const handleEmailLogin = () => {
    console.log("Email login not implemented");
  }

  // Splash screen
  if (showSplashScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
        background: 
        'linear-gradient(to top right, var(--primary), var(--primary), var(--primary)'
      }}>
          <div className="flex justify-center mb-8">
              <Logo className="h-30 w-auto text-muted text-4xl text-center" />
              
          </div>
          
          
      </div>
    );
  }
  // End of splash screen

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-foreground">
      <div className="w-full max-w-xs">
          <div className="flex justify-center mb-8">
              <Logo className="h-12 w-auto text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome to Writa
          </h2>
          <p className="text-muted-foreground mb-8">
            Unlock all features by logging in
          </p>
          <div className="space-y-3">
              <Button onClick={handleGoogleLogin} size="lg" disabled={isLoading} className="w-full bg-muted text-muted-foreground hover:bg-muted/90">
                <Icons.google className="mr-2 h-4 w-4"/>
                Continue with Google
              </Button>
              <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                      or
                      </span>
                  </div>
              </div>
              <Button onClick={handleEmailLogin} size="lg" disabled={isLoading} className="w-full bg-muted text-muted-foreground hover:bg-muted/90">
                <Icons.mail className="mr-2 h-4 w-4"/>
                Continue with Email
              </Button>
          </div>
      </div>
      <footer className="fixed bottom-0 w-full p-6 text-center text-xs text-muted-foreground">
        <p>By logging in, you agree to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a></p>
        <p>copyright © 2025 Powered by Writa</p>
      </footer>
    </div>
  );
}
