"use client";

import React, { useRef, useState, useEffect } from 'react';
import { useDesignEditor } from '@/context/DesignEditorContext';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { ImageCanvas } from '@/components/image-canvas';
import { NavBullets } from '../ui/nav-bullets';

export const CanvasContainer = () => {
    const { state, dispatch } = useDesignEditor();
    const { designs, zoomLevel, panOffset, bgColor, activeFont, ...canvasProps } = state;
    
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([]);

    useEffect(() => {
        if (!carouselApi) return;
        const onSelect = () => {
            dispatch({ type: 'SET_STATE', payload: { currentSlide: carouselApi.selectedScrollSnap() } });
        };
        carouselApi.on("select", onSelect);
        onSelect();
        return () => {
            carouselApi.off("select", onSelect);
        };
    }, [carouselApi, dispatch]);

    return (
        <div id="designs-container" className="w-full h-full flex flex-col items-center justify-center">
            <div
                className="relative"
                style={{ transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})` }}
            >
                <Carousel className="w-full" setApi={setCarouselApi}>
                    <CarouselContent>
                        {designs.map((design, index) => (
                            <CarouselItem key={index} data-index={index}>
                                <div className="p-1 group relative">
                                    <Card className="overflow-hidden border-0">
                                        <CardContent className="p-0 relative bg-card" style={{ aspectRatio: `${canvasProps.canvasSize.width}/${canvasProps.canvasSize.height}` }}>
                                            <ImageCanvas
                                                {...canvasProps}
                                                fontFamily={activeFont.fontFamily}
                                                fontWeight={activeFont.weight}
                                                backgroundColor={bgColor}
                                                text={design.text}
                                                isTitle={design.isTitle}
                                                width={canvasProps.canvasSize.width}
                                                height={canvasProps.canvasSize.height}
                                                onCanvasReady={(canvas) => {
                                                    canvasRefs.current[index] = canvas;
                                                }}
                                            />
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
            <div className="hidden md:flex md:justify-center md:items-center md:gap-2 mt-4">
                <NavBullets api={carouselApi} current={state.currentSlide} total={designs.length} />
            </div>
        </div>
    );
};
