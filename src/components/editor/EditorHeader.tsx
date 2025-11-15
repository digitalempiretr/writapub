'use client';
import React from 'react';
import { useDesignEditor } from '@/context/DesignEditorContext';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export const EditorHeader = () => {
    const { state, dispatch } = useDesignEditor();
    const { designs, fileName, currentSlide } = state;

    const setFileName = (name: string) => dispatch({ type: 'SET_STATE', payload: { fileName: name } });

    const handleDownload = (index: number) => {
        // This would need a reference to the canvas, which should be managed in the CanvasContainer
        console.log("Download requested for slide:", index);
    };

    const handleDownloadAll = () => {
        console.log("Download all requested");
    };

    return (
        <header className="w-full text-left p-8 px-4 md:px-4 h-[5vh] md:h-[5vh] flex items-center justify-between flex-shrink-0 z-20 bg-sidebar shadow-sm md:shadow-none ">
            <Logo className="text-[1.2rem] md:text-[1.5rem] text-primary pe-12" />
            {designs.length > 0 && (
                <div className="flex items-center gap-2 w-full max-w-xs">
                    <Input
                        id="file-name-header"
                        name="file-name"
                        type="text"
                        placeholder="Enter file name..."
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        className="bg-sidebar hover:border-primary text-primary h-8 rounded-sm focus:border-indigo-600 focus:outline-hidden text-md bold text-right"
                    />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8 rounded bg-transparent">
                                <Download className="h-4 w-4" color="var(--primary)" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleDownload(currentSlide)} disabled={designs.length === 0}>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download Current</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handleDownloadAll} disabled={designs.length === 0}>
                                <Download className="mr-2 h-4 w-4" />
                                <span>Download All Designs</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </header>
    );
};
