
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { DesignProvider, useDesign } from '../../contexts/design-context';
import { DesignPanel } from './components/design-panel';
import { CreativeMagicPanel } from './components/creative-magic-panel';
import { TextSettings } from './components/text-settings';
import { BackgroundSettings } from './components/background-settings';
import { TemplatesPanel } from './components/templates';
import { FavoritesPanel } from './components/favorites';
import { DownloadPanel } from './components/download-panel';
import { ImageTemplate } from '@/lib/image-templates';
import { Design } from '@/lib/types';
import { defaultText } from '@/lib/default-text';
import { fabric } from 'fabric';
import { useUser } from '@/firebase/auth/use-user';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { DesignTemplate } from '@/lib/design-templates';
import { useMemoFirebase } from '@/firebase/firestore/use-memo-firebase';

const DesignPage = () => {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const designProps = useDesign();
  const {
    text,
    setText,
    textColor,
    setTextColor,
    textOpacity,
    setTextOpacity,
    activeFont,
    setActiveFont,
    fontOptions,
    isBold,
    setIsBold,
    isUppercase,
    setIsUppercase,
    textAlign,
    setTextAlign,
    textShadowEnabled,
    setTextShadowEnabled,
    shadows,
    setShadows,
    textStroke,
    setTextStroke,
    strokeColor,
    setStrokeColor,
    strokeWidth,
    setStrokeWidth,
    rectBgColor,
    setRectBgColor,
    rectOpacity,
    setRectOpacity,
    isTextBoxEnabled,
    setIsTextBoxEnabled,
    activeEffect,
    setActiveEffect,
    backgroundTab,
    setBackgroundTab,
    bgColor,
    setBgColor,
    imageBgUrl,
    setImageBgUrl,
    gradientBg,
    setGradientBg,
    isOverlayEnabled,
    setIsOverlayEnabled,
    overlayColor,
    setOverlayColor,
    overlayOpacity,
    setOverlayOpacity,
    canvasSize,
    currentSlide,
    setCurrentSlide,
    designs,
    setDesigns,
    canvasRef,
  } = designProps;


  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const designsRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    // Allow panning only with middle mouse button or by holding Alt
    if (e.button !== 1 && !e.altKey) return;
    // Prevent panning when interacting with inputs/textareas inside the canvas area
    const target = e.target as HTMLElement;
    if (target.closest('input, textarea, button, a')) return;

    e.preventDefault();
    setIsPanning(true);
    setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    if(designsRef.current) {
        designsRef.current.style.cursor = 'grabbing';
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    e.preventDefault();
    const newX = e.clientX - panStart.x;
    const newY = e.clientY - panStart.y;
    setPanOffset({ x: newX, y: newY });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    e.preventDefault();
    setIsPanning(false);
    if(designsRef.current) {
        designsRef.current.style.cursor = 'grab';
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    const zoomFactor = 0.1;
    setZoomLevel(prev => {
      const newZoom = direction === 'in' ? prev + zoomFactor : prev - zoomFactor;
      return Math.max(0.1, newZoom); // Prevent zoom from being too small
    });
  };

  const renderCanvas = (design: Design, index: number) => {
    const canvasId = `canvas-${index}`;
    return (
      <div id={canvasId} style={{ width: canvasSize.width, height: canvasSize.height }}>
        {/* Fabric.js will attach canvas here */}
      </div>
    );
  };
  const renderBulletNavigation = () => {
    // ... (implementation)
    return null;
  };
  const handleSaveDesign = () => {};
  

  const [isLoading, setIsLoading] = useState(false);
  const myDesignsQuery = useMemoFirebase(() => user ? query(collection(firestore, 'user_designs'), where('userId', '==', user.uid)) : null, [firestore, user]);
  const { data: myDesigns, isLoading: myDesignsLoading } = useCollection(myDesignsQuery);

  const designTemplatesQuery = useMemoFirebase(() => query(collection(firestore, 'design_templates')), [firestore]);
  const { data: designTemplates, isLoading: templatesLoading } = useCollection(designTemplatesQuery);

  return (
    <main className="flex flex-col md:flex-row h-screen">
      <div className="w-full md:w-[400px] bg-sidebar text-sidebar-foreground flex-shrink-0">
        {/* Panels will go here */}
      </div>
      <div className="flex-grow relative">
        <DesignPanel
          designs={designs}
          setCarouselApi={() => {}}
          canvasSize={canvasSize}
          renderCanvas={renderCanvas}
          handleSaveDesign={handleSaveDesign}
          renderBulletNavigation={renderBulletNavigation}
          designsRef={designsRef}
          handleMouseDown={handleMouseDown}
          handleMouseMove={handleMouseMove}
          handleMouseUp={handleMouseUp}
          handleZoom={handleZoom}
          panOffset={panOffset}
          zoomLevel={zoomLevel}
        />
      </div>
    </main>
  );
};

const DesignPageWithProvider = () => (
  <DesignProvider>
    <DesignPage />
  </DesignProvider>
);

export default DesignPageWithProvider;
