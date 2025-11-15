'use client';

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';
import { CanvasSize, canvasSizes } from '@/lib/canvas-sizes';
import { FontOption, fontOptions } from '@/lib/font-options';
import { DesignTemplate } from '@/lib/design-templates';
import { pageInitialColors, gradientTemplates } from '@/lib/colors';
import { TextEffect, textEffects } from '@/lib/text-effects';
import { Shadow } from '@/components/3_text-settings';
import { CanvasElement } from '@/components/5_elements-panel';
import { defaultText } from '@/lib/default-text';

type BackgroundType = 'flat' | 'gradient' | 'image';
type TextAlign = 'left' | 'center' | 'right';

// 1. State Shape
interface State {
  title: string;
  text: string;
  designs: { text: string; isTitle: boolean }[];
  isLoading: boolean;
  isGeneratingAnimation: boolean;
  currentSlide: number;
  myDesigns: DesignTemplate[];
  editingDesignId: string | null;
  editingName: string;
  designToDelete: string | null;
  backgroundType: BackgroundType;
  bgColor: string;
  gradientBg: string;
  imageBgUrl: string;
  searchQuery: string;
  searchedImages: string[];
  isSearching: boolean;
  searchPage: number;
  activeFont: FontOption;
  fontSize: number;
  textAlign: TextAlign;
  isBold: boolean;
  isUppercase: boolean;
  textColor: string;
  textOpacity: number;
  isTextBoxEnabled: boolean;
  rectBgColor: string;
  rectOpacity: number;
  textBoxBorderRadius: number;
  isTextBoxBorderEnabled: boolean;
  textBoxBorderColor: string;
  textBoxBorderWidth: number;
  isOverlayEnabled: boolean;
  overlayColor: string;
  overlayOpacity: number;
  textShadowEnabled: boolean;
  shadows: Shadow[];
  activeEffect: TextEffect;
  textStroke: boolean;
  strokeColor: string;
  strokeWidth: number;
  activeSettingsTab: string;
  isMobilePanelOpen: boolean;
  isSidebarOpen: boolean;
  fileName: string;
  zoomLevel: number;
  panOffset: { x: number; y: number };
  canvasSize: CanvasSize;
  elements: CanvasElement[];
  selectedElement: string | null;
  areElementsEnabled: boolean;
}

// 2. Initial State
const initialState: State = {
  title: '',
  text: defaultText,
  designs: [],
  isLoading: false,
  isGeneratingAnimation: false,
  currentSlide: 0,
  myDesigns: [],
  editingDesignId: null,
  editingName: '',
  designToDelete: null,
  backgroundType: 'image',
  bgColor: pageInitialColors.bgColor,
  gradientBg: gradientTemplates[0].css,
  imageBgUrl: 'https://i.ibb.co/gFTNhzNw/bg-pink-Dock.jpg',
  searchQuery: '',
  searchedImages: [],
  isSearching: false,
  searchPage: 1,
  activeFont: fontOptions.find(f => f.value === 'duru-sans') || fontOptions[0],
  fontSize: 48,
  textAlign: 'left',
  isBold: false,
  isUppercase: false,
  textColor: pageInitialColors.textColor,
  textOpacity: 1,
  isTextBoxEnabled: false,
  rectBgColor: pageInitialColors.rectBgColor,
  rectOpacity: 0,
  textBoxBorderRadius: 0,
  isTextBoxBorderEnabled: false,
  textBoxBorderColor: '#000000',
  textBoxBorderWidth: 2,
  isOverlayEnabled: false,
  overlayColor: pageInitialColors.overlayColor,
  overlayOpacity: 0.25,
  textShadowEnabled: false,
  shadows: [{ id: Date.now(), color: '#000000', offsetX: 5, offsetY: 5, blur: 5, offsetXUnit: 'px', offsetYUnit: 'px', blurUnit: 'px' }],
  activeEffect: textEffects[0],
  textStroke: false,
  strokeColor: '#000000',
  strokeWidth: 2,
  activeSettingsTab: 'designs',
  isMobilePanelOpen: false,
  isSidebarOpen: true,
  fileName: 'Untitled design',
  zoomLevel: 0.5,
  panOffset: { x: 0, y: 0 },
  canvasSize: canvasSizes[0],
  elements: [],
  selectedElement: null,
  areElementsEnabled: true,
};

// 3. Actions
type Action =
  | { type: 'SET_STATE'; payload: Partial<State> }
  | { type: 'SET_DESIGNS'; payload: { text: string; isTitle: boolean }[] }
  | { type: 'SET_MY_DESIGNS'; payload: DesignTemplate[] }
  | { type: 'SET_SHADOWS'; payload: Shadow[] }
  | { type: 'SET_ELEMENTS'; payload: CanvasElement[] }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; newProps: Partial<CanvasElement> } };


// 4. Reducer
const editorReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_STATE':
      return { ...state, ...action.payload };
    case 'SET_DESIGNS':
      return { ...state, designs: action.payload };
    case 'SET_MY_DESIGNS':
        return { ...state, myDesigns: action.payload };
    case 'SET_SHADOWS':
        return { ...state, shadows: action.payload };
    case 'SET_ELEMENTS':
        return { ...state, elements: action.payload };
    case 'UPDATE_ELEMENT':
        return {
            ...state,
            elements: state.elements.map(el =>
                el.id === action.payload.id ? { ...el, ...action.payload.newProps } : el
            ),
        };
    default:
      return state;
  }
};

// 5. Context
const DesignEditorContext = createContext<{
  state: State;
  dispatch: Dispatch<Action>;
} | null>(null);


// 6. Provider
export const DesignEditorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  return (
    <DesignEditorContext.Provider value={{ state, dispatch }}>
      {children}
    </DesignEditorContext.Provider>
  );
};

// 7. Custom Hook
export const useDesignEditor = () => {
  const context = useContext(DesignEditorContext);
  if (!context) {
    throw new Error('useDesignEditor must be used within a DesignEditorProvider');
  }
  return context;
};
