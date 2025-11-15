'use client';
import React from 'react';
import { useDesignEditor } from '@/context/DesignEditorContext';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Smartphone, RectangleVertical, Square, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { canvasSizes, CanvasSize } from '@/lib/canvas-sizes';

const ZOOM_STEP = 0.1;
const MAX_ZOOM = 3.0;
const MIN_ZOOM = 0.25;

export const EditorToolbar = () => {
    const { state, dispatch } = useDesignEditor();
    const { canvasSize, zoomLevel } = state;

    const setCanvasSize = (size: CanvasSize) => dispatch({ type: 'SET_STATE', payload: { canvasSize: size } });
    const setZoomLevel = (zoom: number) => dispatch({ type: 'SET_STATE', payload: { zoomLevel: zoom } });

    const handleZoom = (direction: 'in' | 'out') => {
        setZoomLevel(prev => {
            const newZoom = direction === 'in' ? prev + ZOOM_STEP : prev - ZOOM_STEP;
            return Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
        });
    };

    const resetPanAndZoom = () => {
        setZoomLevel(0.5); // Reset to a default zoom
        dispatch({ type: 'SET_STATE', payload: { panOffset: { x: 0, y: 0 } } });
    };

    return (
        <div className="md:w-auto md:justify-center absolute top-0.5 md:top-1.5 left-1/2 -translate-x-1/2 z-30 bg-muted p-1 flex gap-1 md:rounded-md w-full justify-between px-4">
            <div className="bg-card/20 backdrop-blur-sm p-1 flex gap-1 flex-shrink-0 rounded-md">
                {canvasSizes.map(size => (
                    <TooltipProvider key={size.name}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={cn("h-8 w-8 text-primary", canvasSize.name === size.name && "bg-primary-foreground/20")}
                                    onClick={() => setCanvasSize(size)}
                                >
                                    {size.name === 'Post' && <Smartphone className="h-5 w-5" />}
                                    {size.name === 'Story' && <RectangleVertical className="h-5 w-5" />}
                                    {size.name === 'Square' && <Square className="h-5 w-5" />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{size.name} Format</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                ))}
            </div>
            <div className="bg-card/20 backdrop-blur-sm p-1 flex items-center gap-1 rounded-md">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary z-30" onClick={() => handleZoom('out')} disabled={zoomLevel <= MIN_ZOOM}>
                                <ZoomOut className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Zoom Out (-)</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={resetPanAndZoom}>
                                <RotateCcw className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Reset Zoom</p></TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary" onClick={() => handleZoom('in')} disabled={zoomLevel >= MAX_ZOOM}>
                                <ZoomIn className="h-5 w-5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Zoom In (+)</p></TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
        </div>
    );
};
