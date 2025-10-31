
"use client";

import React from 'react';
import { DesignProvider } from '@/contexts/design-context';
import { DesignPanel } from './components/design-panel';
import { CreativeMagicPanel } from './components/creative-magic-panel';
import { TextSettings } from './components/text-settings';
import { BackgroundSettings } from './components/background-settings';
import { TemplatesPanel } from './components/templates';
import { FavoritesPanel } from './components/favorites';
import { DownloadPanel } from './components/download-panel';


const DesignPageClient = () => {
  return (
    <DesignProvider>
      <main className="flex flex-col md:flex-row h-screen">
        <div className="w-full md:w-[400px] bg-sidebar text-sidebar-foreground flex-shrink-0">
          <CreativeMagicPanel />
          <TextSettings />
          <BackgroundSettings />
          <TemplatesPanel />
          <FavoritesPanel />
          <DownloadPanel />
        </div>
        <div className="flex-grow relative">
          <DesignPanel />
        </div>
      </main>
    </DesignProvider>
  );
};

export default DesignPageClient;
