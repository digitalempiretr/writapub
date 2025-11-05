
"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type SidebarProps = {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  activeSettingsTab: string;
  handleDesktopTabClick: (tab: string) => void;
  settingsTabs: { value: string; icon: JSX.Element; label: string }[];
  activeTabLabel: string | undefined;
  renderActiveTabContent: () => JSX.Element | null;
};

export function MakeCarouselSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  activeSettingsTab,
  handleDesktopTabClick,
  settingsTabs,
  activeTabLabel,
  renderActiveTabContent,
}: SidebarProps) {
  return (
    <div className={cn("hidden md:flex flex-shrink-0 bg-sidebar transition-all duration-300 ease-in-out z-50", isSidebarOpen ? "w-[40vw]" : "w-[2vw]")}>
      <Tabs
        orientation="vertical"
        value={activeSettingsTab}
        onValueChange={handleDesktopTabClick}
        className="flex w-full"
      >
        <div className="flex flex-col items-center p-0 space-y-2 bg-sidebar rounded-tr-lg">
          <TabsList className="flex flex-col h-full justify-start items-center p-0 bg-sidebar space-y-1 rounded-tr-lg">
            {settingsTabs.map(tab => (
              <TooltipProvider key={tab.value}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger
                      value={tab.value}
                      className="w-12 h-12 data-[state=active]:bg-primary/20"
                      onClick={() => handleDesktopTabClick(tab.value)}
                    >
                      {tab.icon}
                    </TabsTrigger>
                  </TooltipTrigger>
                  {!isSidebarOpen && <TooltipContent side="right"><p>{tab.label}</p></TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            ))}
          </TabsList>
        </div>

        {isSidebarOpen && (
          <div className="flex-grow flex flex-col w-full bg-sidebar rounded-tr-lg">
            <div className="p-4 flex-shrink-0 flex justify-between items-center bg-sidebar">
              <h3 className="text-lg font-semibold capitalize text-sidebar-foreground">{activeTabLabel}</h3>
              <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)} className="h-8 w-8 rounded-full">
                <X className="h-5 w-5" />
                <span className="sr-only">Close Panel</span>
              </Button>
            </div>
            <TabsContent value={activeSettingsTab} className="mt-0 flex-grow overflow-y-auto">
              {renderActiveTabContent()}
            </TabsContent>
          </div>
        )}
      </Tabs>
    </div>
  );
}
