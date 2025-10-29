
'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Canvas, Textbox, Rect, Gradient, Shadow as FabricShadow } from 'fabric';
import { saveAs } from 'file-saver';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextSettings } from '@/components/3_text-settings';
import { BackgroundSettings } from '@/components/2_background-settings';
import { DesignsPanel } from '@/components/1_templates';
import { MyDesignsPanel } from '@/components/4_favorites';
import { Header } from '@/components/header';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase'; 
import { collection, addDoc, serverTimestamp, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { DesignTemplate } from '@/lib/types'; // Using the canonical type
import { useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'sonner';
import { FontOption, fontOptions } from '@/lib/font-options';
import { Shadow } from '@/components/3_text-settings';
import { textEffects, TextEffect } from '@/lib/text-effects';
import { ImageTemplate, imageTemplates } from '@/lib/image-templates';

// A type for saving to Firestore, omitting the ID that Firestore generates.
type DesignForFirestore = Omit<DesignTemplate, 'id'> & { 
  userId: string;
  createdAt: any; // Firestore server timestamp
  updatedAt: any; // Firestore server timestamp
};

export default function DesignPage() {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  // Text state
  const [text, setText] = useState('PERSONALIZE');
  const [activeFont, setActiveFont] = useState<FontOption>(fontOptions[0]);
  const [textColor, setTextColor] = useState('#ffffff');
  const [textOpacity, setTextOpacity] = useState(1);
  const [isBold, setIsBold] = useState(false);
  const [isUppercase, setIsUppercase] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('center');
  const [textShadowEnabled, setTextShadowEnabled] = useState(false);
  const [shadows, setShadows] = useState<Shadow[]>([]);
  const [textStroke, setTextStroke] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [isTextBoxEnabled, setIsTextBoxEnabled] = useState(false);
  const [rectBgColor, setRectBgColor] = useState('#000000');
  const [rectOpacity, setRectOpacity] = useState(0.5);
  const [activeEffect, setActiveEffect] = useState<TextEffect>(textEffects[0]);

  // Background state
  const [backgroundTab, setBackgroundTab] = useState('templates');
  const [bgColor, setBgColor] = useState('#000000');
  const [gradientBg, setGradientBg] = useState('');
  const [imageBgUrl, setImageBgUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchedImages, setSearchedImages] = useState<string[]>([]);
  const [searchPage, setSearchPage] = useState(1);
  const [isOverlayEnabled, setIsOverlayEnabled] = useState(false);
  const [overlayColor, setOverlayColor] = useState('#000000');
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [searchCarouselApi, setSearchCarouselApi] = useState<any>();

  // General state
  const [activeTab, setActiveTab] = useState('templates');
  const [editingDesignId, setEditingDesignId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [designToDelete, setDesignToDelete] = useState<string | null>(null);

  const { user } = useUser();
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const templateId = searchParams.get('templateId');

  const myDesignsQuery = useMemoFirebase(() => user && firestore ? collection(firestore, 'users', user.uid, 'designs') : null, [user, firestore]);
  const { data: myDesigns, isLoading: areMyDesignsLoading } = useCollection<DesignTemplate>(myDesignsQuery);

  const designTemplatesQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return collection(firestore, 'design-templates');
  }, [firestore]);
  const { data: designTemplates, isLoading: areTemplatesLoading } = useCollection<DesignTemplate>(designTemplatesQuery);

  const templateDocRef = useMemoFirebase(() => {
    if (!firestore || !templateId) return null;
    if (myDesigns?.some(d => d.id === templateId)) {
        return doc(firestore, 'users', user!.uid, 'designs', templateId);
    }
    return doc(firestore, 'design-templates', templateId);
  }, [firestore, templateId, myDesigns, user]);

  const { data: initialTemplate, isLoading: isTemplateLoading } = useDoc<DesignTemplate>(templateDocRef);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricOverlayRef = useRef<Rect | null>(null);

  const initializeCanvas = () => {
    if (canvasRef.current && containerRef.current) {
      const container = containerRef.current;
      const initialCanvas = new Canvas(canvasRef.current, { width: container.offsetWidth, height: container.offsetHeight, backgroundColor: bgColor });
      setCanvas(initialCanvas);
    }
  };

  const updateCanvas = () => {
    if (!canvas) return;

    // Background
    let backgroundValue: string | Gradient = bgColor;
    if (backgroundTab === 'image' && imageBgUrl) {
      canvas.setBackgroundColor('', canvas.renderAll.bind(canvas));
      canvas.setBackgroundImage(imageBgUrl, canvas.renderAll.bind(canvas), { crossOrigin: 'anonymous' });
    } else {
      canvas.backgroundImage = null; // Clear background image first
      if (backgroundTab === 'gradient') {
        backgroundValue = new Gradient({ ...(gradientBg as any) });
      }
      // Direct property assignment instead of function call
      canvas.backgroundColor = backgroundValue;
      canvas.renderAll();
    }
    
    // Overlay
    if (isOverlayEnabled) {
        if (!fabricOverlayRef.current) {
            fabricOverlayRef.current = new Rect({ left: 0, top: 0, width: canvas.getWidth(), height: canvas.getHeight(), selectable: false, evented: false });
            canvas.add(fabricOverlayRef.current);
        }
        fabricOverlayRef.current.set({ fill: overlayColor, opacity: overlayOpacity });
    } else if (fabricOverlayRef.current) {
        canvas.remove(fabricOverlayRef.current);
        fabricOverlayRef.current = null;
    }

    // Text
    const activeObject = canvas.getActiveObject();
    if (activeObject?.type === 'textbox') {
      const textObject = activeObject as Textbox;
      textObject.set({ text: isUppercase ? text.toUpperCase() : text, fontFamily: activeFont.fontFamily, fill: textColor, opacity: textOpacity, fontWeight: isBold ? 'bold' : 'normal', textAlign: textAlign, stroke: textStroke ? strokeColor : undefined, strokeWidth: textStroke ? strokeWidth : 0, shadow: textShadowEnabled && shadows.length > 0 ? new FabricShadow({ color: shadows[0].color, blur: shadows[0].blur, offsetX: shadows[0].offsetX, offsetY: shadows[0].offsetY }) : undefined, backgroundColor: isTextBoxEnabled ? rectBgColor : undefined });
      if (activeEffect?.id !== 'none') applyEffect(textObject, activeEffect, textColor);
      textObject.setCoords();
      canvas.renderAll();
    } else if (!activeObject && text) {
      addTextToCanvas(canvas, text, activeFont, textColor, activeEffect);
    }
  };

  const addTextToCanvas = (canvasInstance: Canvas, textValue: string, fontValue: any, colorValue: string, effectValue: any) => {
    canvasInstance.clear();
    const textObject = new Textbox(textValue, { left: canvasInstance.width! / 2, top: canvasInstance.height! / 2, originX: 'center', originY: 'center', fontFamily: fontValue.fontFamily, fill: colorValue, fontSize: Number(fontValue.size) || 64, textAlign: textAlign, width: canvasInstance.width! * 0.9 });
    if (effectValue) applyEffect(textObject, effectValue, colorValue);
    canvasInstance.add(textObject).setActiveObject(textObject);
    canvasInstance.renderAll();
  };

  const applyEffect = (textObject: Textbox, effect: any, color: string) => {
    const finalColor = effect.style.color || color;
    textObject.set('fill', finalColor);
    if (effect.style.fontFamily) textObject.set('fontFamily', effect.style.fontFamily);
    if (effect.style.stroke) { textObject.set('stroke', effect.style.stroke); textObject.set('strokeWidth', effect.style.strokeWidth); }
    if (effect.style.textShadow) {
        const shadowString = effect.style.textShadow.replace(/{{color}}/g, finalColor).replace(/{{glow}}/g, effect.style.glowColor || finalColor);
        textObject.set('shadow', new FabricShadow(shadowString));
    }
    textObject.setCoords();
  };

  useEffect(() => { initializeCanvas(); const handleResize = () => { if (canvas && containerRef.current) { canvas.setWidth(containerRef.current.offsetWidth); canvas.setHeight(containerRef.current.offsetHeight); canvas.renderAll(); } }; window.addEventListener('resize', handleResize); return () => { window.removeEventListener('resize', handleResize); canvas?.dispose(); }; }, []);

  useEffect(() => { if (canvas) updateCanvas(); }, [text, activeFont, textColor, textOpacity, isBold, isUppercase, textAlign, textShadowEnabled, shadows, textStroke, strokeColor, strokeWidth, isTextBoxEnabled, rectBgColor, rectOpacity, activeEffect, backgroundTab, bgColor, gradientBg, imageBgUrl, isOverlayEnabled, overlayColor, overlayOpacity, canvas]);

  useEffect(() => { if (initialTemplate) handleApplyTemplate(initialTemplate, true); }, [initialTemplate]);

  const handleApplyTemplate = (template: DesignTemplate, fromUrl = false) => {
    if (!template) return;
    setText(template.name); // No `text` field in type, using name as placeholder
    setActiveFont(fontOptions.find(f => f.value === template.font.value) || fontOptions[0]);
    setTextColor(template.font.color);
    setBackgroundTab(template.background.type);
    if (template.background.type === 'flat') setBgColor(template.background.value);
    else if (template.background.type === 'gradient') setGradientBg(template.background.value);
    else setImageBgUrl(template.background.value);
    setIsTextBoxEnabled(template.textBox.opacity > 0);
    setRectBgColor(template.textBox.color);
    setRectOpacity(template.textBox.opacity);
    setIsOverlayEnabled(template.overlay.opacity > 0);
    setOverlayColor(template.overlay.color);
    setOverlayOpacity(template.overlay.opacity);
    setActiveEffect(textEffects.find(e => e.id === template.effect?.id) || textEffects[0]);
    if (!fromUrl) toast.success(`Template "${template.name}" applied!`);
  };

  const handleSaveDesign = async () => {
    if (!user || !firestore) { toast.error('You must be logged in to save a design.'); return; }
    const name = prompt("Enter a name for your design:");
    if (!name) return;
    const toastId = toast.loading('Saving design...');
    try {
        const designData: DesignForFirestore = {
            name, category: 'Favorites', previewImage: canvas?.toDataURL() || '',
            background: { type: backgroundTab, value: backgroundTab === 'flat' ? bgColor : backgroundTab === 'gradient' ? gradientBg : imageBgUrl },
            font: { value: activeFont.value, color: textColor, fontSize: Number(activeFont.size) },
            textBox: { color: rectBgColor, opacity: isTextBoxEnabled ? rectOpacity : 0 },
            overlay: { color: overlayColor, opacity: isOverlayEnabled ? overlayOpacity : 0 },
            canvasSize: 'Post',
            effect: { id: activeEffect.id },
            userId: user.uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp()
        };
        await addDoc(collection(firestore, 'users', user.uid, 'designs'), designData);
        toast.success('Design saved!', { id: toastId });
    } catch (error) { console.error('Error saving design: ', error); toast.error('Failed to save.', { id: toastId }); }
  };
  
  const handleDeleteDesign = async (id: string) => { if (!user || !firestore) return; const toastId = toast.loading('Deleting...'); try { await deleteDoc(doc(firestore, 'users', user.uid, 'designs', id)); toast.success('Deleted!', { id: toastId }); setDesignToDelete(null); } catch (e) { toast.error('Failed to delete.', { id: toastId }); } };
  const handleUpdateDesign = async (id: string) => { if (!user || !firestore || !editingName) return; const toastId = toast.loading('Updating...'); try { await setDoc(doc(firestore, 'users', user.uid, 'designs', id), { name: editingName, updatedAt: serverTimestamp() }, { merge: true }); toast.success('Updated!', { id: toastId }); setEditingDesignId(null); setEditingName(''); } catch (e) { toast.error('Failed to update.', { id: toastId }); } };
  const handleEditClick = (id: string, name: string) => { setEditingDesignId(id); setEditingName(name); };
  const handleCancelEdit = () => { setEditingDesignId(null); setEditingName(''); };
  const handleExport = (format: 'png' | 'jpeg' | 'svg') => { if (canvas) { const fileName = `${text.replace(/\s+/g, '-').toLowerCase()}.${format}`; let dataUrl; if (format === 'svg') dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(canvas.toSVG())}`; else dataUrl = canvas.toDataURL({ format, quality: 0.9 }); saveAs(dataUrl, fileName); toast.success(`Exported as ${format.toUpperCase()}`); } };
  const handleGenerate = () => toast.info("Generate is not implemented.");
  const handleFeelLucky = () => handleImageBgUrlSelect(imageTemplates[Math.floor(Math.random() * imageTemplates.length)]);
  const handleKeywordSearch = (keyword: string) => { setSearchQuery(keyword); handleSearchImages(1); };
  const handleSearchImages = async (page = 1) => { if (!searchQuery) return; setIsSearching(true); setSearchPage(page); try { setSearchedImages([]); toast.info('Image search is not implemented.'); } catch (e) { toast.error('Image search failed.'); } finally { setIsSearching(false); } };
  const handleBgColorSelect = (color: string) => { setBgColor(color); setBackgroundTab('flat'); };
  const handleGradientBgSelect = (css: string) => { setGradientBg(css); setBackgroundTab('gradient'); };
  const handleImageBgUrlSelect = (template: ImageTemplate) => { setImageBgUrl(template.imageUrls.post); setBackgroundTab('image'); };

  return (
    <>
      <Toaster richColors />
      <Header />
      <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)] bg-background">
        <div className="w-full lg:w-[350px] bg-card text-card-foreground lg:h-full lg:overflow-y-auto shrink-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-none lg:grid-cols-2 xl:grid-cols-4"><TabsTrigger value="templates">Templates</TabsTrigger><TabsTrigger value="background">Background</TabsTrigger><TabsTrigger value="text">Text</TabsTrigger><TabsTrigger value="favorites">My Designs</TabsTrigger></TabsList>
                <TabsContent value="text"><TextSettings text={text} setText={setText} handleGenerate={handleGenerate} isLoading={isSearching} textColor={textColor} setTextColor={setTextColor} textOpacity={textOpacity} setTextOpacity={setTextOpacity} activeFont={activeFont} setActiveFont={setActiveFont} fontOptions={fontOptions} isBold={isBold} setIsBold={setIsBold} isUppercase={isUppercase} setIsUppercase={setIsUppercase} textAlign={textAlign} setTextAlign={setTextAlign} textShadowEnabled={textShadowEnabled} setTextShadowEnabled={setTextShadowEnabled} shadows={shadows} setShadows={setShadows} textStroke={textStroke} setTextStroke={setTextStroke} strokeColor={strokeColor} setStrokeColor={setStrokeColor} strokeWidth={strokeWidth} setStrokeWidth={setStrokeWidth} rectBgColor={rectBgColor} setRectBgColor={setRectBgColor} rectOpacity={rectOpacity} setRectOpacity={setRectOpacity} isTextBoxEnabled={isTextBoxEnabled} setIsTextBoxEnabled={setIsTextBoxEnabled} activeEffect={activeEffect} setActiveEffect={setActiveEffect} /></TabsContent>
                <TabsContent value="background"><BackgroundSettings backgroundTab={backgroundTab} setBackgroundTab={setBackgroundTab} handleFeelLucky={handleFeelLucky} bgColor={bgColor} handleBgColorSelect={handleBgColorSelect} imageBgUrl={imageBgUrl} handleImageBgUrlSelect={handleImageBgUrlSelect} searchQuery={searchQuery} setSearchQuery={setSearchQuery} handleSearchImages={handleSearchImages} isSearching={isSearching} searchedImages={searchedImages} handleKeywordSearch={handleKeywordSearch} searchPage={searchPage} isOverlayEnabled={isOverlayEnabled} setIsOverlayEnabled={setIsOverlayEnabled} overlayColor={overlayColor} setOverlayColor={setOverlayColor} overlayOpacity={overlayOpacity} setOverlayOpacity={setOverlayOpacity} gradientBg={gradientBg} handleGradientBgSelect={handleGradientBgSelect} setSearchCarouselApi={setSearchCarouselApi} /></TabsContent>
                <TabsContent value="templates"><DesignsPanel designTemplates={designTemplates || []} handleApplyTemplate={handleApplyTemplate} /></TabsContent>
                <TabsContent value="favorites"><MyDesignsPanel myDesigns={myDesigns || []} handleSaveDesign={handleSaveDesign} handleDeleteDesign={handleDeleteDesign} handleUpdateDesign={handleUpdateDesign} editingDesignId={editingDesignId} handleEditClick={handleEditClick} handleCancelEdit={handleCancelEdit} editingName={editingName} setEditingName={setEditingName} designToDelete={designToDelete} setDesignToDelete={setDesignToDelete} handleApplyTemplate={handleApplyTemplate}/></TabsContent>
            </Tabs>
        </div>
        <div ref={containerRef} className="flex-grow flex items-center justify-center bg-muted/40 p-4 relative h-full w-full">
            {(isTemplateLoading || areMyDesignsLoading) && templateId && (<div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20"><div className="text-center"><p className="text-lg font-semibold">Loading Template...</p><p className="text-sm text-muted-foreground">Please wait a moment.</p></div></div>)}
            <canvas ref={canvasRef} />
        </div>
        <div className="w-full lg:w-[200px] bg-card text-card-foreground p-4 flex flex-col gap-4 justify-start shrink-0">
            <h3 className="text-lg font-semibold text-center">Export</h3>
            <Button onClick={() => handleExport('png')}>Export as PNG</Button>
            <Button onClick={() => handleExport('jpeg')}>Export as JPEG</Button>
            <Button onClick={() => handleExport('svg')}>Export as SVG</Button>
        </div>
      </div>
    </>
  );
}
