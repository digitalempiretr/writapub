
'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { getAuth, GoogleAuthProvider, signInWithRedirect, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { Icons } from '@/components/ui/icons';
import { initializeFirebase } from '@/firebase';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function WelcomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const { auth } = initializeFirebase();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        router.push('/home');
      } else {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleGoogleLogin = () => {
    setIsLoading(true);
    const { auth, firestore } = initializeFirebase();
    const provider = new GoogleAuthProvider();
    
    // We will use onAuthStateChanged to handle the redirect result
    signInWithRedirect(auth, provider).catch(error => {
      console.error("Google sign-in error:", error);
      toast({
        variant: 'destructive',
        title: 'Giriş Hatası',
        description: error.message,
      });
      setIsLoading(false);
    });
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
        toast({
            variant: "destructive",
            title: "Eksik Bilgi",
            description: "Lütfen e-posta ve şifre alanlarını doldurun.",
        });
        return;
    }

    setIsLoading(true);
    const { auth, firestore } = initializeFirebase();

    try {
        let userCredential;
        if (isSignUp) {
            // Sign Up
            userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save new user data to Firestore
            const userRef = doc(firestore, 'users', user.uid);
            const { uid } = user;
            const displayName = user.displayName || email.split('@')[0];

            await setDoc(userRef, {
                id: uid,
                displayName,
                email,
                profileImageUrl: user.photoURL || `https://i.pravatar.cc/150?u=${uid}`,
                googleId: null, 
            }, { merge: true });

        } else {
            // Sign In
            userCredential = await signInWithEmailAndPassword(auth, email, password);
        }
        // onAuthStateChanged will handle the redirect
    } catch (error: any) {
        let description = "Bir hata oluştu. Lütfen tekrar deneyin.";
        switch (error.code) {
            case 'auth/user-not-found':
                description = "Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.";
                break;
            case 'auth/wrong-password':
                description = "Hatalı şifre. Lütfen tekrar deneyin.";
                break;
            case 'auth/email-already-in-use':
                description = "Bu e-posta adresi zaten kullanılıyor.";
                break;
            case 'auth/weak-password':
                description = "Şifre en az 6 karakter uzunluğunda olmalıdır.";
                break;
             case 'auth/invalid-email':
                description = "Geçersiz e-posta adresi.";
                break;
            default:
                description = error.message;
        }
        toast({
            variant: "destructive",
            title: isSignUp ? "Kayıt Hatası" : "Giriş Hatası",
            description: description,
        });
        setIsLoading(false);
    }
};

  if (isLoading) {
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
            {isSignUp ? "Hesap Oluştur" : "Writa'ya Hoş Geldiniz"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {isSignUp ? "Başlamak için bilgilerinizi girin." : "Tüm özelliklere erişmek için giriş yapın"}
          </p>
          
          <div className="space-y-4 text-left">
              <div className="space-y-2">
                  <Label htmlFor="email">E-posta</Label>
                  <Input 
                      id="email" 
                      type="email" 
                      placeholder="ornek@eposta.com" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required 
                  />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="password">Şifre</Label>
                  <Input 
                      id="password" 
                      type="password" 
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required 
                  />
              </div>
              <Button onClick={handleEmailAuth} size="lg" disabled={isLoading} className="w-full">
                {isLoading ? 'İşleniyor...' : (isSignUp ? 'Kayıt Ol' : 'Giriş Yap')}
              </Button>
          </div>

          <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                  veya
                  </span>
              </div>
          </div>
          <Button onClick={handleGoogleLogin} size="lg" variant="outline" disabled={isLoading} className="w-full">
            <Icons.google className="mr-2 h-4 w-4"/>
            Google ile Devam Et
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isSignUp ? "Zaten bir hesabınız var mı?" : "Hesabınız yok mu?"}{' '}
            <button onClick={() => setIsSignUp(!isSignUp)} className="underline font-semibold hover:text-primary">
              {isSignUp ? "Giriş Yap" : "Kayıt Ol"}
            </button>
          </p>
      </div>
      <footer className="fixed bottom-0 w-full p-6 text-center text-xs text-muted-foreground">
        <p>By logging in, you agree to our <a href="/terms" className="underline">Terms of Service</a> and <a href="/privacy" className="underline">Privacy Policy</a></p>
        <p>copyright © 2025 Powered by Writa</p>
      </footer>
    </div>
  );
}
