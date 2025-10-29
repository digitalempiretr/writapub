'use client';

import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { DesignTemplate } from '@/lib/types';
import { collection } from 'firebase/firestore';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { fontOptions } from "@/lib/font-options";
import { textEffects } from "@/lib/text-effects";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"


const CategoryCarousel: React.FC<{
  category: string;
  templates: DesignTemplate[];
  renderPreview: (template: DesignTemplate) => React.ReactNode;
}> = ({ category, templates, renderPreview }) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        onSelect(); // Initial call to set `current`
        return () => api.off("select", onSelect);
    }, [api]);

    const renderBulletNavigation = () => {
      if (!api) return null;
      const totalSlides = api.scrollSnapList().length;
      if (totalSlides <= 1) return null;
  
      const visibleDots = 7;
      const half = Math.floor(visibleDots / 2);
  
      let start = Math.max(current - half, 0);
      let end = start + visibleDots;
  
      if (end > totalSlides) {
        end = totalSlides;
        start = Math.max(end - visibleDots, 0);
      }
      
      const dots = [];
      for (let i = start; i < end; i++) {
          dots.push(
              <div
                  key={i}
                  data-active={i === current}
                  onClick={() => api?.scrollTo(i)}
                  className="h-2 w-2 rounded-full bg-accent cursor-pointer transition-all duration-300 bullet-indicator"
              />
          );
      }
  
      return (
        <div className="flex justify-center items-center gap-2 mt-4">
          {start > 0 && (
            <>
              <div
                key={0}
                onClick={() => api?.scrollTo(0)}
                className="h-2 w-2 rounded-full bg-accent cursor-pointer transition-all duration-300 bullet-indicator"
              />
              {start > 1 && <span className="text-foreground/50 -translate-y-1">...</span>}
            </>
          )}
          {dots}
          {end < totalSlides && (
            <>
              {end < totalSlides - 1 && <span className="text-foreground/50 -translate-y-1">...</span>}
              <div
                key={totalSlides - 1}
                onClick={() => api?.scrollTo(totalSlides - 1)}
                className="h-2 w-2 rounded-full bg-accent cursor-pointer transition-all duration-300 bullet-indicator"
              />
            </>
          )}
        </div>
      );
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent>
                <Carousel
                  setApi={setApi}
                  opts={{
                    align: "start",
                    dragFree: true,
                  }}
                  className="w-full"
                >
                    <CarouselContent className="-ml-2">
                        {templates.map(template => (
                            <CarouselItem key={template.id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2">
                                <Link href={`/design?templateId=${template.id}`}>
                                    <Card className="overflow-hidden group cursor-pointer">
                                        <CardContent className="p-0 aspect-[4/5] w-full">
                                            {renderPreview(template)}
                                        </CardContent>
                                        <CardFooter className="p-2 justify-center">
                                            <p className="text-xs font-semibold truncate">{template.name}</p>
                                        </CardFooter>
                                    </Card>
                                </Link>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                {renderBulletNavigation()}
            </CardContent>
        </Card>
    );
};


export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const myDesignsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return collection(firestore, 'users', user.uid, 'designs');
  }, [firestore, user]);

  const designTemplatesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'design-templates');
  }, [firestore]);

  const { data: myDesigns, isLoading: areDesignsLoading } = useCollection<DesignTemplate>(myDesignsQuery);
  const { data: designTemplates, loading: areTemplatesLoading } = useCollection<DesignTemplate>(designTemplatesQuery);

  const groupedTemplates = useMemo(() => {
    if (!designTemplates) return {};
    return designTemplates.reduce((acc, template) => {
        const category = template.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(template);
        return acc;
    }, {} as Record<string, DesignTemplate[]>);
  }, [designTemplates]);


  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  const renderPreview = (template: DesignTemplate) => {
    if (template.previewImage) {
      return <Image src={template.previewImage} alt={template.name} width={200} height={250} className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105" />;
    }
    
    const font = fontOptions.find(f => f.value === template.font.value);
    const effect = template.effect ? textEffects.find(e => e.id === template.effect!.id) : null;
    
    const textStyle: React.CSSProperties = {
      fontFamily: font?.fontFamily || 'sans-serif',
      color: template.font.color,
      fontWeight: 'bold',
    };
  
    if (effect && effect.style.textShadow) {
      const finalColor = effect.style.color || template.font.color;
      textStyle.color = finalColor;
      if (effect.style.fontFamily) {
        textStyle.fontFamily = effect.style.fontFamily;
      }
      const finalShadowString = effect.style.textShadow
        .replace(/{{color}}/g, finalColor)
        .replace(/{{glow}}/g, effect.style.glowColor || finalColor);
      textStyle.textShadow = finalShadowString;
    }
  
    return (
      <div 
        className="w-full h-full flex items-center justify-center p-2 text-center transition-transform duration-300 group-hover:scale-105" 
        style={{ background: template.background.value }}>
        <span 
          style={textStyle}
          className="text-lg"
        >
          {template.name}
        </span>
      </div>
    );
  };

  if (isUserLoading || areDesignsLoading || areTemplatesLoading) {
    return (
        <>
            <Header />
            <div className="container mx-auto p-4 md:p-8 space-y-12">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-12 w-1/4" />
                    <Skeleton className="h-10 w-48" />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>My Saved Designs</CardTitle>
                        <CardDescription>Here are your favorite templates. Click on one to start a new design with it.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {[...Array(5)].map((_, i) => <Skeleton key={i} className="w-full h-48" />)}
                        </div>
                    </CardContent>
                </Card>

                <div className="space-y-8">
                  {[...Array(2)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                          <Skeleton className="h-8 w-1/3" />
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-4">
                              {[...Array(4)].map((_, j) => <Skeleton key={j} className="w-1/4 h-48" />)}
                            </div>
                        </CardContent>
                    </Card>
                  ))}
                </div>
            </div>
        </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto p-4 md:p-8 space-y-12">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link href="/design">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Design
            </Link>
          </Button>
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
                         {renderPreview(design)}
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

        <div className="space-y-8">
          <h2 className="text-2xl font-bold">Design Templates</h2>
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <CategoryCarousel
              key={category}
              category={category}
              templates={templates}
              renderPreview={renderPreview}
            />
          ))}
        </div>

      </div>
    </>
  );
}
