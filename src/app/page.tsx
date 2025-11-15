"use client";

import React from 'react';
import { DesignEditorProvider } from '@/context/DesignEditorContext';
import { EditorLayout } from '@/components/editor/EditorLayout';

export default function Home() {
  return (
    <DesignEditorProvider>
      <EditorLayout />
    </DesignEditorProvider>
  );
}
