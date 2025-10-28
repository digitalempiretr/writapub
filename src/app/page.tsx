'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { Icons } from '@/components/ui/icons';
import { initializeFirebase } from '@/firebase';

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { auth, firestore } = initializeFirebase();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is signed in. Check if they are a new user.
        const userRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
          // New user: Save their profile information to Firestore.
          const { displayName, email, photoURL, uid } = user;
          await setDoc(userRef, {
            id: uid,
            displayName,
            email,
            profileImageUrl: photoURL,
            googleId: uid,
          }, { merge: true }); // Use merge:true to avoid overwriting existing data if any
        }
        
        // Redirect to the home page for both new and existing users.
        router.push('/home');
      } else {
        // No user is signed in, show the login page.
        setIsLoading(false);
      }
    }, (error) => {
      console.error("onAuthStateChanged error:", error);
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider).catch(error => {
        console.error("Google sign-in error:", error);
        setIsLoading(false);
    });
  };
  
  const handleEmailLogin = () => {
    console.log("Email login not implemented");
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
        background: 'linear-gradient(to top right, #FFC0CB, #87CEEB)'
      }}>
          <div className="flex justify-center mb-8">
              <Lottie animationData={webflowAnimation} loop={true} className="h-48 w-48" />
          </div>
      </div>
    );
  }

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
