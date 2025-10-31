
"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Shadow, TextAlign } from '../lib/types';
import { FontOption, fontOptions } from '../lib/font-options';
import { textEffects, TextEffect } from '../lib/text-effects';
import { ImageTemplate } from '../lib/image-templates';
import { CarouselApi } from '../components/ui/carousel';
import { DesignTemplate, designTemplates } from '../lib/design-templates';

// Find the 'None' effect or use the first effect as a default
const defaultEffect = textEffects.find(e => e.id === 'none') || textEffects[0];

interface DesignContextType {
  // Text settings
  text: string;
  setText: (text: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  textOpacity: number;
  setTextOpacity: (value: number) => void;
  activeFont: FontOption;
  setActiveFont: (font: FontOption) => void;
  fontOptions: FontOption[];
  isBold: boolean;
  setIsBold: (value: boolean) => void;
  isUppercase: boolean;
  setIsUppercase: (value: boolean) => void;
  textAlign: TextAlign;
  setTextAlign: (align: TextAlign) => void;
  textShadowEnabled: boolean;
  setTextShadowEnabled: (value: boolean) => void;
  shadows: Shadow[];
  setShadows: (shadows: Shadow[]) => void;
  textStroke: boolean;
  setTextStroke: (value: boolean) => void;
  strokeColor: string;
  setStrokeColor: (value: string) => void;
  strokeWidth: number;
  setStrokeWidth: (value: number) => void;
  rectBgColor: string;
  setRectBgColor: (color: string) => void;
  rectOpacity: number;
  setRectOpacity: (value: number) => void;
  isTextBoxEnabled: boolean;
  setIsTextBoxEnabled: (value: boolean) => void;
  activeEffect: TextEffect;
  setActiveEffect: (effect: TextEffect) => void;

  // Background settings
  backgroundTab: string;
  setBackgroundTab: (value: string) => void;
  handleFeelLucky: () => void;
  bgColor: string;
  setBgColor: (color: string) => void; // Allow direct setting
  imageBgUrl: string;
  setImageBgUrl: (url: string) => void; // Allow direct setting
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearchImages: (page?: number) => void;
  isSearching: boolean;
  searchedImages: string[];
  handleKeywordSearch: (keyword: string) => void;
  searchPage: number;
  isOverlayEnabled: boolean;
  setIsOverlayEnabled: (enabled: boolean) => void;
  overlayColor: string;
  setOverlayColor: (color: string) => void;
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  gradientBg: string;
  setGradientBg: (css: string) => void; // Allow direct setting
  setSearchCarouselApi: (api: CarouselApi | undefined) => void;

  // Template settings
  handleApplyTemplate: (template: DesignTemplate) => void;

  // Favorites (My Designs) settings
  myDesigns: DesignTemplate[];
  handleSaveDesign: () => void;
  handleDeleteDesign: (id: string) => void;
  handleUpdateDesign: (id: string) => void;
  editingDesignId: string | null;
  handleEditClick: (id: string, name: string) => void;
  handleCancelEdit: () => void;
  editingName: string;
  setEditingName: (name: string) => void;
  designToDelete: string | null;
  setDesignToDelete: (id: string | null) => void;
  handleLogDesign: () => void;

  // Download settings
  fileName: string;
  setFileName: (name: string) => void;
  handleDownloadAll: () => void;
  handleDownload: (index: number) => void;
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
}

const DesignContext = createContext<DesignContextType | undefined>(undefined);

export const DesignProvider = ({ children }: { children: ReactNode }) => {
  // Text state
  const [text, setText] = useState('Your awesome text');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textOpacity, setTextOpacity] = useState(1);
  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions[0]);
  const [isBold, setIsBold] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [textAlign, setTextAlign] = useState<TextAlign>('center');
  const [textShadowEnabled, setTextShadowEnabled] = useState(true);
  const [shadows, setShadows] = useState<Shadow[]>([
    { id: 1, color: '#000000', offsetX: 2, offsetY: 2, blur: 4, offsetXUnit: 'px', offsetYUnit: 'px', blurUnit: 'px' }
  ]);
  const [textStroke, setTextStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [rectBgColor, setRectBgColor] = useState('#000000');
  const [rectOpacity, setRectOpacity] = useState(0.5);
  const [isTextBoxEnabled, setIsTextBoxEnabled] = useState(false);
  const [activeEffect, setActiveEffect] = useState<TextEffect>(defaultEffect);

  // Background state
  const [backgroundTab, setBackgroundTab] = useState('flat');
  const [bgColor, setBgColor] = useState('#000000');
  const [imageBgUrl, setImageBgUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [isOverlayEnabled, setIsOverlayEnabled] = useState(false);
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [gradientBg, setGradientBg] = useState('linear-gradient(to right, #ff7e5f, #feb47b)');
  const [searchCarouselApi, setSearchCarouselApi] = useState<CarouselApi | undefined>();

  // Favorites state
  const [myDesigns, setMyDesigns] = useState<DesignTemplate[]>([]);
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);

  // Download state
  const [fileName, setFileName] = useState('my-design');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Dummy handlers (to be implemented)
  const handleFeelLucky = () => console.log("Feeling lucky!");
  const handleSearchImages = (page?: number) => console.log("Searching images...");
  const handleKeywordSearch = (keyword: string) => {
    setSearchQuery(keyword);
    console.log(`Searching for keyword: ${keyword}`);
  };
  const handleApplyTemplate = (template: DesignTemplate) => {
    console.log("Applying template:", template.name);

    const fontToApply = fontOptions.find(f => f.value === template.font.value);

    setText(template.name);
    if(fontToApply) setActiveFont(fontToApply);
    setTextColor(template.font.color);

    if (template.background.type === 'color') {
      setBgColor(template.background.value);
      setBackgroundTab('flat');
    } else if (template.background.type === 'gradient') {
      setGradientBg(template.background.value);
      setBackgroundTab('gradient');
    } else if (template.background.type === 'image') {
      setImageBgUrl(template.background.value)
      setBackgroundTab('image');
    }

    if (template.effect) {
      const effectToApply = textEffects.find(e => e.id === template.effect!.id);
      if (effectToApply) {
        setActiveEffect(effectToApply);
      }
    } else {
        setActiveEffect(defaultEffect)
    }
    
    if(template.textBox) {
        setIsTextBoxEnabled(true);
        setRectBgColor(template.textBox.color);
        setRectOpacity(template.textBox.opacity);
    } else {
        setIsTextBoxEnabled(false);
    }

    if (template.overlay) {
        setIsOverlayEnabled(true);
        setOverlayColor(template.overlay.color);
        setOverlayOpacity(template.overlay.opacity);
    } else {
        setIsOverlayEnabled(false);
    }
  };
  const handleSaveDesign = () => console.log("Saving design");
  const handleDeleteDesign = (id: string) => console.log("Deleting design:", id);
  const handleUpdateDesign = (id: string) => console.log("Updating design:", id);
  const handleEditClick = (id: string, name: string) => {
    setEditingDesignId(id);
    setEditingName(name);
  };
  const handleCancelEdit = () => setEditingDesignId(null);
  const handleLogDesign = () => console.log("Logging current design");
  const handleDownloadAll = () => console.log("Downloading all designs");
  const handleDownload = (index: number) => console.log("Downloading design at index:", index);

  const value = {
    text, setText,
    textColor, setTextColor,
    textOpacity, setTextOpacity,
    activeFont, setActiveFont,
    fontOptions,
    isBold, setIsBold,
    isUppercase, setIsUppercase,
    textAlign, setTextAlign,
    textShadowEnabled, setTextShadowEnabled,
    shadows, setShadows,
    textStroke, setTextStroke,
    strokeColor, setStrokeColor,
    strokeWidth, setStrokeWidth,
    rectBgColor, setRectBgColor,
    rectOpacity, setRectOpacity,
    isTextBoxEnabled, setIsTextBoxEnabled,
    activeEffect, setActiveEffect,
    backgroundTab, setBackgroundTab,
    handleFeelLucky,
    bgColor, setBgColor,
    imageBgUrl, setImageBgUrl,
    searchQuery, setSearchQuery,
    handleSearchImages, isSearching,
    searchedImages, handleKeywordSearch,
    searchPage,
    isOverlayEnabled, setIsOverlayEnabled,
    overlayColor, setOverlayColor,
    overlayOpacity, setOverlayOpacity,
    gradientBg, setGradientBg,
    setSearchCarouselApi,
    handleApplyTemplate,
    myDesigns,
    handleSaveDesign,
    handleDeleteDesign,
    handleUpdateDesign,
    editingDesignId, 
    handleEditClick,
    handleCancelEdit,
    editingName, setEditingName,
    designToDelete, setDesignToDelete,
    handleLogDesign,
    fileName, setFileName,
    handleDownloadAll,
    designs: myDesigns, // Pass myDesigns as designs prop
    currentSlide, setCurrentSlide,
    handleDownload,
  };

  return (
    <DesignContext.Provider value={value}>
      {children}
    </DesignContext.Provider>
  );
};

export const useDesign = () => {
  const context = useContext(DesignContext);
  if (context === undefined) {
    throw new Error('useDesign must be used within a DesignProvider');
  }
  return context;
};
