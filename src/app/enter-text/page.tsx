'use client';

import { CreativeMagicPanel } from "@/components/0_creative-magic-panel";
import { Header } from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function EnterTextPage() {
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleGenerate = () => {
        if (!text.trim()) {
            toast({
                title: "No Text Entered",
                description: "Please enter some text to generate designs.",
                variant: "destructive",
            });
            return;
        }
        setIsLoading(true);
        const encodedText = encodeURIComponent(text);
        router.push(`/design?text=${encodedText}`);
    };

    return (
        <div className="flex flex-col h-screen">
            <Header 
                canvasSize={{ name: 'Post', width: 1080, height: 1350 }}
                handleCanvasSizeChange={() => {}}
                canvasSizes={[]}
                zoomLevel={1}
                handleZoom={() => {}}
                resetPanAndZoom={() => {}}
                MIN_ZOOM={0.1}
                MAX_ZOOM={3}
            />
            <main className="flex-1 flex flex-col items-center justify-center p-4">
                <div className="w-full max-w-2xl">
                    <CreativeMagicPanel
                        text={text}
                        setText={setText}
                        handleGenerate={handleGenerate}
                        isLoading={isLoading}
                    />
                </div>
            </main>
        </div>
    )
}
