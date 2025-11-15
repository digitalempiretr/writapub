"use client";

import React, { useRef, useEffect, useCallback } from 'react';
import { useDesignEditor } from '@/context/DesignEditorContext';
import { useIsMobile } from '@/hooks/use-mobile';
import Lottie from 'lottie-react';
import webflowAnimation from '@/lib/Lottiefiles + Webflow.json';
import { cn } from '@/lib/utils';
import { EditorHeader } from './EditorHeader';
import { MakeCarouselSidebar } from '@/components/makeCarousel-sidebar';
import { CreativeMagicPanel } from '@/components/0_creative-magic-panel';
import { EditorToolbar } from './EditorToolbar';
import { CanvasContainer } from './CanvasContainer';
import { MobileSheet } from './MobileSheet';
import { DesignsPanel } from '../1_templates';
import { BackgroundSettings } from '../2_background-settings';
import { TextSettings } from '../3_text-settings';
import { ElementsPanel } from '../5_elements-panel';
import { MyDesignsPanel } from '../4_favorites';
import { DownloadPanel } from '../5_download-panel';
import { imageTemplates } from '@/lib/image-templates';
import { useToast } from '@/hooks/use-toast';
import { designTemplates } from '@/lib/design-templates';


export const EditorLayout = () => {
    const { state, dispatch } = useDesignEditor();
    const { 
        isSidebarOpen, 
        activeSettingsTab, 
        designs, 
        isGeneratingAnimation, 
        isMobilePanelOpen,
        title,
        text,
        isLoading
    } = state;
    
    const [isClient, setIsClient] = React.useState(false);
    const designsRef = useRef<HTMLDivElement>(null);
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const isMobile = useIsMobile();


    useEffect(() => {
        setIsClient(true);
    }, []);

    const setIsSidebarOpen = (isOpen: boolean) => dispatch({ type: 'SET_STATE', payload: { isSidebarOpen: isOpen } });
    const setActiveSettingsTab = (tab: string) => dispatch({ type: 'SET_STATE', payload: { activeSettingsTab: tab } });

    const handleDesktopTabClick = (tab: string) => {
        setActiveSettingsTab(tab);
        if (!isSidebarOpen) {
            setIsSidebarOpen(true);
        }
    };
    
    const settingsTabs = [
        { value: "designs", icon: <svg />, label: "Templates" }, // Placeholder icons
        { value: "background", icon: <svg />, label: "Background" },
        { value: "text", icon: <svg />, label: "Text" },
        { value: "elements", icon: <svg />, label: "Elements" },
        { value: "favorites", icon: <svg />, label: "Favorites" },
        { value: "download", icon: <svg />, label: "Download" },
    ];
    
    const activeTabLabel = settingsTabs.find(tab => tab.value === activeSettingsTab)?.label;
    
    const handleApplyTemplate = (template: any) => {
        // This logic was in page.tsx, now it dispatches state updates
        dispatch({type: 'SET_STATE', payload: {
            backgroundType: template.background.type,
            bgColor: template.background.type === 'flat' ? template.background.value : state.bgColor,
            gradientBg: template.background.type === 'gradient' ? template.background.value : state.gradientBg,
            imageBgUrl: template.background.type === 'image' ? template.background.value : state.imageBgUrl,
            activeFont: template.font.value,
            isTextBoxEnabled: template.textBox.opacity > 0,
            rectBgColor: template.textBox.color,
            rectOpacity: template.textBox.opacity,
            isOverlayEnabled: template.overlay.opacity > 0,
            overlayColor: template.overlay.color,
            overlayOpacity: template.overlay.opacity,
            activeEffect: template.effect ? template.effect.id : 'none',
            textColor: template.font.color
        }});
        toast({
            title: "Template Applied",
            description: `The "${template.name}" template has been applied.`,
        });
    };
    
    const renderActiveTabContent = () => {
        switch (activeSettingsTab) {
          case 'designs': return <DesignsPanel handleApplyTemplate={handleApplyTemplate} />;
          case 'favorites': return <MyDesignsPanel />;
          case 'background': return <BackgroundSettings />;
          case 'text': return <TextSettings />;
          case 'elements': return <ElementsPanel />;
          case 'download': return <DownloadPanel />;
          default: return null;
        }
    };

    if (!isClient) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
                background: 'linear-gradient(to top right, var(--primary), var(--secondary), var(--accent)'
            }}>
                <div className="w-64 h-64">
                    <Lottie animationData={webflowAnimation} loop={true} />
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex h-screen flex-col overflow-hidden">
            <EditorHeader />
            <div className="flex-1 flex overflow-hidden" style={{ height: isMobile ? 'calc(100vh - 10vh - 56px)' : 'auto' }}>
                {designs.length > 0 && (
                    <MakeCarouselSidebar
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                        activeSettingsTab={activeSettingsTab}
                        handleDesktopTabClick={handleDesktopTabClick}
                        settingsTabs={settingsTabs}
                        activeTabLabel={activeTabLabel}
                        renderActiveTabContent={renderActiveTabContent}
                    />
                )}
                <main 
                    ref={designsRef}
                    className={cn("flex-1 flex items-center justify-center overflow-hidden h-full p-4 relative cursor-default bg-[url(https://www.transparenttextures.com/patterns/project-paper.png)]")}
                    // Pan/Zoom handlers would go here, managed by context
                >
                    {designs.length === 0 ? (
                        <div className="w-full max-w-2xl">
                           <CreativeMagicPanel 
                                title={title}
                                setTitle={(t) => dispatch({type: 'SET_STATE', payload: {title: t}})}
                                text={text}
                                setText={(t) => dispatch({type: 'SET_STATE', payload: {text: t}})}
                                handleGenerate={() => { /* This will now be handled inside the context */ }}
                                isLoading={isLoading}
                           />
                        </div>
                    ) : (
                       <>
                        <EditorToolbar />
                        <CanvasContainer />
                       </>
                    )}
                </main>
            </div>
            {isGeneratingAnimation && (
                <div className="fixed inset-0 flex items-center justify-center z-50 h-screen w-screen" style={{
                    background: 'linear-gradient(to top right,  var(--primary),  var(--secondary)'
                }}>
                    <div className="w-64 h-64">
                        <Lottie animationData={webflowAnimation} loop={true} />
                    </div>
                </div>
            )}
            {isClient && designs.length > 0 && (
                <MobileSheet 
                    mobilePanelRef={mobilePanelRef} 
                    renderActiveTabContent={renderActiveTabContent} 
                />
            )}
        </div>
    );
}
