"use client";

import React from 'react';
import { useDesignEditor } from '@/context/DesignEditorContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';
import { NavBullets } from '../ui/nav-bullets';
import { type CarouselApi } from '../ui/carousel';

interface MobileSheetProps {
    mobilePanelRef: React.RefObject<HTMLDivElement>;
    renderActiveTabContent: () => JSX.Element | null;
}

export const MobileSheet = ({ mobilePanelRef, renderActiveTabContent }: MobileSheetProps) => {
    const { state, dispatch } = useDesignEditor();
    const { isMobilePanelOpen, activeSettingsTab, designs, currentSlide } = state;
    const [carouselApi, setCarouselApi] = React.useState<CarouselApi | undefined>(undefined);

    const setIsMobilePanelOpen = (isOpen: boolean) => dispatch({ type: 'SET_STATE', payload: { isMobilePanelOpen: isOpen } });
    const setActiveSettingsTab = (tab: string) => dispatch({ type: 'SET_STATE', payload: { activeSettingsTab: tab } });

    const settingsTabs = [
        { value: "designs", icon: <svg />, label: "Templates" },
        { value: "background", icon: <svg />, label: "Background" },
        { value: "text", icon: <svg />, label: "Text" },
        { value: "elements", icon: <svg />, label: "Elements" },
        { value: "favorites", icon: <svg />, label: "Favorites" },
        { value: "download", icon: <svg />, label: "Download" },
    ];
    const activeTabLabel = settingsTabs.find(tab => tab.value === activeSettingsTab)?.label;
    
    const handleMobileTabClick = (tab: string) => {
        if (activeSettingsTab === tab && isMobilePanelOpen) {
            // No change
        } else {
            setActiveSettingsTab(tab);
            setIsMobilePanelOpen(true);
        }
    };

    return (
        <div ref={mobilePanelRef} className="md:hidden">
             {designs.length > 0 && (
                <div className="md:hidden fixed bottom-16 left-0 right-0 z-20">
                    <NavBullets api={carouselApi} current={currentSlide} total={designs.length} />
                </div>
            )}
            <Sheet open={isMobilePanelOpen} onOpenChange={(isOpen) => {
                if (!isOpen) setActiveSettingsTab('');
                setIsMobilePanelOpen(isOpen);
            }}>
                <SheetContent side="bottom" className="h-auto max-h-[55vh] p-0 flex flex-col bg-sidebar" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <SheetHeader className="p-2 px-4 border-b flex-row justify-between items-center bg-background">
                        <SheetTitle className="capitalize">{activeTabLabel}</SheetTitle>
                    </SheetHeader>
                    <div className="flex-grow overflow-y-auto">
                        {renderActiveTabContent()}
                    </div>
                </SheetContent>
            </Sheet>
            <div className={cn("fixed bottom-0 left-0 right-0 z-30 bg-sidebar border-t", isMobilePanelOpen ? "hidden" : "block")}>
                <Tabs value={activeSettingsTab ?? ''} className="w-full">
                    <TabsList className="grid w-full grid-cols-6 h-14 rounded-none bg-sidebar">
                        {settingsTabs.map(tab => (
                            <TabsTrigger key={tab.value} value={tab.value} onClick={() => handleMobileTabClick(tab.value)}>
                                {tab.icon}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
            </div>
        </div>
    );
};
