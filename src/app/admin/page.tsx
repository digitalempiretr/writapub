'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';

export default function AdminPage() {
  const { user, claims, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && (!user || claims?.role !== 'admin')) {
      router.push('/design');
    }
  }, [user, claims, isUserLoading, router]);

  if (isUserLoading || !user || claims?.role !== 'admin') {
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
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Admin Panel</h1>
        <Card>
          <CardHeader>
            <CardTitle>Welcome, Admin!</CardTitle>
            <CardDescription>
              This is your administrative dashboard. You can manage users and content from here.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Welcome, {user.email}. You have special privileges.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
