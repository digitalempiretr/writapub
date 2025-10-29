'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import type { DesignTemplate } from '@/lib/types';
import { collection, writeBatch, doc, query, where } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const myDesignsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'users', user.uid, 'designs'), where('userId', '==', user.uid));
  }, [firestore, user]);

  const { data: myDesigns, isLoading: areMyDesignsLoading } = useCollection<DesignTemplate>(myDesignsQuery);

  const designTemplatesQuery = useMemoFirebase(() => {
    if(!firestore) return null;
    return collection(firestore, 'design-templates');
  }, [firestore]);

  const { data: designTemplates, isLoading: areTemplatesLoading } = useCollection<DesignTemplate>(designTemplatesQuery);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || areMyDesignsLoading || areTemplatesLoading || !user) {
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
      <div className="container mx-auto p-4 md:p-8 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button asChild>
              <Link href="/design">
                <PlusCircle className="mr-2 h-4 w-4" /> Create New Design
              </Link>
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Saved Designs</CardTitle>
            <CardDescription>
              Here are your favorite templates. Click on one to start a new design with it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {myDesigns && myDesigns.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {myDesigns.map(design => (
                  <Link href={`/design?templateId=${design.id}`} key={design.id}>
                    <Card className="overflow-hidden group cursor-pointer">
                      <CardContent className="p-0 aspect-[4/5] w-full">
                         <Image src={design.previewImage} alt={design.name} width={200} height={250} className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105" />
                      </CardContent>
                       <CardFooter className="p-2 justify-center">
                          <p className="text-xs font-semibold truncate">{design.name}</p>
                       </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You haven&apos;t saved any designs yet.</p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/design">Start creating your first design!</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Design Templates</CardTitle>
            <CardDescription>
              Get started with one of our pre-made templates.
            </CardDescription>
          </CardHeader>
          <CardContent>
             {designTemplates && designTemplates.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {designTemplates.map(template => (
                  <Link href={`/design?templateId=${template.id}`} key={template.id}>
                    <Card className="overflow-hidden group cursor-pointer">
                      <CardContent className="p-0 aspect-[4/5] w-full">
                         <Image src={template.previewImage || 'https://placehold.co/200x250'} alt={template.name} width={200} height={250} className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105" />
                      </CardContent>
                       <CardFooter className="p-2 justify-center">
                          <p className="text-xs font-semibold truncate">{template.name}</p>
                       </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
                 <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">No design templates available. An admin needs to seed the database.</p>
                 </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
