
'use client';

import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useCallback } from 'react';
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
  textBoxPadding: number;
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
  textBoxPadding: 100,
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

type DesignEditorContextType = {
  state: State;
  dispatch: Dispatch<Action>;
  handleGenerate: () => void;
};

// 5. Context
const DesignEditorContext = createContext<DesignEditorContextType | null>(null);


// 6. Provider
export const DesignEditorProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(editorReducer, initialState);

  const measureAndSplitText = useCallback((text: string, maxLines: number, extendedMaxLines: number, ctx: CanvasRenderingContext2D, textAvailableWidth: number) => {
      const paragraphs = text.split('\n').filter(p => p.trim() !== '');
      const slides: string[] = [];
      let currentSlideText = '';
      let currentLineCount = 0;

      for (const paragraph of paragraphs) {
          const words = paragraph.split(' ');
          let currentLine = '';
          let lineCountForPara = 0;

          words.forEach((word, index) => {
              const testLine = currentLine ? `${currentLine} ${word}` : word;
              const testWidth = ctx.measureText(testLine).width;

              if (testWidth > textAvailableWidth) {
                  if (currentLine) {
                      if (currentLineCount + 1 > maxLines) {
                          slides.push(currentSlideText.trim());
                          currentSlideText = currentLine + '\n';
                          currentLineCount = 1;
                      } else {
                          currentSlideText += currentLine + '\n';
                          currentLineCount++;
                      }
                  }
                  currentLine = word;
              } else {
                  currentLine = testLine;
              }
          });

          if (currentLine) {
              const remainingWords = paragraph.substring(paragraph.indexOf(currentLine)).split(' ');
              const isLastSentenceShort = remainingWords.length <= 2;
              const currentMax = isLastSentenceShort ? extendedMaxLines : maxLines;

              if (currentLineCount + 1 > currentMax) {
                  slides.push(currentSlideText.trim());
                  currentSlideText = currentLine + '\n';
                  currentLineCount = 1;
              } else {
                  currentSlideText += currentLine + '\n';
                  currentLineCount++;
              }
          }

          if (currentSlideText.trim() !== '') {
            lineCountForPara = currentSlideText.split('\n').length -1;
            if(lineCountForPara >= maxLines) {
                slides.push(currentSlideText.trim());
                currentSlideText = '';
                currentLineCount = 0;
            }
          }
      }

      if (currentSlideText.trim()) {
          slides.push(currentSlideText.trim());
      }
      return slides;
  }, []);

  const handleGenerate = useCallback(() => {
    dispatch({ type: 'SET_STATE', payload: { isLoading: true, designs: [] } });

    setTimeout(() => {
        let currentTitle = state.title;
        let bodyText = state.text;

        if (!currentTitle) {
            const firstSentenceEnd = bodyText.search(/[.!?]/) + 1;
            if (firstSentenceEnd > 0) {
                currentTitle = bodyText.substring(0, firstSentenceEnd).trim();
                bodyText = bodyText.substring(firstSentenceEnd).trim();
            } else {
                currentTitle = bodyText.substring(0, 50); // Fallback
                bodyText = bodyText.substring(50).trim();
            }
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            dispatch({ type: 'SET_STATE', payload: { isLoading: false } });
            return;
        }

        const { canvasSize, fontSize, activeFont } = state;
        const finalFontWeight = state.isBold ? Math.min(Number(activeFont.weight) + 300, 900) : activeFont.weight;

        const scalingFactor = canvasSize.width / 1080;
        const finalFontSize = fontSize * scalingFactor;
        ctx.font = `${finalFontWeight} ${finalFontSize}px "${activeFont.fontFamily}"`;
        
        let textAvailableWidth: number, textAvailableHeight: number;

        if (canvasSize.name === 'Story') {
            textAvailableWidth = 630 * scalingFactor;
            textAvailableHeight = 1220 * scalingFactor;
        } else if (canvasSize.name === 'Square') {
            textAvailableWidth = 630 * scalingFactor;
            textAvailableHeight = 630 * scalingFactor;
        } else { // Post
            textAvailableWidth = 630 * scalingFactor;
            textAvailableHeight = 900 * scalingFactor;
        }
        
        const lineHeight = finalFontSize * (typeof activeFont.lineHeight === 'number' ? activeFont.lineHeight : 1.4);
        const dynamicMaxLines = Math.floor(textAvailableHeight / lineHeight);
        const extendedMaxLines = dynamicMaxLines + 2;
        
        const slides = measureAndSplitText(bodyText, dynamicMaxLines, extendedMaxLines, ctx, textAvailableWidth);

        const newDesigns = [
            { text: currentTitle, isTitle: true },
            ...slides.map(slideText => ({ text: slideText, isTitle: false }))
        ];

        dispatch({
            type: 'SET_STATE',
            payload: {
                designs: newDesigns,
                isLoading: false,
                isGeneratingAnimation: true
            }
        });
        setTimeout(() => dispatch({ type: 'SET_STATE', payload: { isGeneratingAnimation: false } }), 1000);
    }, 100);
  }, [state.title, state.text, state.canvasSize, state.fontSize, state.activeFont, state.isBold, measureAndSplitText]);

  return (
    <DesignEditorContext.Provider value={{ state, dispatch, handleGenerate }}>
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

