
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
import { findImages } from '@/ai/flows/find-images-flow';
import { fontOptions } from '@/lib/font-options';
import { textEffects } from '@/lib/text-effects';
import { CarouselApi } from '../ui/carousel';
import { gradientTemplates } from '@/lib/colors';


export const EditorLayout = () => {
    const { state, dispatch } = useDesignEditor();
    const { 
        isSidebarOpen, 
        activeSettingsTab, 
        designs, 
        isGeneratingAnimation,
        title,
        text,
        isLoading,
        searchQuery,
        searchPage,
        isSearching,
        searchedImages,
    } = state;
    
    const [isClient, setIsClient] = React.useState(false);
    const designsRef = useRef<HTMLDivElement>(null);
    const mobilePanelRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const isMobile = useIsMobile();
    const [searchCarouselApi, setSearchCarouselApi] = React.useState<CarouselApi | undefined>();
    const lastSearchedQuery = React.useRef('');


    useEffect(() => {
        setIsClient(true);
    }, []);

    const setIsSidebarOpen = (isOpen: boolean) => dispatch({ type: 'SET_STATE', payload: { isSidebarOpen: isOpen } });
    const setActiveSettingsTab = (tab: string) => dispatch({ type: 'SET_STATE', payload: { activeSettingsTab: tab } });
    const handleGenerate = () => dispatch({ type: 'SET_STATE', payload: { designs: [] } });

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
            activeFont: fontOptions.find(f => f.value === template.font.value) || state.activeFont,
            isTextBoxEnabled: template.textBox.opacity > 0,
            rectBgColor: template.textBox.color,
            rectOpacity: template.textBox.opacity,
            isOverlayEnabled: template.overlay.opacity > 0,
            overlayColor: template.overlay.color,
            overlayOpacity: template.overlay.opacity,
            activeEffect: textEffects.find(e => e.id === template.effect?.id) || textEffects[0],
            textColor: template.font.color
        }});
        toast({
            title: "Template Applied",
            description: `The "${template.name}" template has been applied.`,
        });
    };
    
    const handleSearchImages = useCallback(async (query: string, page: number = 1) => {
      if (!query.trim()) return;
      dispatch({ type: 'SET_STATE', payload: { isSearching: true }});
      
      const isNewSearch = query !== lastSearchedQuery.current;
      if (isNewSearch) {
        lastSearchedQuery.current = query;
        dispatch({ type: 'SET_STATE', payload: { searchedImages: [], searchPage: 1 }});
        searchCarouselApi?.scrollTo(0);
      }

      try {
        const response = await findImages({ query, per_page: 15, page: isNewSearch ? 1 : page });
        dispatch({ type: 'SET_STATE', payload: { 
            searchedImages: isNewSearch ? response.imageUrls : [...searchedImages, ...response.imageUrls],
            searchPage: isNewSearch ? 2 : page + 1
        }});
      } catch (error) {
        console.error("Error searching images:", error);
        toast({
          title: "Image Search Failed",
          description: "Could not fetch images. Please check your API key and try again.",
          variant: "destructive"
        })
      } finally {
        dispatch({ type: 'SET_STATE', payload: { isSearching: false }});
      }
    }, [dispatch, toast, searchedImages, searchCarouselApi]);
    
    const handleFeelLucky = () => {
      const luckyTemplate = designTemplates[Math.floor(Math.random() * designTemplates.length)];
      handleApplyTemplate(luckyTemplate);
    };

    const handleKeywordSearch = (keyword: string) => {
        dispatch({ type: 'SET_STATE', payload: { searchQuery: keyword } });
        handleSearchImages(keyword, 1);
    };


    const renderActiveTabContent = () => {
        switch (activeSettingsTab) {
          case 'designs': return <DesignsPanel handleApplyTemplate={handleApplyTemplate} />;
          case 'favorites': return <MyDesignsPanel />;
          case 'background': return (
            <BackgroundSettings
              handleFeelLucky={handleFeelLucky}
              bgColor={state.bgColor}
              handleBgColorSelect={(color) => dispatch({ type: 'SET_STATE', payload: { bgColor: color, backgroundType: 'flat' } })}
              imageBgUrl={state.imageBgUrl}
              handleImageBgUrlSelect={(template) => dispatch({ type: 'SET_STATE', payload: { imageBgUrl: template.imageUrls.post, backgroundType: 'image' } })}
              searchQuery={state.searchQuery}
              setSearchQuery={(query) => dispatch({ type: 'SET_STATE', payload: { searchQuery: query } })}
              handleSearchImages={handleSearchImages}
              isSearching={state.isSearching}
              searchedImages={state.searchedImages}
              handleKeywordSearch={handleKeywordSearch}
              searchPage={state.searchPage}
              isOverlayEnabled={state.isOverlayEnabled}
              setIsOverlayEnabled={(enabled) => dispatch({ type: 'SET_STATE', payload: { isOverlayEnabled: enabled } })}
              overlayColor={state.overlayColor}
              setOverlayColor={(color) => dispatch({ type: 'SET_STATE', payload: { overlayColor: color } })}
              overlayOpacity={state.overlayOpacity}
              setOverlayOpacity={(opacity) => dispatch({ type: 'SET_STATE', payload: { overlayOpacity: opacity } })}
              gradientBg={state.gradientBg}
              handleGradientBgSelect={(css) => dispatch({ type: 'SET_STATE', payload: { gradientBg: css, backgroundType: 'gradient' } })}
              setSearchCarouselApi={setSearchCarouselApi}
            />
          );
          case 'text': return (
              <TextSettings
                text={state.text}
                setText={(text) => dispatch({ type: 'SET_STATE', payload: { text } })}
                handleGenerate={handleGenerate}
                isLoading={state.isLoading}
                textColor={state.textColor}
                setTextColor={(color) => dispatch({ type: 'SET_STATE', payload: { textColor: color } })}
                textOpacity={state.textOpacity}
                setTextOpacity={(opacity) => dispatch({ type: 'SET_STATE', payload: { textOpacity: opacity } })}
                activeFont={state.activeFont}
                setActiveFont={(font) => dispatch({ type: 'SET_STATE', payload: { activeFont: typeof font === 'function' ? font(state.activeFont) : font } })}
                fontSize={state.fontSize}
                setFontSize={(size) => dispatch({ type: 'SET_STATE', payload: { fontSize: size } })}
                fontOptions={fontOptions}
                isBold={state.isBold}
                setIsBold={(isBold) => dispatch({ type: 'SET_STATE', payload: { isBold } })}
                isUppercase={state.isUppercase}
                setIsUppercase={(isUppercase) => dispatch({ type: 'SET_STATE', payload: { isUppercase } })}
                textAlign={state.textAlign}
                setTextAlign={(align) => dispatch({ type: 'SET_STATE', payload: { textAlign: align } })}
                textShadowEnabled={state.textShadowEnabled}
                setTextShadowEnabled={(enabled) => dispatch({ type: 'SET_STATE', payload: { textShadowEnabled: enabled } })}
                shadows={state.shadows}
                setShadows={(shadows) => dispatch({ type: 'SET_SHADOWS', payload: shadows })}
                textStroke={state.textStroke}
                setTextStroke={(value) => dispatch({ type: 'SET_STATE', payload: { textStroke: value } })}
                strokeColor={state.strokeColor}
                setStrokeColor={(color) => dispatch({ type: 'SET_STATE', payload: { strokeColor: color } })}
                strokeWidth={state.strokeWidth}
                setStrokeWidth={(width) => dispatch({ type: 'SET_STATE', payload: { strokeWidth: width } })}
                rectBgColor={state.rectBgColor}
                setRectBgColor={(color) => dispatch({ type: 'SET_STATE', payload: { rectBgColor: color } })}
                _rectOpacity={state.rectOpacity}
                setRectOpacity={(opacity) => dispatch({ type: 'SET_STATE', payload: { rectOpacity: opacity } })}
                isTextBoxEnabled={state.isTextBoxEnabled}
                setIsTextBoxEnabled={(enabled) => dispatch({ type: 'SET_STATE', payload: { isTextBoxEnabled: enabled } })}
                activeEffect={state.activeEffect}
                setActiveEffect={(effect) => dispatch({ type: 'SET_STATE', payload: { activeEffect: effect } })}
                textBoxPadding={state.textBoxPadding}
                setTextBoxPadding={(padding) => dispatch({ type: 'SET_STATE', payload: { textBoxPadding: padding } })}
                textBoxBorderRadius={state.textBoxBorderRadius}
                setTextBoxBorderRadius={(radius) => dispatch({ type: 'SET_STATE', payload: { textBoxBorderRadius: radius } })}
                isTextBoxBorderEnabled={state.isTextBoxBorderEnabled}
                setIsTextBoxBorderEnabled={(enabled) => dispatch({ type: 'SET_STATE', payload: { isTextBoxBorderEnabled: enabled } })}
                textBoxBorderColor={state.textBoxBorderColor}
                setTextBoxBorderColor={(color) => dispatch({ type: 'SET_STATE', payload: { textBoxBorderColor: color } })}
                textBoxBorderWidth={state.textBoxBorderWidth}
                setTextBoxBorderWidth={(width) => dispatch({ type: 'SET_STATE', payload: { textBoxBorderWidth: width } })}
              />
          );
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
