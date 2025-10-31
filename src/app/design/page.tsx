'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { fabric } from 'fabric';
import { useToast } from '@/hooks/use-toast';
import { DesignTemplate } from '@/lib/design-templates';
import { useMemoFirebase } from '@/firebase/firestore/use-memo-firebase';
import { useUser } from '@/firebase/auth/use-user';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useFirestore } from '@/firebase/provider';
import { useCollection } from '@/firebase/firestore/use-collection';


import { Header } from './components/header';
import { Sidebar } from './components/sidebar';
import { DesignPanel } from './components/design-panel';

const DesignPage: React.FC = () => {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState('templates');
  const [isPanelOpen, setIsPanelOpen] = useState(true);

  const [text, setText] = useState('Bir iş nasıl yapılmaz kursları açılıyor!');
  const [title, setTitle] = useState('Mistik Müzik Festivali Skandalı');
  const [font, setFont] = useState({ value: 'duru-sans', label: 'Duru Sans', fontFamily: 'Duru Sans', weight: '400', size: 48, lineHeight: 1.4 });
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');
  const [color, setColor] = useState('#0F2027');
  
  const [backgroundTab, setBackgroundTab] = useState('image');
  const [bgColor, setBgColor] = useState('#f4fdff');
  const [gradientBg, setGradientBg] = useState({} as any);
  const [imageBgUrl, setImageBgUrl] = useState('https://i.ibb.co/nMxGzn/book-shadow-post.jpg');
  
  const [textBox, setTextBox] = useState({ color: '#f4ede4', opacity: 0 });
  const [overlay, setOverlay] = useState({ color: '#008080', opacity: 0 });
  
  const [effect, setEffect] = useState<any>(null);
  
  const [canvasSize, setCanvasSize] = useState({ name: 'Post', width: 1080, height: 1350 });

  const canvasRef = useRef<fabric.Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const myDesignsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'user_designs'), where('userId', '==', user.uid)) : null
  , [firestore, user]);
  const { data: myDesigns } = useCollection<DesignTemplate>(myDesignsQuery);

  const designTemplatesQuery = useMemoFirebase(() => 
    query(collection(firestore, 'design_templates'))
  , [firestore]);
  const { data: designTemplates } = useCollection<DesignTemplate>(designTemplatesQuery);

  const applyEffect = (textObject: fabric.Textbox, effectValue: any, colorValue: string) => {
    if (effectValue && effectValue.id !== 'none' && textObject) {
      if (effectValue.style.textShadow) {
        const finalShadowString = effectValue.style.textShadow
          .replace(/{{color}}/g, colorValue)
          .replace(/{{glow}}/g, effectValue.style.glowColor || colorValue);
        textObject.set('shadow', new fabric.Shadow(finalShadowString));
      } else {
        textObject.set('shadow', undefined);
      }
      if (effectValue.style.color) {
        textObject.set('fill', effectValue.style.color);
      }
    } else if (textObject) {
      textObject.set('shadow', undefined);
    }
  };

  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let backgroundValue: string | fabric.Gradient = bgColor;
    if (backgroundTab === 'image' && imageBgUrl) {
        fabric.Image.fromURL(imageBgUrl, (img) => {
            canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                scaleX: canvas.width! / img.width!,
                scaleY: canvas.height! / img.height!,
            });
        }, { crossOrigin: 'anonymous' });
    } else {
        canvas.backgroundImage = null;
        if (backgroundTab === 'gradient') backgroundValue = new fabric.Gradient({ ...(gradientBg as any) });
        canvas.backgroundColor = backgroundValue;
    }
    
    // Overlay
    const overlayRect = canvas.getObjects().find(obj => obj.name === 'overlay');
    if (overlayRect) {
      overlayRect.set({
        fill: overlay.color,
        opacity: overlay.opacity
      });
    }

    // Textbox background
    const bgRect = canvas.getObjects().find(obj => obj.name === 'textbox-bg');
    if (bgRect) {
      bgRect.set({
        fill: textBox.color,
        opacity: textBox.opacity
      });
    }

    const textObject = canvas.getObjects().find(obj => obj.type === 'textbox') as fabric.Textbox;
    if (textObject) {
      textObject.set({
        fontFamily: font.fontFamily,
        fill: color,
        textAlign: textAlign,
        fontSize: Number(font.size) || 64,
      });
      applyEffect(textObject, effect, color);
    }

    canvas.renderAll();
  }, [bgColor, backgroundTab, imageBgUrl, gradientBg, overlay, textBox, font, color, textAlign, effect]);

  const addTextToCanvas = (canvasInstance: fabric.Canvas, textValue: string, fontValue: any, colorValue: string, textAlign: string, effectValue: any) => {
    canvasInstance.getObjects().forEach(obj => { if (obj.type === 'textbox') canvasInstance.remove(obj); });
    
    const textObject = new fabric.Textbox(textValue, { left: canvasInstance.width! / 2, top: canvasInstance.height! / 2, originX: 'center', originY: 'center', fontFamily: fontValue.fontFamily, fill: colorValue, fontSize: Number(fontValue.size) || 64, textAlign: textAlign, width: canvasInstance.width! * 0.9 });
    if (effectValue) applyEffect(textObject, effectValue, colorValue);
    canvasInstance.add(textObject);
    canvasInstance.setActiveObject(textObject);
    canvasInstance.renderAll();
  };

  useEffect(() => {
    if (!canvasRef.current && containerRef.current) {
        const canvas = new fabric.Canvas(document.createElement('canvas'));
        containerRef.current.appendChild(canvas.getElement().parentElement!);
        canvasRef.current = canvas;

        const bgRect = new fabric.Rect({ name: 'textbox-bg' });
        const overlayRect = new fabric.Rect({ name: 'overlay', width: canvasSize.width, height: canvasSize.height });
        canvas.add(bgRect, overlayRect);
    }
  }, [canvasSize]);


  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.setDimensions({ width: canvasSize.width, height: canvasSize.height });
      updateCanvas();
      addTextToCanvas(canvas, text, font, color, textAlign, effect);
    }
  }, [canvasSize, text, font, color, textAlign, effect, updateCanvas]);

  const handleSaveDesign = async (designName: string) => {
    if (!user || !firestore) return;
    try {
      const designData = {
        name: designName,
        userId: user.uid,
        background: { type: backgroundTab, value: backgroundTab === 'image' ? imageBgUrl : (backgroundTab === 'gradient' ? gradientBg : bgColor) },
        font: { value: font.value, color: color, fontSize: font.size },
        textBox: textBox,
        overlay: overlay,
        canvasSize: canvasSize.name,
        effect: effect ? { id: effect.id } : null,
      };
      await addDoc(collection(firestore, 'user_designs'), designData);
      toast({ title: 'Design Saved', description: `"${designName}" has been saved.` });
    } catch (error) {
      console.error('Error saving design:', error);
      toast({ title: 'Error', description: 'Could not save design.', variant: 'destructive' });
    }
  };
  
  const handleApplyTemplate = (template: DesignTemplate) => {
    setBackgroundTab(template.background.type);
    if(template.background.type === 'image') setImageBgUrl(template.background.value);
    else if (template.background.type === 'gradient') setGradientBg(JSON.parse(template.background.value));
    else setBgColor(template.background.value);
    
    setFont(template.font as any);
    setColor(template.font.color);
    setTextBox(template.textBox);
    setOverlay(template.overlay);
    setCanvasSize(cs => ({...cs, name: template.canvasSize}));
    if(template.effect) setEffect(template.effect);
    toast({ title: 'Template Applied', description: `"${template.name}" has been applied.` });
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isPanelOpen={isPanelOpen}
        setIsPanelOpen={setIsPanelOpen}
        text={text}
        setText={setText}
        title={title}
        setTitle={setTitle}
        font={font}
        setFont={setFont}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
        color={color}
        setColor={setColor}
        backgroundTab={backgroundTab}
        setBackgroundTab={setBackgroundTab}
        bgColor={bgColor}
        setBgColor={setBgColor}
        gradientBg={gradientBg}
        setGradientBg={setGradientBg}
        imageBgUrl={imageBgUrl}
        setImageBgUrl={setImageBgUrl}
        textBox={textBox}
        setTextBox={setTextBox}
        overlay={overlay}
        setOverlay={setOverlay}
        effect={effect}
        setEffect={setEffect}
        myDesigns={myDesigns || []}
        designTemplates={designTemplates || []}
        handleApplyTemplate={handleApplyTemplate}
        handleSaveDesign={handleSaveDesign}
      />
      <main className="flex-1 flex flex-col items-center justify-center p-4 transition-all duration-300" style={{ marginLeft: isPanelOpen ? '350px' : '0' }}>
        <Header 
          canvasSize={canvasSize} 
          setCanvasSize={setCanvasSize} 
          onDownload={() => {
            const canvas = canvasRef.current;
            if(canvas) {
              const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
              const link = document.createElement('a');
              link.download = 'design.png';
              link.href = dataURL;
              link.click();
            }
          }}
        />
        <div ref={containerRef} className="shadow-lg"></div>
      </main>
    </div>
  );
};

export default DesignPage;
