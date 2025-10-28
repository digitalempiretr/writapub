
'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { GoogleAuthProvider, signInWithRedirect, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { Icons } from '@/components/ui/icons';
import { useUser, useAuth, initializeFirebase } from '@/firebase'; // Import useAuth
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function WelcomePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth(); // Get the shared auth instance from the provider
  const router = useRouter();
  const { toast } = useToast();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // This effect handles redirecting the user if they are already logged in.
  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/home');
    }
  }, [user, isUserLoading, router]);

  const handleGoogleLogin = () => {
    setIsProcessing(true);
    const provider = new GoogleAuthProvider();
    // Use the auth instance from the context
    signInWithRedirect(auth, provider).catch(error => {
      console.error("Google sign-in error:", error);
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: error.message,
      });
      setIsProcessing(false);
    });
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please enter both email and password.",
        });
        return;
    }

    setIsProcessing(true);
    const { firestore } = initializeFirebase(); // Firestore can be initialized here for the one-off write.

    try {
        let userCredential;
        if (isSignUp) {
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const userRef = doc(firestore, 'users', user.uid);
            await setDoc(userRef, {
                id: user.uid,
                displayName: user.displayName || email.split('@')[0],
                email: user.email,
                profileImageUrl: user.photoURL || `https://i.pravatar.cc/150?u=${user.uid}`,
                googleId: null,
            }, { merge: true });
        } else {
            await signInWithEmailAndPassword(auth, email, password);
        }
        // No need to redirect here, the `useEffect` above will handle it when `user` state changes.
    } catch (error: any) {
        let description = "An unexpected error occurred. Please try again.";
        switch (error.code) {
            case 'auth/user-not-found':
                description = "No user found with this email address.";
                break;
            case 'auth/wrong-password':
                description = "Incorrect password. Please try again.";
                break;
            case 'auth/email-already-in-use':
                description = "This email address is already in use.";
                break;
            case 'auth/weak-password':
                description = "Password should be at least 6 characters long.";
                break;
             case 'auth/invalid-email':
                description = "Invalid email address format.";
                break;
            default:
                description = error.message;
        }
        toast({
            variant: "destructive",
            title: isSignUp ? "Sign Up Failed" : "Sign In Failed",
            description: description,
        });
    } finally {
        setIsProcessing(false);
    }
};

  if (isUserLoading || user) {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
            background: 'linear-gradient(to top right, #ffc0cb, #87ceeb)'
          }}>
              <div className="flex justify-center mb-8">
                  <Lottie animationData={webflowAnimation} loop={true} className="h-48 w-48" />
              </div>
          </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-foreground">
      <div className="w-full max-w-sm">
          <div className="flex justify-center mb-8">
              <Logo className="h-12 w-auto text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            {showEmailForm ? (isSignUp ? "Create an Account" : "Welcome Back") : "Welcome to Writa"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {showEmailForm ? (isSignUp ? "Enter your details to start." : "Sign in to access all features.") : "Sign in or create an account to continue."}
          </p>
          
          {showEmailForm ? (
            <div className="space-y-4 text-left">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <Button onClick={handleEmailAuth} size="lg" disabled={isProcessing} className="w-full">
                  {isProcessing ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Sign In')}
                </Button>
                 <p className="mt-6 text-center text-sm text-muted-foreground">
                    {isSignUp ? "Already have an account?" : "Don't have an account?"}{' '}
                    <button onClick={() => setIsSignUp(!isSignUp)} className="underline font-semibold hover:text-primary">
                      {isSignUp ? "Sign In" : "Sign Up"}
                    </button>
                </p>
                <Button variant="link" onClick={() => setShowEmailForm(false)} className="w-full text-muted-foreground">
                    &larr; Back to all options
                </Button>
            </div>
          ) : (
            <div className="space-y-4">
                <Button onClick={handleGoogleLogin} size="lg" variant="outline" disabled={isProcessing} className="w-full">
                    <Icons.google className="mr-2 h-4 w-4"/>
                    Continue with Google
                </Button>
                <Button onClick={() => setShowEmailForm(true)} size="lg" disabled={isProcessing} className="w-full bg-muted text-muted-foreground hover:bg-muted/90">
                    <Icons.mail className="mr-2 h-4 w-4"/>
                    Continue with Email
                </Button>
            </div>
          )}
      </div>
      <footer className="fixed bottom-0 w-full p-6 text-center text-xs text-muted-foreground">
        <p>By logging in, you agree to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a></p>
        <p>copyright © 2025 Powered by Writa</p>
      </footer>
    </div>
  );
}
